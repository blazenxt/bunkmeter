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
  RotateCcw
} from 'lucide-react';

const INITIAL_SUBJECTS = [
  {
    id: '1',
    name: 'Data Structures & Algorithms',
    code: 'CS301',
    attended: 32,
    total: 36,
    target: 75,
    color: '#10B981'
  },
  {
    id: '2',
    name: 'Database Management Systems',
    code: 'CS302',
    attended: 18,
    total: 26,
    target: 75,
    color: '#F59E0B'
  },
  {
    id: '3',
    name: 'Operating Systems',
    code: 'CS303',
    attended: 14,
    total: 22,
    target: 75,
    color: '#F43F5E'
  },
  {
    id: '4',
    name: 'Computer Networks',
    code: 'CS304',
    attended: 24,
    total: 28,
    target: 75,
    color: '#3B82F6'
  }
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
  Wednesday: [
    { id: 't6', time: '10:00 AM - 11:00 AM', subject: 'Operating Systems', room: 'LH 104' },
    { id: 't7', time: '02:00 PM - 04:00 PM', subject: 'Database Management Systems', room: 'Lab 201' }
  ],
  Thursday: [
    { id: 't8', time: '09:00 AM - 10:00 AM', subject: 'Computer Networks', room: 'LH 202' },
    { id: 't9', time: '11:00 AM - 12:00 PM', subject: 'Database Management Systems', room: 'LH 104' }
  ],
  Friday: [
    { id: 't10', time: '10:00 AM - 12:00 PM', subject: 'Computer Networks Lab', room: 'Lab 305' },
    { id: 't11', time: '02:00 PM - 03:00 PM', subject: 'Data Structures & Algorithms', room: 'LH 202' }
  ],
  Saturday: []
};

const INITIAL_NOTES = [
  {
    id: 'n1',
    title: 'Module 2: Graph Algorithms & BST Notes',
    subject: 'Data Structures & Algorithms',
    category: 'Class Notes',
    link: 'https://drive.google.com/file/d/demo1',
    date: '2026-08-25'
  },
  {
    id: 'n2',
    title: '2025 Mid-Sem Solved PYQ Paper',
    subject: 'Database Management Systems',
    category: 'Question Paper',
    link: 'https://drive.google.com/file/d/demo2',
    date: '2026-08-20'
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
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('bm_subjects_v2');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [timetable, setTimetable] = useState(() => {
    const saved = localStorage.getItem('bm_timetable_v2');
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('bm_notes_v2');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [globalTarget, setGlobalTarget] = useState(() => {
    const saved = localStorage.getItem('bm_target');
    return saved ? Number(saved) : 75;
  });

  const [activeTab, setActiveTab] = useState('attendance');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState('');

  // Modals
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

  // Forms
  const [subjectForm, setSubjectForm] = useState({ id: '', name: '', code: '', attended: 0, total: 0, target: 75 });
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [slotForm, setSlotForm] = useState({ time: '', subject: '', room: '' });
  const [noteForm, setNoteForm] = useState({ title: '', subject: '', category: 'Class Notes', link: '' });

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
    localStorage.setItem('bm_subjects_v2', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('bm_timetable_v2', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('bm_notes_v2', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('bm_target', globalTarget.toString());
  }, [globalTarget]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Safe Bunk Logic Formula
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

  // Calculate overall metrics
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

  // CGPA Calculation
  const calculateCGPA = () => {
    let totCreds = 0;
    let totWeightedSgpa = 0;
    semesters.forEach(s => {
      const creds = Number(s.credits) || 0;
      const sgpa = Number(s.sgpa) || 0;
      totCreds += creds;
      totWeightedSgpa += creds * sgpa;
    });
    return totCreds === 0 ? '0.00' : (totWeightedSgpa / totCreds).toFixed(2);
  };

  // Backup / Restore JSON
  const handleExport = () => {
    const data = { subjects, timetable, notes, globalTarget };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BunkMeter_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Backup JSON downloaded!');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.subjects) setSubjects(parsed.subjects);
        if (parsed.timetable) setTimetable(parsed.timetable);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.globalTarget) setGlobalTarget(parsed.globalTarget);
        showToast('Data imported successfully!');
      } catch (err) {
        alert('Invalid JSON backup file');
      }
    };
    reader.readAsText(file);
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

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition active:scale-95"
            title="Settings & Target"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition active:scale-95"
            title="Export JSON Backup"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 animate-bounce ring-4 ring-emerald-500/30">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toast}</span>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 space-y-5">
        
        {/* TAB 1: ATTENDANCE & SAFE BUNK ENGINE */}
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

                {/* Circular Progress Meter Gauge */}
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

            {/* SEARCH & ADD SUBJECT BUTTON BAR */}
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
              {filteredSubjects.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
                  <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-400">No subjects found</p>
                  <p className="text-xs text-slate-500 mt-1">Tap "+ Add Subject" to start tracking</p>
                </div>
              ) : (
                filteredSubjects.map(sub => {
                  const targetToUse = sub.target || globalTarget;
                  const bunk = calculateBunk(sub.attended, sub.total, targetToUse);
                  const pctVal = bunk.percentage.toFixed(1);

                  return (
                    <div
                      key={sub.id}
                      className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 space-y-3.5 shadow-xl hover:border-slate-700/80 transition relative overflow-hidden"
                    >
                      {/* Top Row: Name & Target */}
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

                        {/* Percentage Pill */}
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

                      {/* Bunk Engine Alert Badge */}
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

                      {/* CUSTOM DESIGNED BUTTON CONTROLS */}
                      <div className="grid grid-cols-3 gap-2 pt-0.5">
                        <button
                          onClick={() => handleAttendance(sub.id, 'present')}
                          className="bg-emerald-500/15 hover:bg-emerald-500/25 active:bg-emerald-500/35 text-emerald-400 border border-emerald-500/40 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/10 transition active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                          <span>+ Present</span>
                        </button>

                        <button
                          onClick={() => handleAttendance(sub.id, 'absent')}
                          className="bg-rose-500/15 hover:bg-rose-500/25 active:bg-rose-500/35 text-rose-400 border border-rose-500/40 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-rose-500/10 transition active:scale-95"
                        >
                          <XCircle className="w-4 h-4 stroke-[2.5]" />
                          <span>+ Absent</span>
                        </button>

                        <button
                          onClick={() => handleAttendance(sub.id, 'undo')}
                          className="bg-slate-800 hover:bg-slate-700/80 active:bg-slate-700 text-slate-300 border border-slate-700/60 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center space-x-1 transition active:scale-95"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Undo</span>
                        </button>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TIMETABLE & SCHEDULE */}
        {activeTab === 'timetable' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>Class Timetable</span>
              </h2>
              <button
                onClick={() => setIsAddSlotOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add Class</span>
              </button>
            </div>

            {/* Day Selector Chips */}
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

            {/* Timetable List */}
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
                          Room: {slot.room}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setTimetable(prev => ({
                          ...prev,
                          [selectedDay]: prev[selectedDay].filter((_, i) => i !== idx)
                        }));
                        showToast('Class removed');
                      }}
                      className="text-slate-500 hover:text-rose-400 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SGPA & CGPA CALCULATOR */}
        {activeTab === 'gpa' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            {/* SGPA Calculator */}
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
                    <button
                      onClick={() => setGpaCourses(prev => prev.filter((_, i) => i !== idx))}
                      className="col-span-1 text-slate-500 hover:text-rose-400 text-center"
                    >
                      <Trash2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setGpaCourses(prev => [...prev, { name: `Course ${prev.length + 1}`, credits: 3, grade: 'A (Very Good)' }])}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-bold rounded-2xl transition flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span>Add Course Row</span>
              </button>
            </div>

            {/* CGPA Calculator */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-teal-400" />
                  <h3 className="font-bold text-sm text-slate-100">Cumulative CGPA Tracker</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total CGPA</span>
                  <div className="text-2xl font-black text-teal-400">{calculateCGPA()}</div>
                  <span className="text-[10px] font-semibold text-slate-400">~ {(Number(calculateCGPA()) * 9.5).toFixed(1)}% Marks</span>
                </div>
              </div>

              <div className="space-y-2">
                {semesters.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
                    <span className="font-bold text-slate-200">{s.sem}</span>
                    <div className="flex items-center space-x-4">
                      <span>SGPA: <strong className="text-emerald-400 font-extrabold">{s.sgpa}</strong></span>
                      <span>Credits: <strong className="text-slate-300">{s.credits}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: NOTES & PYQ VAULT */}
        {activeTab === 'notes' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>Notes & PYQ Vault</span>
              </h2>
              <button
                onClick={() => setIsAddNoteOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1 shadow-md shadow-emerald-500/20"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Doc</span>
              </button>
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
                      <p className="text-xs text-slate-400">{n.subject}</p>
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
                      <span>Open Document Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL: SETTINGS & TARGET */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
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
                  Default Target Attendance: <span className="text-emerald-400 text-sm font-extrabold">{globalTarget}%</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={globalTarget}
                  onChange={(e) => setGlobalTarget(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>50%</span>
                  <span>75% (Standard)</span>
                  <span>90%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="block text-slate-400 font-bold">Data Management</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleExport}
                    className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl flex items-center justify-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Backup JSON</span>
                  </button>
                  <label className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl flex items-center justify-center space-x-1 cursor-pointer text-center">
                    <Upload className="w-3.5 h-3.5 text-teal-400" />
                    <span>Restore JSON</span>
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD SUBJECT */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
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
          <span className="text-[10px]">Notes & PYQ</span>
        </button>
      </nav>

    </div>
  );
}
