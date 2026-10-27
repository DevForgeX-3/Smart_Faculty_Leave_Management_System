import React, { useState, useEffect, useCallback } from 'react';
import RegisterView from './components/RegisterView';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import HODDashboardView from './components/HODDashboardView';
import AdminDashboardView from './components/AdminDashboardView';
import Toast from './components/Toast';

export default function App() {
  const [currentView, setCurrentView] = useState('register');
  const [toasts, setToasts] = useState([]);

  // Registration data cache to autofill login
  const [registeredData, setRegisteredData] = useState({
    fullName: '',
    email: '',
    department: '',
    password: '',
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Safe navigation enforcing Role-Based Access Control
  const navigateTo = useCallback((view, replace = false, user = currentUser) => {
    let resolvedView = view;

    // Handle Logout
    if (resolvedView === 'login') {
      localStorage.removeItem('token');
      setCurrentUser(null);
      user = null;
    }

    // Role-Based Route Guards
    if (['faculty', 'dashboard', 'hod', 'admin'].includes(resolvedView)) {
      if (!user) {
        resolvedView = 'login';
      } else {
        const userRole = (user.role || 'faculty').toLowerCase();
        if ((resolvedView === 'faculty' || resolvedView === 'dashboard') && userRole !== 'faculty') {
          resolvedView = userRole;
        } else if (resolvedView === 'hod' && userRole !== 'hod') {
          showToast('Access denied: You do not have HOD permissions.', 'error');
          resolvedView = userRole;
        } else if (resolvedView === 'admin' && userRole !== 'admin') {
          showToast('Access denied: You do not have Administrator permissions.', 'error');
          resolvedView = userRole;
        }
      }
    }

    if (replace) {
      window.history.replaceState({ view: resolvedView }, '', `#${resolvedView}`);
    } else {
      window.history.pushState({ view: resolvedView }, '', `#${resolvedView}`);
    }
    setCurrentView(resolvedView);
  }, [currentUser, showToast]);

  // Authenticate user on mount via JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const userObj = data.user || data.data?.user || data.data;
            if (userObj) {
              userObj.role = (userObj.role || 'faculty').toLowerCase();
              setCurrentUser(userObj);
              const hash = window.location.hash.replace('#', '');
              if (!hash || hash === 'login' || hash === 'register') {
                navigateTo(userObj.role, true, userObj);
              } else {
                navigateTo(hash, true, userObj);
              }
            } else {
              localStorage.removeItem('token');
              setCurrentUser(null);
              navigateTo('login', true, null);
            }
          } else {
            localStorage.removeItem('token');
            setCurrentUser(null);
            navigateTo('login', true, null);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setCurrentUser(null);
          navigateTo('login', true, null);
        })
        .finally(() => setIsLoadingAuth(false));
    } else {
      setIsLoadingAuth(false);
      const hash = window.location.hash.replace('#', '');
      if (['faculty', 'dashboard', 'hod', 'admin'].includes(hash)) {
        navigateTo('login', true, null);
      } else if (hash === 'login' || hash === 'register') {
        setCurrentView(hash);
      }
    }
  }, [navigateTo]);

  // Synchronize browser navigation (Back / Forward) with RBAC validation
  useEffect(() => {
    const handlePopState = (event) => {
      const targetView =
        (event.state && event.state.view) ||
        window.location.hash.replace('#', '') ||
        'register';

      navigateTo(targetView, true, currentUser);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser, navigateTo]);

  const handleRegisterSuccess = (formData) => {
    setRegisteredData(formData);
    showToast('Registration successful! Please sign in with your credentials.', 'success');
  };

  const handleLoginSuccess = (payload) => {
    const token = payload?.token || payload?.data?.token;
    const user = payload?.user || payload?.data?.user || payload;
    if (token) {
      localStorage.setItem('token', token);
    }
    if (user) {
      user.role = (user.role || 'faculty').toLowerCase();
      setCurrentUser(user);
      const displayName = user.name || user.fullName || 'User';
      showToast(`Welcome back, ${displayName}! (${user.role.toUpperCase()})`, 'success');
      navigateTo(user.role, false, user);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigateTo('login', true, null);
    showToast('You have been signed out successfully.', 'info');
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 antialiased text-slate-800">
      {/* Routed Views */}
      <div className="flex-1 w-full flex flex-col">
        {isLoadingAuth ? (
          <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-xs font-medium text-slate-500">Loading session...</span>
            </div>
          </div>
        ) : (
          <>
            {currentView === 'register' && (
              <RegisterView
                onNavigate={(view) => navigateTo(view, false, currentUser)}
                onRegisterSuccess={handleRegisterSuccess}
                registeredData={registeredData}
                setRegisteredData={setRegisteredData}
              />
            )}

            {currentView === 'login' && (
              <LoginView
                onNavigate={(view) => navigateTo(view, false, currentUser)}
                registeredData={registeredData}
                onLoginSuccess={handleLoginSuccess}
              />
            )}

            {(currentView === 'faculty' || currentView === 'dashboard') &&
              currentUser &&
              currentUser.role?.toLowerCase() === 'faculty' && (
                <DashboardView
                  user={currentUser}
                  onNavigate={(view) => {
                    if (view === 'login') {
                      handleLogout();
                    } else {
                      navigateTo(view, false, currentUser);
                    }
                  }}
                  showToast={showToast}
                />
              )}

            {currentView === 'hod' && currentUser && currentUser.role?.toLowerCase() === 'hod' && (
              <HODDashboardView
                user={currentUser}
                onNavigate={(view) => {
                  if (view === 'login') {
                    handleLogout();
                  } else {
                    navigateTo(view, false, currentUser);
                  }
                }}
                showToast={showToast}
              />
            )}

            {currentView === 'admin' && currentUser && currentUser.role?.toLowerCase() === 'admin' && (
              <AdminDashboardView
                user={currentUser}
                onNavigate={(view) => {
                  if (view === 'login') {
                    handleLogout();
                  } else {
                    navigateTo(view, false, currentUser);
                  }
                }}
                showToast={showToast}
              />
            )}
          </>
        )}
      </div>

      {/* Floating Notifications */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
