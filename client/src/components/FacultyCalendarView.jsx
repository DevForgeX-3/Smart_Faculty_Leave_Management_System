import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Building2,
  Sparkles,
  MapPin,
  Briefcase,
  Layers,
  Info
} from 'lucide-react';

// Institutional Academic Calendar Data across Semesters (September 2026 – January 2027)
const COLLEGE_ACADEMIC_DATES = {
  // September 2026
  '2026-09-05': {
    type: 'holiday',
    badge: 'College Event',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'Teachers’ Day Celebration & Academic Council Honors',
    academicNotes: 'Special institutional assembly and faculty research felicitations in College Auditorium.',
    lectures: [],
  },
  '2026-09-15': {
    type: 'meeting',
    badge: 'Technical Symposium',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Engineers’ Day National Project Exhibition & Hackathon',
    academicNotes: 'Jury duty for B.Tech project exhibits and keynote address on Cloud Infrastructure.',
    lectures: [
      { time: '10:00 AM – 01:00 PM', code: 'JURY-EVAL', subject: 'Capstone Project Evaluation Jury' },
      { time: '02:30 PM – 04:00 PM', code: 'KEYNOTE', subject: 'Guest Lecture on Cloud Scalability' },
    ],
  },
  '2026-09-18': {
    type: 'exam',
    badge: 'Exam Submission',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'Unit Test-I Question Papers & Scheme of Evaluation Due',
    academicNotes: 'Strict submission deadline to Department Examination Cell with bloom taxonomy mappings.',
    lectures: [
      { time: '11:30 AM – 01:30 PM', code: 'CS-307', subject: 'Cloud Computing Lab (Systems Lab 2)' },
    ],
  },
  '2026-09-21': {
    type: 'exam',
    badge: 'Unit Test-I',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'Unit Test-I Theory Examinations Commence',
    academicNotes: 'Paper: CS-301 Operating Systems (Hall LH-102). Mandatory faculty invigilation.',
    lectures: [
      { time: '10:00 AM – 11:30 AM', code: 'EXAM-INV', subject: 'Invigilation Slot 1 • Hall LH-102' },
      { time: '02:00 PM – 04:00 PM', code: 'EVAL-01', subject: 'Answer Script Audit & Spot Valuation' },
    ],
  },
  '2026-09-28': {
    type: 'holiday',
    badge: 'Gazetted Holiday',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    title: 'Anant Chaturdashi / Ganesh Visarjan',
    academicNotes: 'Gazetted State Holiday • Campus Administrative & Academic Closure.',
    lectures: [],
  },

  // October 2026
  '2026-10-01': {
    type: 'instructional',
    badge: 'Teaching Day',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    title: 'Regular Instruction & Practical Sessions',
    academicNotes: 'Semester Week 9 • Commencement of Term Work Phase-2.',
    lectures: [
      { time: '09:30 AM – 10:30 AM', code: 'CS-301', subject: 'Operating Systems (Lecture Hall 102)' },
      { time: '11:30 AM – 01:30 PM', code: 'CS-307', subject: 'OS Kernel & Systems Lab (Lab 4, Batch B)' },
    ],
    duty: 'Department Attendance Monitoring Committee',
  },
  '2026-10-02': {
    type: 'holiday',
    badge: 'Gazetted Holiday',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    title: 'Mahatma Gandhi Jayanti',
    academicNotes: 'Official National Holiday declared by State University & College Council.',
    leave: {
      type: 'Casual Leave (CL)',
      status: 'Pending HOD',
      statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
      proxy: 'Dr. Sunita Rao',
      proxyNotes: 'Station leave requested for personal family commitment. Substitute on standby.',
      appId: 'APP-2026-915',
    },
    lectures: [],
  },
  '2026-10-03': {
    type: 'holiday',
    badge: 'Institutional Off',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Non-Instructional Saturday (Institutional Recess)',
    academicNotes: 'Administrative offices operational until 1:00 PM; no academic lectures scheduled.',
    leave: {
      type: 'Casual Leave (CL)',
      status: 'Pending HOD',
      statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
      proxy: 'Dr. Sunita Rao',
      proxyNotes: 'Station leave extension. Verified by department office.',
      appId: 'APP-2026-915',
    },
    lectures: [],
  },
  '2026-10-05': {
    type: 'exam',
    badge: 'Unit Test-II',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'Unit Test-II Examinations Begin (TE & BE Computer Science)',
    academicNotes: 'Invigilation Slot 1: 10:00 AM – 11:30 AM (Exam Hall 304). Paper: CS-301 Operating Systems.',
    lectures: [
      { time: '10:00 AM – 11:30 AM', code: 'EXAM-INV', subject: 'Invigilation Duty • Hall 304 (TE Comp)' },
      { time: '02:30 PM – 04:30 PM', code: 'CS-301', subject: 'Evaluations & Answer Script Auditing' },
    ],
  },
  '2026-10-06': {
    type: 'exam',
    badge: 'Unit Test-II',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'Unit Test-II Day 2: Advanced Computer Networks',
    academicNotes: 'Evaluation moderation session with external reviewer scheduled at 3:00 PM.',
    lectures: [
      { time: '09:30 AM – 11:30 AM', code: 'LAB-EVAL', subject: 'Practical Continuous Assessment' },
      { time: '03:00 PM – 04:30 PM', code: 'AUDIT', subject: 'Moderation of Test Questions' },
    ],
  },
  '2026-10-08': {
    type: 'meeting',
    badge: 'Department Meeting',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Department Academic Advisory Board (DAAB) Meeting',
    academicNotes: 'Review of midterm syllabus completion, defaulter lists, and lab equipment calibration.',
    lectures: [
      { time: '09:30 AM – 10:30 AM', code: 'CS-301', subject: 'Operating Systems (Lecture Hall 102)' },
      { time: '03:30 PM – 05:00 PM', code: 'DAAB-02', subject: 'Department Advisory Council (Conference Room)' },
    ],
  },
  '2026-10-12': {
    type: 'meeting',
    badge: 'NBA / IQAC Audit',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    title: 'Internal Quality Assurance (IQAC / NBA) Departmental Audit',
    academicNotes: 'Course outcome (CO-PO) mapping verification and course file submission.',
    lectures: [
      { time: '10:00 AM – 12:00 PM', code: 'IQAC-REV', subject: 'Course File & Rubric Inspection' },
      { time: '02:00 PM – 03:00 PM', code: 'CS-301', subject: 'Operating Systems Remedial Class' },
    ],
  },
  '2026-10-14': {
    type: 'duty',
    badge: 'Duty Leave (Approved)',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'IEEE International Conference on Distributed Cloud Systems',
    academicNotes: 'Deputation sponsored under Faculty Research Fellowship. Venue: IISc Bengaluru.',
    leave: {
      type: 'Duty Leave (DL)',
      status: 'Approved',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      proxy: 'Dr. Sunita Rao',
      proxyNotes: 'Substituted 2 theory lectures (CS-301) and 1 lab session. Coverage confirmed by HOD.',
      appId: 'APP-2026-892',
    },
    lectures: [
      { time: 'All Day', code: 'DUTY-CONF', subject: 'Keynote & Paper Presentation (Deputed by Principal)' },
    ],
  },
  '2026-10-15': {
    type: 'duty',
    badge: 'Duty Leave (Approved)',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'IEEE Conference Day 2: Academic Panel & Technical Session',
    academicNotes: 'Chairing Track 4: Cloud Security and Distributed Ledger Systems.',
    leave: {
      type: 'Duty Leave (DL)',
      status: 'Approved',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      proxy: 'Dr. Sunita Rao',
      proxyNotes: 'Substituted 2 theory lectures (CS-301). Timetable proxy log verified.',
      appId: 'APP-2026-892',
    },
    lectures: [
      { time: 'All Day', code: 'DUTY-CONF', subject: 'Technical Session Chair (Deputed by Principal)' },
    ],
  },
  '2026-10-19': {
    type: 'holiday',
    badge: 'College Vacation',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Autumn Recess & Dussehra Vacation (Day 1)',
    academicNotes: 'Official semester break declared by College Governing Body. No regular classes.',
    lectures: [],
  },
  '2026-10-20': {
    type: 'holiday',
    badge: 'College Vacation',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Dussehra / Vijayadashami (National Holiday)',
    academicNotes: 'Campus closed for Vijayadashami celebration.',
    lectures: [],
  },
  '2026-10-21': {
    type: 'holiday',
    badge: 'College Vacation',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Autumn Recess (Day 3)',
    academicNotes: 'Mid-term vacation period for students and faculty.',
    lectures: [],
  },
  '2026-10-22': {
    type: 'holiday',
    badge: 'College Vacation',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Autumn Recess (Day 4)',
    academicNotes: 'Mid-term vacation period for students and faculty.',
    lectures: [],
  },
  '2026-10-23': {
    type: 'holiday',
    badge: 'College Vacation',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Autumn Recess (Day 5)',
    academicNotes: 'Faculty research and preparation window.',
    lectures: [],
  },
  '2026-10-24': {
    type: 'instructional',
    badge: 'Today • Academic Day',
    badgeColor: 'bg-blue-600 text-white font-bold',
    title: 'Term-II Academic Instruction Resumes',
    academicNotes: 'Post-vacation attendance check and syllabus audit for remaining weeks.',
    lectures: [
      { time: '09:30 AM – 10:30 AM', code: 'CS-301', subject: 'Operating Systems (Lecture Hall 102)' },
      { time: '02:00 PM – 03:30 PM', code: 'MENTOR', subject: 'Class Mentorship & Counseling (Room 314)' },
    ],
  },
  '2026-10-26': {
    type: 'exam',
    badge: 'Academic Deadline',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'Continuous Evaluation & Term Work Submission Deadline',
    academicNotes: 'Final submission deadline for Assignment 3 and Mini Project Stage-1 reports.',
    lectures: [
      { time: '11:30 AM – 01:30 PM', code: 'CS-307', subject: 'Lab Project Milestone Verification' },
    ],
  },
  '2026-10-28': {
    type: 'meeting',
    badge: 'FDP Workshop',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'Faculty Development Program on AI in Engineering Curricula',
    academicNotes: 'Sponsored by Department of Higher Education (Auditorium Hall B).',
    lectures: [
      { time: '10:00 AM – 04:00 PM', code: 'FDP-AI', subject: 'Hands-on Generative AI for Academic Faculty' },
    ],
  },
  '2026-10-30': {
    type: 'instructional',
    badge: 'Project Review',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    title: 'Final Year Major Project Stage-1 Review',
    academicNotes: 'Evaluation panel with external industrial mentor.',
    lectures: [
      { time: '09:30 AM – 01:00 PM', code: 'PROJ-REV', subject: 'BE Project Stage-1 Panel Viva (Seminar Hall)' },
    ],
  },
  '2026-10-31': {
    type: 'meeting',
    badge: 'Monthly Audit',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    title: 'Monthly Attendance Defaulters List & Parent Intimation',
    academicNotes: 'Department review of students having below 75% biometric attendance.',
    lectures: [
      { time: '11:00 AM – 12:30 PM', code: 'DEPT-AUDIT', subject: 'HOD Attendance Review Meeting' },
    ],
  },

  // November 2026
  '2026-11-02': {
    type: 'instructional',
    badge: 'CIE Review',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    title: 'Continuous Internal Evaluation (CIE) Marks Review',
    academicNotes: 'Display of internal assessment scores for student grievance resolution.',
    lectures: [
      { time: '09:30 AM – 10:30 AM', code: 'CS-301', subject: 'Operating Systems (Hall 102)' },
      { time: '11:30 AM – 01:30 PM', code: 'CS-307', subject: 'Cloud Systems Architecture Lab' },
    ],
  },
  '2026-11-04': {
    type: 'meeting',
    badge: 'Board of Studies',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Department Board of Studies (BoS) Curriculum Revision',
    academicNotes: 'Academic Council syllabus revision meeting for upcoming 2027 curriculum.',
    lectures: [
      { time: '10:00 AM – 01:00 PM', code: 'BOS-MTG', subject: 'Board of Studies Conference (Senate Room)' },
    ],
  },
  '2026-11-08': {
    type: 'holiday',
    badge: 'Festival Holiday',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    title: 'Naraka Chaturdashi / Deepavali Eve',
    academicNotes: 'Gazetted Holiday • Campus Closed for Diwali celebrations.',
    lectures: [],
  },
  '2026-11-09': {
    type: 'holiday',
    badge: 'Gazetted Holiday',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    title: 'Diwali (Lakshmi Pujan) • National Holiday',
    academicNotes: 'Statutory National Holiday • University closed.',
    lectures: [],
  },
  '2026-11-10': {
    type: 'holiday',
    badge: 'College Vacation',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Diwali Balipratipada / New Year Recess',
    academicNotes: 'Annual Deepavali vacation period approved by Directorate of Technical Education.',
    lectures: [],
  },
  '2026-11-11': {
    type: 'holiday',
    badge: 'College Vacation',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Bhaubeej / Institutional Recess',
    academicNotes: 'College non-instructional recess day.',
    lectures: [],
  },
  '2026-11-14': {
    type: 'meeting',
    badge: 'Sports Day',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'Annual University Sports Meet & Children’s Day Celebration',
    academicNotes: 'Inauguration of Inter-Departmental Sports Tournament on College Sports Ground.',
    lectures: [],
  },
  '2026-11-16': {
    type: 'duty',
    badge: 'Casual Leave (Approved)',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Faculty Personal Leave (Sanctioned by HOD)',
    academicNotes: 'Approved station leave. Timetable duty covered by substitute faculty Dr. Sunita Rao.',
    leave: {
      type: 'Casual Leave (CL)',
      status: 'Approved',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      proxy: 'Dr. Sunita Rao',
      proxyNotes: 'Covered 1 lecture (CS-301) and 1 tutorial session.',
      appId: 'APP-2026-948',
    },
    lectures: [],
  },
  '2026-11-18': {
    type: 'exam',
    badge: 'Exam Verification',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'University Examination Hall Ticket Verification & Issuance',
    academicNotes: 'Verification of minimum 75% attendance criteria and eligibility clearance.',
    lectures: [
      { time: '10:00 AM – 01:00 PM', code: 'HALL-TKT', subject: 'Eligibility Scrutiny & Hall Ticket Dispatch' },
    ],
  },
  '2026-11-20': {
    type: 'exam',
    badge: 'Mock Practical',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'End-Semester Mock Practical & Viva Voce (CS-307 Lab)',
    academicNotes: 'Internal mock test before external university practical examiners arrive.',
    lectures: [
      { time: '09:30 AM – 01:30 PM', code: 'CS-307P', subject: 'Mock Practical & Code Assessment' },
    ],
  },
  '2026-11-24': {
    type: 'holiday',
    badge: 'Gazetted Holiday',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    title: 'Guru Nanak Jayanti',
    academicNotes: 'Gazetted National Holiday declared by Central Government.',
    lectures: [],
  },
  '2026-11-27': {
    type: 'exam',
    badge: 'University Viva',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'University Practical & Oral Examinations Commence',
    academicNotes: 'External Examiner appointed by University. Strict adherence to grading rubrics.',
    lectures: [
      { time: '09:00 AM – 05:00 PM', code: 'UNIV-VIVA', subject: 'External Viva Voce (Batch A & B)' },
    ],
  },
  '2026-11-30': {
    type: 'instructional',
    badge: 'Term End',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    title: 'Conclusion of Term-II Instructional Period',
    academicNotes: 'Final submission of CIE marks to University portal and attendance freezing.',
    lectures: [
      { time: '02:00 PM – 05:00 PM', code: 'PORTAL-FREEZE', subject: 'University Mark Entry Freezing Session' },
    ],
  },

  // December 2026
  '2026-12-01': {
    type: 'exam',
    badge: 'Theory Exams',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'University End-Semester Theory Examinations Commence',
    academicNotes: 'University Central Examination Session: 10:00 AM to 01:00 PM across all blocks.',
    lectures: [
      { time: '09:30 AM – 01:30 PM', code: 'UNIV-INV', subject: 'Chief Invigilator Duty • Block-A' },
    ],
  },
  '2026-12-04': {
    type: 'exam',
    badge: 'Theory Paper',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'University Theory Paper: CS-301 Operating Systems',
    academicNotes: 'Subject paper scheduled today. Room Invigilation duty in Hall 202.',
    lectures: [
      { time: '09:30 AM – 01:30 PM', code: 'EXAM-PAPER', subject: 'CS-301 Examination Supervision' },
    ],
  },
  '2026-12-08': {
    type: 'exam',
    badge: 'Theory Paper',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'University Theory Paper: CS-307 Cloud Computing Architecture',
    academicNotes: 'Subject paper scheduled today. Exam Hall 304.',
    lectures: [
      { time: '09:30 AM – 01:30 PM', code: 'EXAM-PAPER', subject: 'CS-307 Examination Supervision' },
    ],
  },
  '2026-12-14': {
    type: 'duty',
    badge: 'Duty Leave (Approved)',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Central Assessment Program (CAP) Chief Moderator Duty',
    academicNotes: 'Deputed by University as Subject Moderator for Computer Engineering papers.',
    leave: {
      type: 'Duty Leave (DL)',
      status: 'Approved',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      proxy: 'Official Deputation',
      proxyNotes: 'University CAP Order Ref: CAP-UNIV-2026-081',
      appId: 'APP-2026-972',
    },
    lectures: [
      { time: 'All Day', code: 'CAP-DUTY', subject: 'University Central Assessment Center' },
    ],
  },
  '2026-12-15': {
    type: 'duty',
    badge: 'Duty Leave (Approved)',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Central Assessment Program (CAP) Evaluation Day 2',
    academicNotes: 'Moderation and verification of top 10% answer scripts.',
    leave: {
      type: 'Duty Leave (DL)',
      status: 'Approved',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      proxy: 'Official Deputation',
      proxyNotes: 'University CAP Order Ref: CAP-UNIV-2026-081',
      appId: 'APP-2026-972',
    },
    lectures: [
      { time: 'All Day', code: 'CAP-DUTY', subject: 'University Central Assessment Center' },
    ],
  },
  '2026-12-22': {
    type: 'meeting',
    badge: 'Mathematics Day',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    title: 'National Mathematics Day (Srinivasa Ramanujan Symposium)',
    academicNotes: 'College symposium on Computational Complexity and Algorithmic Information Theory.',
    lectures: [
      { time: '02:00 PM – 04:30 PM', code: 'MATH-SYM', subject: 'Keynote Panel on Discrete Algorithms' },
    ],
  },
  '2026-12-25': {
    type: 'holiday',
    badge: 'Gazetted Holiday',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    title: 'Christmas Day (Gazetted National Holiday)',
    academicNotes: 'Campus Closed for Christmas celebration.',
    lectures: [],
  },
  '2026-12-28': {
    type: 'holiday',
    badge: 'Winter Break',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Winter Vacation / Faculty Term Recess (Day 1)',
    academicNotes: 'Official winter recess declared by University.',
    lectures: [],
  },
  '2026-12-29': {
    type: 'holiday',
    badge: 'Winter Break',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Winter Vacation (Day 2)',
    academicNotes: 'Faculty research and curriculum preparation recess.',
    lectures: [],
  },
  '2026-12-30': {
    type: 'holiday',
    badge: 'Winter Break',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Winter Vacation (Day 3)',
    academicNotes: 'Faculty research and curriculum preparation recess.',
    lectures: [],
  },
  '2026-12-31': {
    type: 'holiday',
    badge: 'Winter Break',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Winter Vacation & Year End Institutional Maintenance',
    academicNotes: 'Campus non-instructional day.',
    lectures: [],
  },

  // January 2027
  '2027-01-01': {
    type: 'holiday',
    badge: 'New Year',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'New Year’s Day 2027',
    academicNotes: 'Institutional holiday for faculty and staff.',
    lectures: [],
  },
  '2027-01-04': {
    type: 'instructional',
    badge: 'Term-I Starts',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'Commencement of Even Semester 2026–2027 (Term-I)',
    academicNotes: 'Semester orientation and timetable distribution for Even Semester classes.',
    lectures: [
      { time: '10:00 AM – 11:30 AM', code: 'ORIENT', subject: 'Even Semester Faculty Orientation (Main Hall)' },
      { time: '02:00 PM – 04:00 PM', code: 'DEPT-PLAN', subject: 'Course Outcome Allotment Meeting' },
    ],
  },
  '2027-01-26': {
    type: 'holiday',
    badge: 'National Holiday',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    title: 'Republic Day (National Holiday & Flag Hoisting)',
    academicNotes: 'Ceremonial Flag Hoisting at 08:30 AM on College Parade Ground.',
    lectures: [],
  },
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function FacultyCalendarView({ onApplyLeave, onSelectApplication, applications = [] }) {
  // Current view state: Default to October 2026 (active academic term)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedDateKey, setSelectedDateKey] = useState('2026-10-24');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'leaves' | 'holidays' | 'academic'

  // Format date helper
  const getDateKey = (year, monthIndex, day) => {
    return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      const newYear = currentYear - 1;
      const newMonth = 11;
      setCurrentYear(newYear);
      setCurrentMonth(newMonth);
      setSelectedDateKey(getDateKey(newYear, newMonth, 1));
    } else {
      const newMonth = currentMonth - 1;
      setCurrentMonth(newMonth);
      setSelectedDateKey(getDateKey(currentYear, newMonth, 1));
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      const newYear = currentYear + 1;
      const newMonth = 0;
      setCurrentYear(newYear);
      setCurrentMonth(newMonth);
      setSelectedDateKey(getDateKey(newYear, newMonth, 1));
    } else {
      const newMonth = currentMonth + 1;
      setCurrentMonth(newMonth);
      setSelectedDateKey(getDateKey(currentYear, newMonth, 1));
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9);
    setSelectedDateKey('2026-10-24');
  };

  // Compute calendar grid mathematics for the active month
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday, 6 is Saturday

  // Lead blanks from previous month
  const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();
  const leadBlanks = Array.from(
    { length: firstDayOfWeek },
    (_, i) => prevMonthTotalDays - firstDayOfWeek + 1 + i
  );

  // Active month days
  const daysInMonth = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  // Trailing blanks to complete the final row
  const totalCellsSoFar = leadBlanks.length + daysInMonth.length;
  const trailingBlanksCount = totalCellsSoFar % 7 === 0 ? 0 : 7 - (totalCellsSoFar % 7);
  const trailingBlanks = Array.from({ length: trailingBlanksCount }, (_, i) => i + 1);

  // Intelligent fallback for any date in any month
  const getDayAcademicInfo = (dateKey) => {
    if (COLLEGE_ACADEMIC_DATES[dateKey]) {
      return COLLEGE_ACADEMIC_DATES[dateKey];
    }

    const dateObj = new Date(dateKey);
    const dayOfWeek = dateObj.getDay();

    if (dayOfWeek === 0) {
      return {
        type: 'holiday',
        badge: 'Weekly Off',
        badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
        title: 'Sunday • Non-Instructional Day',
        academicNotes: 'Campus academic facilities closed. Digital library and student portals accessible 24/7.',
        lectures: [],
      };
    }

    if (dayOfWeek === 6) {
      return {
        type: 'holiday',
        badge: 'Institutional Off',
        badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
        title: 'Saturday • Research & Student Counseling',
        academicNotes: 'Non-instructional weekend. Faculty research consultations and lab maintenance.',
        lectures: [],
      };
    }

    return {
      type: 'instructional',
      badge: 'Teaching Day',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      title: 'Regular Academic Timetable Day',
      academicNotes: 'Standard semester teaching schedule according to university academic syllabus.',
      lectures: [
        { time: '09:30 AM – 10:30 AM', code: 'CS-301', subject: 'Operating Systems & Distributed Systems (Hall LH-102)' },
        { time: '11:30 AM – 01:30 PM', code: 'CS-307', subject: 'Cloud Systems Architecture Lab (Systems Lab 2)' },
        { time: '03:00 PM – 04:00 PM', code: 'CS-312', subject: 'Student Capstone Project Mentoring (Room 314)' },
      ],
    };
  };

  const activeDateInfo = getDayAcademicInfo(selectedDateKey);

  const selectedDateObj = new Date(selectedDateKey);
  const formattedSelectedDate = selectedDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const displayedMonthTitle = `${MONTH_NAMES[currentMonth]} ${currentYear}`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Toolbar with Month Navigation & Category Filter Pills */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Month Selector with Interactive Previous & Next Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-heading text-sm sm:text-base font-bold text-slate-900 px-3 min-w-[145px] text-center select-none">
              {displayedMonthTitle}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleJumpToToday}
            className="px-3.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition cursor-pointer shadow-2xs"
          >
            Jump to Today
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden lg:inline">
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            All Dates
          </button>
          <button
            type="button"
            onClick={() => setFilterType('leaves')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              filterType === 'leaves'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>My Leaves</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('holidays')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              filterType === 'holidays'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>College Holidays</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('academic')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              filterType === 'academic'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            <span>Exams & Milestones</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Month Calendar Grid */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          {/* Calendar Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/90 text-center text-xs font-bold text-slate-600 py-3">
            <span className="text-rose-600">Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span className="text-amber-700">Sat</span>
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
            {/* Previous Month Overflow Blanks */}
            {leadBlanks.map((b) => (
              <div key={`lead-${b}`} className="p-2 min-h-24 bg-slate-50/40 text-slate-300 text-xs font-medium">
                <span>{b}</span>
              </div>
            ))}

            {/* Days in Active Month */}
            {daysInMonth.map((day) => {
              const dateStr = getDateKey(currentYear, currentMonth, day);
              const dayData = getDayAcademicInfo(dateStr);
              const isSelected = selectedDateKey === dateStr;

              // Check if current day is October 24, 2026 (demo today)
              const isToday = currentYear === 2026 && currentMonth === 9 && day === 24;

              // Day of week index
              const dayDateObj = new Date(currentYear, currentMonth, day);
              const dayOfWeek = dayDateObj.getDay();
              const isSunday = dayOfWeek === 0;
              const isSaturday = dayOfWeek === 6;

              // Filter matching logic
              let matchesFilter = true;
              if (filterType === 'leaves' && !dayData?.leave) matchesFilter = false;
              if (filterType === 'holidays' && dayData?.type !== 'holiday') matchesFilter = false;
              if (filterType === 'academic' && dayData?.type !== 'exam' && dayData?.type !== 'meeting') matchesFilter = false;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateKey(dateStr)}
                  className={`p-2 min-h-24 sm:min-h-28 text-xs transition-all cursor-pointer relative flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-blue-50/70 ring-2 ring-inset ring-blue-600 z-10'
                      : isSunday
                      ? 'bg-slate-50/70 hover:bg-slate-100/60'
                      : isSaturday
                      ? 'bg-amber-50/20 hover:bg-slate-50'
                      : 'hover:bg-slate-50/80 bg-white'
                  } ${!matchesFilter ? 'opacity-40' : ''}`}
                >
                  {/* Top Day Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] shadow-xs'
                          : isSunday
                          ? 'text-rose-600'
                          : isSaturday
                          ? 'text-amber-700'
                          : 'text-slate-800'
                      }`}
                    >
                      {day}
                    </span>

                    {isToday && (
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-100/70 px-1.5 py-0.2 rounded-full hidden sm:inline">
                        Today
                      </span>
                    )}

                    {dayData?.badge && !isToday && (
                      <span className={`text-[8px] sm:text-[9px] font-bold px-1 rounded truncate max-w-[68px] ${dayData.badgeColor}`}>
                        {dayData.badge}
                      </span>
                    )}
                  </div>

                  {/* Day Content Badges (Academic Milestones & Leaves) */}
                  <div className="mt-1 space-y-1">
                    {/* Leave Pill */}
                    {dayData?.leave && (
                      <div
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold truncate flex items-center gap-1 shadow-2xs ${
                          dayData.leave.type.includes('Casual')
                            ? 'bg-amber-500 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {dayData.leave.type.includes('Casual') ? (
                          <Clock className="w-2.5 h-2.5 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                        )}
                        <span className="truncate">{dayData.leave.type}</span>
                      </div>
                    )}

                    {/* Academic Event / Exam / Holiday Pill */}
                    {dayData?.title && !dayData?.leave && (
                      <div
                        className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-medium truncate ${
                          dayData.type === 'holiday'
                            ? 'bg-red-50 text-red-700 border border-red-100 font-semibold'
                            : dayData.type === 'exam'
                            ? 'bg-purple-50 text-purple-700 border border-purple-100 font-semibold'
                            : dayData.type === 'meeting'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100 font-semibold'
                            : 'text-slate-600 bg-slate-100/80'
                        }`}
                      >
                        {dayData.title}
                      </div>
                    )}

                    {/* Lecture count indicator on normal teaching days */}
                    {dayData?.lectures && dayData.lectures.length > 0 && !dayData.leave && (
                      <span className="text-[9px] text-slate-400 font-medium block truncate">
                        {dayData.lectures.length} Lectures scheduled
                      </span>
                    )}
                  </div>

                  {/* Selected Indicator dot */}
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mx-auto mt-1" />
                  )}
                </div>
              );
            })}

            {/* Next Month Overflow Blanks to complete the grid */}
            {trailingBlanks.map((b) => (
              <div key={`trail-${b}`} className="p-2 min-h-24 bg-slate-50/30 text-slate-300 text-xs font-medium">
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Institutional Date Details Inspector Panel */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5 sticky top-6">
          {/* Selected Date Header */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${activeDateInfo.badgeColor}`}>
                {activeDateInfo.badge}
              </span>
              <span className="text-[11px] font-mono font-medium text-slate-400">
                {selectedDateKey}
              </span>
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-900 mt-2">
              {formattedSelectedDate}
            </h3>
            <p className="text-xs font-semibold text-blue-700 mt-0.5">
              {activeDateInfo.title}
            </p>
          </div>

          {/* Section 1: Institutional Academic Notes */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>COLLEGE ACADEMIC NOTES</span>
            </div>
            <p className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 leading-relaxed">
              {activeDateInfo.academicNotes}
            </p>
          </div>

          {/* Section 2: Teaching Timetable & Lab Sessions */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>TEACHING SCHEDULE</span>
              </div>
              <span className="text-[11px] font-normal text-slate-400">
                {activeDateInfo.lectures?.length || 0} Classes
              </span>
            </div>

            {activeDateInfo.lectures && activeDateInfo.lectures.length > 0 ? (
              <div className="space-y-2">
                {activeDateInfo.lectures.map((lec, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-slate-50 transition flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-100 text-blue-800">
                          {lec.code}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{lec.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{lec.subject}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
                No teaching lectures scheduled for this date.
              </div>
            )}
          </div>

          {/* Section 3: Leave & Proxy Substitute Status */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <CalendarIcon className="w-4 h-4 text-emerald-600" />
              <span>LEAVE & SUBSTITUTE STATUS</span>
            </div>

            {activeDateInfo.leave ? (
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{activeDateInfo.leave.type}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeDateInfo.leave.statusColor}`}>
                    {activeDateInfo.leave.status}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Designated Substitute: </span>
                  {activeDateInfo.leave.proxy}
                </div>
                <p className="text-[11px] text-slate-500 italic bg-white/70 p-2 rounded-lg border border-emerald-100">
                  "{activeDateInfo.leave.proxyNotes}"
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
                No leave requested for this date. Regular faculty duty active.
              </div>
            )}
          </div>

          {/* Section 4: Quick Action Button to Apply Leave */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onApplyLeave && onApplyLeave(selectedDateKey)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Apply Leave for this Date</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
