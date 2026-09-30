import React, { useState, useEffect } from 'react';
import RegisterView from './components/RegisterView';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import HODDashboardView from './components/HODDashboardView';
import AdminDashboardView from './components/AdminDashboardView';
import Toast from './components/Toast';

export default function App() {
  // Single-page router state: 'register' | 'login' | 'faculty' | 'hod' | 'admin'
  const [currentView, setCurrentView] = useState('register');
  const [toasts, setToasts] = useState([]);

  // Faculty user state
  const [registeredData, setRegisteredData] = useState({
    fullName: '',
    email: '',
    department: '',
    password: '',
  });

  const [currentUser, setCurrentUser] = useState({
    role: 'faculty',
    name: 'Prof. Eleanor Vance',
    email: 'e.vance@university.edu',
    department: 'Department of Information Technology',
  });

  // Sync with browser history (popstate) so Back and Forward buttons work seamlessly
  useEffect(() => {
    const validViews = ['register', 'login', 'faculty', 'hod', 'admin'];
    const currentHash = window.location.hash.replace('#', '');

    if (validViews.includes(currentHash)) {
      setCurrentView(currentHash);
    } else {
      window.history.replaceState({ view: 'register' }, '', '#register');
    }

    const handlePopState = (event) => {
      if (event.state && event.state.view && validViews.includes(event.state.view)) {
        setCurrentView(event.state.view);
      } else {
        const hash = window.location.hash.replace('#', '');
        if (validViews.includes(hash)) {
          setCurrentView(hash);
        } else {
          setCurrentView('register');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Safe navigation that pushes history entry so clicking back doesn't close or exit the app
  const navigateTo = (view, replace = false) => {
    if (replace) {
      window.history.replaceState({ view }, '', `#${view}`);
    } else {
      window.history.pushState({ view }, '', `#${view}`);
    }
    setCurrentView(view);
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleRegisterSuccess = (formData) => {
    setRegisteredData(formData);
    setCurrentUser({
      role: 'faculty',
      name: formData.fullName,
      email: formData.email,
      department: formData.department,
    });
    showToast('Registration successful! Please sign in to your faculty portal.', 'success');
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    showToast(`Signed in as ${userData.name} (${userData.role?.toUpperCase()})`, 'success');
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 antialiased text-slate-800">
      {/* Main Full-Screen Routed Views */}
      <div className="flex-1 w-full flex flex-col">
        {currentView === 'register' && (
          <RegisterView
            onNavigate={(view) => navigateTo(view)}
            onRegisterSuccess={handleRegisterSuccess}
            registeredData={registeredData}
          />
        )}

        {currentView === 'login' && (
          <LoginView
            onNavigate={(view) => navigateTo(view)}
            registeredData={registeredData}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {(currentView === 'faculty' || currentView === 'dashboard') && (
          <DashboardView
            user={currentUser}
            onNavigate={(view) => navigateTo(view)}
            showToast={showToast}
          />
        )}

        {currentView === 'hod' && (
          <HODDashboardView
            onNavigate={(view) => navigateTo(view)}
            showToast={showToast}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardView
            onNavigate={(view) => navigateTo(view)}
            showToast={showToast}
          />
        )}
      </div>

      {/* Floating Notifications */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
