import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Calculator,
  FileText,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Award,
  Download,
  Upload,
  Check,
  ChevronRight,
  TrendingUp,
  Clock,
  Search,
  Settings,
  Sliders,
  ExternalLink,
  Zap,
  RotateCcw,
  User,
  ShieldCheck,
  Bell,
  Mail,
  KeyRound,
  FileUp,
  GraduationCap,
  Building,
  Hash,
  LogOut,
  Lock,
  Smartphone,
  CheckCheck,
  FolderOpen
} from 'lucide-react';

// Disposable / Temp Email Domains List
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'yopmail.com',
  'mailinator.com', 'trashmail.com', 'dispostable.com', 'temp-mail.org',
  'getnada.com', 'throwawaymail.com', 'fakeinbox.com', 'sharklasers.com',
  'maildrop.cc', '007email.com', 'generator.email', 'crazymailing.com',
  'tempmail.net', 'byom.de', 'inboxkitten.com', 'mohmal.com'
];

const INITIAL_SUBJECTS = [
  { id: '1', name: 'Data Structures & Algorithms', code: 'CS301', attended: 32, total: 36, target: 75 },
  { id: '2', name: 'Database Management Systems', code: 'CS302', attended: 18, total: 26, target: 75 },
  { id: '3', name: 'Operating Systems', code: 'CS303', attended: 14, total: 22, target: 75 },
  { id: '4', name: 'Computer Networks', code: 'CS304', attended: 24, total: 28, target: 75 }
];

const INITIAL_TIMETABLE = {
  Monday: [
    { id: 't1', time: '09:00 AM - 10:00 AM', subject: 'Data Structures & Algorithms', room: 'Lab 201' },
    { id: 't2', time: '10:00 AM - 11:00 AM', subject: 'Database Management Systems', room: 'LH 104' },
    { id: 't3', time: '01:30 PM - 03:30 PM', subject: 'Operating Systems', room: 'Lab 103' }
  ],
  Tuesday: [
    { id: 't4', time: '09:00 AM - 10:00 AM', subject: 'Computer Networks', room: 'LH 202' },
    { id: 't5', time: '11:00 AM - 12:00 PM', subject: 'Data Structures & Algorithms', room: 'LH 202' }
  ],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: []
};

const INITIAL_NOTES = [
  {
    id: 'n1',
    title: 'Module 2: Graph Algorithms & BST Notes',
    subject: 'Data Structures & Algorithms',
    category: 'Class Notes',
    link: 'https://drive.google.com/file/d/demo1',
    fileName: 'DSA_Unit2_Notes.pdf',
    fileSize: '2.4 MB'
  },
  {
    id: 'n2',
    title: '2025 Mid-Sem Solved PYQ Paper',
    subject: 'Database Management Systems',
    category: 'Question Paper',
    link: 'https://drive.google.com/file/d/demo2',
    fileName: 'DBMS_PYQ_2025.pdf',
    fileSize: '4.1 MB'
  }
];

const GRADE_POINTS = {
  'O (Outstanding)': 10,
  'A+ (Excellent)': 9,
  'A (Very Good)': 8,
  'B+ (Good)': 7,
  'B (Above Average)': 6,
  'C (Average)': 5,
  'F (Fail)': 0
};

export default function App() {
  // Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bm_user');
    return saved ? JSON.parse(saved) : {
      name: 'Blaze Student',
      email: 'student@university.edu',
      isVerified: true,
      college: 'IIT / NIT Technology Institute',
      branch: 'Computer Science & Engineering',
      rollNo: '2026CS108',
      semester: 'Semester 5'
    };
  });

  const [authStep, setAuthStep] = useState('logged_in'); // 'email', 'otp', 'logged_in'
  const [inputEmail, setInputEmail] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [emailError, setEmailError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // App Main State
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('bm_subjects_v4');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [timetable, setTimetable] = useState(() => {
    const saved = localStorage.getItem('bm_timetable_v4');
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('bm_notes_v4');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [globalTarget, setGlobalTarget] = useState(() => {
    const saved = localStorage.getItem('bm_target_v4');
    return saved ? Number(saved) : 75;
  });

  // Notification Toggles
  const [notifications, setNotifications] = useState({
    classReminders: true,
    eveningPrompt: true,
    shortageAlert: true
  });

  const [activeTab, setActiveTab] = useState('attendance');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState('');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

  // Forms
  const [subjectForm, setSubjectForm] = useState({ id: '', name: '', code: '', attended: 0, total: 0, target: 75 });
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [noteForm, setNoteForm] = useState({ title: '', subject: '', category: 'Class Notes', link: '', fileName: '' });
  const [profileForm, setProfileForm] = useState({ ...user });

  // GPA State
  const [gpaCourses, setGpaCourses] = useState([
    { name: 'Data Structures & Algorithms', credits: 4, grade: 'A+ (Excellent)' },
    { name: 'Database Management Systems', credits: 3, grade: 'O (Outstanding)' },
    { name: 'Operating Systems', credits: 3, grade: 'A (Very Good)' },
    { name: 'Computer Networks', credits: 4, grade: 'B+ (Good)' }
  ]);
  const [semesters, setSemesters] = useState([
    { sem: 'Sem 1', sgpa: 8.5, credits: 20 },
    { sem: 'Sem 2', sgpa: 8.8, credits: 22 },
    { sem: 'Sem 3', sgpa: 8.7, credits: 21 }
  ]);

  useEffect(() => {
    localStorage.setItem('bm_subjects_v4', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('bm_user', JSON.stringify(user));
  }, [user]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Disposable Email Validator
  const validateEmail = (email) => {
    setEmailError('');
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    const domain = email.split('@')[1].toLowerCase();
    if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
      setEmailError('🚨 Temporary/Disposable email addresses are strictly blocked! Please use a real email.');
      return false;
    }
    return true;
  };

  // Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!validateEmail(inputEmail)) return;

    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockCode);
    setAuthStep('otp');
    setResendTimer(30);
    showToast(`Verification code sent to ${inputEmail}! (Demo OTP: ${mockCode})`);
  };

  // Verify OTP Code
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered === generatedOtp || entered === '123456') {
      const updatedUser = {
        ...user,
        email: inputEmail,
        isVerified: true
      };
      setUser(updatedUser);
      setAuthStep('logged_in');
      setIsAuthOpen(false);
      showToast('Email verified successfully! 🎉');
    } else {
      showToast('❌ Invalid OTP Code! Try 123456');
    }
  };

  // Safe Bunk Formula
  const calculateBunk = (attended, total, target) => {
    if (total === 0) return { status: 'safe', count: 0, percentage: 100 };
    const pct = (attended / total) * 100;
    const tDec = target / 100;

    if (pct >= target) {
      const safeBunks = Math.floor((attended - tDec * total) / tDec);
      return { status: 'safe', count: Math.max(0, safeBunks), percentage: pct };
    } else {
      const mustAttend = Math.ceil((tDec * total - attended) / (1 - tDec));
      return { status: 'danger', count: Math.max(0, mustAttend), percentage: pct };
    }
  };

  const handleAttendance = (id, action) => {
    setSubjects(prev =>
      prev.map(sub => {
        if (sub.id !== id) return sub;
        let a = sub.attended;
        let t = sub.total;

        if (action === 'present') {
          a += 1;
          t += 1;
        } else if (action === 'absent') {
          t += 1;
        } else if (action === 'undo' && t > 0) {
          t -= 1;
          if (a > sub.attended - 1 && a > 0) a -= 1;
        }

        return { ...sub, attended: a, total: t };
      })
    );
  };

  const handleSaveSubject = (e) => {
    e.preventDefault();
    if (!subjectForm.name.trim()) return;

    if (subjectForm.id) {
      setSubjects(prev => prev.map(s => (s.id === subjectForm.id ? { ...subjectForm } : s)));
      showToast('Subject updated!');
    } else {
      const newSub = {
        ...subjectForm,
        id: Date.now().toString(),
        target: globalTarget,
        attended: Number(subjectForm.attended) || 0,
        total: Number(subjectForm.total) || 0
      };
      setSubjects(prev => [...prev, newSub]);
      showToast('Subject added!');
    }
    setIsAddSubjectOpen(false);
  };

  // Metrics
  const totalAttended = subjects.reduce((a, b) => a + b.attended, 0);
  const totalConducted = subjects.reduce((a, b) => a + b.total, 0);
  const overallPct = totalConducted === 0 ? 100 : ((totalAttended / totalConducted) * 100).toFixed(1);

  // SGPA Calculation
  const calculateSGPA = () => {
    let totCreds = 0;
    let totPts = 0;
    gpaCourses.forEach(c => {
      const creds = Number(c.credits) || 0;
      const pts = GRADE_POINTS[c.grade] || 0;
      totCreds += creds;
      totPts += creds * pts;
    });
    return totCreds === 0 ? '0.00' : (totPts / totCreds).toFixed(2);
  };

  // File Picker simulator for Local Device PDFs
  const handleLocalFilePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const newNote = {
      id: Date.now().toString(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      subject: subjects[0]?.name || 'General',
      category: 'Class Notes',
      link: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    };
    setNotes(prev => [newNote, ...prev]);
    showToast(`PDF Attached from device: ${file.name}`);
  };

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto sm:max-w-3xl min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-24 border-x border-slate-800/80 shadow-2xl relative font-sans">
      
      {/* GLOWING HEADER */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/30">
            <Zap className="w-5 h-5 text-slate-950 fill-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
                BunkMeter
              </h1>
              <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                PRO 📊
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">SAFE BUNK & ATTENDANCE CALCULATOR</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* User Auth Pill */}
          <button
            onClick={() => {
              if (user.isVerified) {
                setActiveTab('profile');
              } else {
                setAuthStep('email');
                setIsAuthOpen(true);
              }
            }}
            className="flex items-center space-x-1.5 bg-slate-800/90 hover:bg-slate-700/80 px-3 py-1.5 rounded-2xl border border-slate-700/60 text-xs transition active:scale-95"
          >
            <ShieldCheck className={`w-4 h-4 ${user.isVerified ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="font-bold text-slate-200">{user.isVerified ? 'Verified' : 'Verify'}</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition active:scale-95"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 animate-bounce ring-4 ring-emerald-500/30">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toast}</span>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 space-y-5">
        
        {/* TAB 1: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            {/* OVERALL METER HERO CARD */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800/90 p-5 border border-slate-800 shadow-2xl">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Target Criteria: {globalTarget}%
                  </span>
                  <h2 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
                    {overallPct}%
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Overall Attendance Meter</p>
                </div>

                {/* Circular Progress Gauge */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-slate-800"
                      fill="transparent"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 32}
                      strokeDashoffset={2 * Math.PI * 32 * (1 - Math.min(100, Number(overallPct)) / 100)}
                      strokeLinecap="round"
                      className={`${Number(overallPct) >= globalTarget ? 'text-emerald-400' : 'text-rose-500'} transition-all duration-700`}
                      fill="transparent"
                    />
                  </svg>
                  <span className={`absolute text-xs font-black ${Number(overallPct) >= globalTarget ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Number(overallPct) >= globalTarget ? 'SAFE' : 'LOW'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800/80 rounded-full h-3 p-0.5 mb-3 border border-slate-700/50">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    Number(overallPct) >= globalTarget
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-sm shadow-emerald-500/50'
                      : 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-sm shadow-rose-500/50'
                  }`}
                  style={{ width: `${Math.min(100, Number(overallPct))}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800/80">
                <div className="flex items-center justify-between text-slate-300 bg-slate-950/40 p-2 rounded-xl">
                  <span className="text-slate-400">Total Attended:</span>
                  <span className="font-bold text-emerald-400">{totalAttended}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 bg-slate-950/40 p-2 rounded-xl">
                  <span className="text-slate-400">Total Conducted:</span>
                  <span className="font-bold text-slate-200">{totalConducted}</span>
                </div>
              </div>
            </div>

            {/* SEARCH & ADD */}
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/80 transition"
                />
              </div>
              <button
                onClick={() => {
                  setSubjectForm({ id: '', name: '', code: '', attended: 0, total: 0, target: globalTarget });
                  setIsAddSubjectOpen(true);
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Subject</span>
              </button>
            </div>

            {/* SUBJECT CARDS */}
            <div className="space-y-3.5">
              {filteredSubjects.map(sub => {
                const targetToUse = sub.target || globalTarget;
                const bunk = calculateBunk(sub.attended, sub.total, targetToUse);
                const pctVal = bunk.percentage.toFixed(1);

                return (
                  <div
                    key={sub.id}
                    className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 space-y-3.5 shadow-xl hover:border-slate-700/80 transition relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-sm text-slate-100">{sub.name}</h3>
                          {sub.code && (
                            <span className="text-[10px] font-bold bg-slate-800 text-teal-300 px-2 py-0.5 rounded-md border border-slate-700/60">
                              {sub.code}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Attended: <span className="font-semibold text-slate-200">{sub.attended}</span> / <span className="font-semibold text-slate-200">{sub.total}</span> lectures
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-black px-3 py-1 rounded-2xl border ${
                          Number(pctVal) >= targetToUse
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {pctVal}%
                        </span>
                        <button
                          onClick={() => {
                            setSubjectForm({ ...sub });
                            setIsAddSubjectOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-300 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Safe Bunk Banner */}
                    <div className={`p-3 rounded-2xl flex items-center justify-between text-xs font-semibold ${
                      bunk.status === 'safe'
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {bunk.status === 'safe' ? (
                          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span>
                          {bunk.status === 'safe' ? (
                            bunk.count > 0 ? (
                              <>Safe to bunk <strong className="text-emerald-400 font-extrabold text-sm">{bunk.count}</strong> upcoming {bunk.count === 1 ? 'class' : 'classes'}!</>
                            ) : (
                              <>On target limit ({targetToUse}%). Don't miss next class!</>
                            )
                          ) : (
                            <>Must attend next <strong className="text-rose-400 font-extrabold text-sm">{bunk.count}</strong> consecutive classes!</>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Custom Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-0.5">
                      <button
                        onClick={() => handleAttendance(sub.id, 'present')}
                        className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 transition active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>+ Present</span>
                      </button>

                      <button
                        onClick={() => handleAttendance(sub.id, 'absent')}
                        className="bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/40 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 transition active:scale-95"
                      >
                        <XCircle className="w-4 h-4 stroke-[2.5]" />
                        <span>+ Absent</span>
                      </button>

                      <button
                        onClick={() => handleAttendance(sub.id, 'undo')}
                        className="bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center space-x-1 transition active:scale-95"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Undo</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: TIMETABLE & NOTIFICATIONS */}
        {activeTab === 'timetable' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-sm text-slate-100">Real-time Reminders & Notifications</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Class Reminders (15 mins before lecture)</span>
                  <input
                    type="checkbox"
                    checked={notifications.classReminders}
                    onChange={e => setNotifications({ ...notifications, classReminders: e.target.checked })}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Daily Evening Attendance Prompt (6:00 PM)</span>
                  <input
                    type="checkbox"
                    checked={notifications.eveningPrompt}
                    onChange={e => setNotifications({ ...notifications, eveningPrompt: e.target.checked })}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>Class Timetable</span>
              </h2>
            </div>

            {/* Days Chips */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                    selectedDay === day
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {!timetable[selectedDay] || timetable[selectedDay].length === 0 ? (
                <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800">
                  <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No lectures scheduled for {selectedDay}</p>
                </div>
              ) : (
                timetable[selectedDay].map((slot, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-md">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400">{slot.time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100">{slot.subject}</h4>
                      {slot.room && (
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md inline-block border border-slate-700/50">
                          {slot.room}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: GPA & MARKS */}
        {activeTab === 'gpa' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-sm text-slate-100">Semester SGPA Calculator</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Calculated SGPA</span>
                  <div className="text-2xl font-black text-emerald-400">{calculateSGPA()} / 10</div>
                </div>
              </div>

              <div className="space-y-2">
                {gpaCourses.map((c, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => {
                        const updated = [...gpaCourses];
                        updated[idx].name = e.target.value;
                        setGpaCourses(updated);
                      }}
                      className="col-span-5 bg-transparent text-xs font-semibold text-slate-200 focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Credits"
                      value={c.credits}
                      onChange={(e) => {
                        const updated = [...gpaCourses];
                        updated[idx].credits = e.target.value;
                        setGpaCourses(updated);
                      }}
                      className="col-span-2 bg-slate-900 text-xs text-center border border-slate-800 rounded-xl py-1 text-slate-200"
                    />
                    <select
                      value={c.grade}
                      onChange={(e) => {
                        const updated = [...gpaCourses];
                        updated[idx].grade = e.target.value;
                        setGpaCourses(updated);
                      }}
                      className="col-span-4 bg-slate-900 text-xs border border-slate-800 rounded-xl py-1 px-1 text-slate-200"
                    >
                      {Object.keys(GRADE_POINTS).map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: NOTES & PDF FILE PICKER */}
        {activeTab === 'notes' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>Notes & PYQ Vault</span>
              </h2>

              <label className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1 shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95">
                <FolderOpen className="w-4 h-4 stroke-[2.5]" />
                <span>Attach Device PDF</span>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleLocalFilePick} className="hidden" />
              </label>
            </div>

            <div className="space-y-3">
              {notes.map(n => (
                <div key={n.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        {n.category}
                      </span>
                      <h4 className="font-bold text-sm text-slate-100 mt-1.5">{n.title}</h4>
                      <p className="text-xs text-slate-400">{n.subject} {n.fileSize && `• ${n.fileSize}`}</p>
                    </div>
                    <button
                      onClick={() => {
                        setNotes(prev => prev.filter(item => item.id !== n.id));
                        showToast('Document removed');
                      }}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {n.link && (
                    <a
                      href={n.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-400 hover:underline pt-1"
                    >
                      <span>Open PDF Document</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE SYSTEM */}
        {activeTab === 'profile' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center space-x-4 border-b border-slate-800 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-base text-slate-100">{user.name}</h3>
                    {user.isVerified && (
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                        <CheckCheck className="w-3 h-3 text-emerald-400 inline" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <Building className="w-4 h-4 text-emerald-400" />
                    <span>College / Institute</span>
                  </span>
                  <span className="font-bold text-slate-200">{user.college}</span>
                </div>

                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-teal-400" />
                    <span>Department / Branch</span>
                  </span>
                  <span className="font-bold text-slate-200">{user.branch}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Roll Number</span>
                    <span className="font-bold text-slate-200">{user.rollNo}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Semester</span>
                    <span className="font-bold text-slate-200">{user.semester}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-2xl transition flex items-center justify-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Edit Details</span>
                </button>

                <button
                  onClick={() => {
                    setUser({ ...user, isVerified: false });
                    setAuthStep('email');
                    setIsAuthOpen(true);
                  }}
                  className="py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded-2xl border border-rose-500/30 transition flex items-center justify-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Re-Verify Email</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL: AUTH & EMAIL OTP VERIFICATION */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-100 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Real-Time Email Verification</span>
              </h3>
              <button onClick={() => setIsAuthOpen(false)} className="text-slate-500 hover:text-slate-200">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {authStep === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-3 text-xs">
                <p className="text-slate-400">
                  Enter your official college or personal email to receive a 6-digit OTP code or Magic Link.
                </p>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                  {emailError && <p className="text-rose-400 text-[11px] font-semibold mt-1.5">{emailError}</p>}
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[11px] text-amber-300 font-medium">
                  🔒 <strong>Anti-Spam Security:</strong> Temporary / disposable email services (tempmail, guerrillamail, yopmail, etc.) are strictly blocked!
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black rounded-2xl hover:brightness-110 transition"
                >
                  Send OTP Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3 text-xs">
                <p className="text-slate-400">
                  Enter the 6-digit verification code sent to <strong className="text-emerald-400">{inputEmail}</strong>
                </p>

                <div className="flex items-center justify-between gap-1 py-2">
                  {[0, 1, 2, 3, 4, 5].map(idx => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={otpCode[idx] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const newOtp = [...otpCode];
                        newOtp[idx] = val;
                        setOtpCode(newOtp);
                        if (val && e.target.nextElementSibling) {
                          e.target.nextElementSibling.focus();
                        }
                      }}
                      className="w-10 h-11 bg-slate-950 border border-slate-800 rounded-xl text-center font-black text-lg text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  ))}
                </div>

                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300">
                  ✨ Demo verification code: <strong className="font-bold text-white">{generatedOtp || '123456'}</strong>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Resend code in {resendTimer}s</span>
                  <button type="button" onClick={() => setAuthStep('email')} className="text-emerald-400 hover:underline font-bold">
                    Change Email
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black rounded-2xl hover:brightness-110 transition"
                >
                  Verify Code & Login
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: EDIT PROFILE */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-100">Edit Profile Details</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">College / University</label>
                <input
                  type="text"
                  value={profileForm.college}
                  onChange={e => setProfileForm({ ...profileForm, college: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Branch / Major</label>
                <input
                  type="text"
                  value={profileForm.branch}
                  onChange={e => setProfileForm({ ...profileForm, branch: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setUser({ ...profileForm });
                    setIsEditProfileOpen(false);
                    showToast('Profile updated!');
                  }}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SETTINGS */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-100 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>BunkMeter Settings</span>
              </h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-500 hover:text-slate-200">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Default Target Threshold: <span className="text-emerald-400 font-black">{globalTarget}%</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={globalTarget}
                  onChange={(e) => setGlobalTarget(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="block text-slate-400 font-bold">Security & Auth</span>
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setAuthStep('email');
                    setIsAuthOpen(true);
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl flex items-center justify-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verify Email OTP</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD SUBJECT */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-100">
              {subjectForm.id ? 'Edit Subject' : 'Add Subject to BunkMeter'}
            </h3>

            <form onSubmit={handleSaveSubject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems"
                  value={subjectForm.name}
                  onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Subject Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS303"
                    value={subjectForm.code}
                    onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Target %</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={subjectForm.target}
                    onChange={e => setSubjectForm({ ...subjectForm, target: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Initial Attended</label>
                  <input
                    type="number"
                    min="0"
                    value={subjectForm.attended}
                    onChange={e => setSubjectForm({ ...subjectForm, attended: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Initial Total Conducted</label>
                  <input
                    type="number"
                    min="0"
                    value={subjectForm.total}
                    onChange={e => setSubjectForm({ ...subjectForm, total: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-2xl hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold rounded-2xl hover:brightness-110 transition"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto sm:max-w-3xl bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2.5 flex items-center justify-around z-40">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex flex-col items-center space-y-1 px-3 py-1 rounded-2xl transition ${
            activeTab === 'attendance' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px]">Attendance</span>
        </button>

        <button
          onClick={() => setActiveTab('timetable')}
          className={`flex flex-col items-center space-y-1 px-3 py-1 rounded-2xl transition ${
            activeTab === 'timetable' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('gpa')}
          className={`flex flex-col items-center space-y-1 px-3 py-1 rounded-2xl transition ${
            activeTab === 'gpa' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span className="text-[10px]">GPA / Marks</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex flex-col items-center space-y-1 px-3 py-1 rounded-2xl transition ${
            activeTab === 'notes' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px]">Notes & PDF</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center space-y-1 px-3 py-1 rounded-2xl transition ${
            activeTab === 'profile' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>

    </div>
  );
}
