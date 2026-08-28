import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/subject.dart';
import '../models/timetable_slot.dart';
import '../models/note.dart';

class AttendanceProvider with ChangeNotifier {
  List<Subject> _subjects = [
    Subject(id: '1', name: 'Data Structures & Algorithms', code: 'CS301', attended: 32, total: 36, target: 75),
    Subject(id: '2', name: 'Database Management Systems', code: 'CS302', attended: 18, total: 26, target: 75),
    Subject(id: '3', name: 'Operating Systems', code: 'CS303', attended: 14, total: 22, target: 75),
    Subject(id: '4', name: 'Computer Networks', code: 'CS304', attended: 24, total: 28, target: 75),
  ];

  Map<String, List<TimetableSlot>> _timetable = {
    'Monday': [
      TimetableSlot(id: 't1', day: 'Monday', time: '09:00 AM - 10:00 AM', subject: 'Data Structures & Algorithms', room: 'Lab 201'),
      TimetableSlot(id: 't2', day: 'Monday', time: '10:00 AM - 11:00 AM', subject: 'Database Management Systems', room: 'LH 104'),
    ],
    'Tuesday': [
      TimetableSlot(id: 't3', day: 'Tuesday', time: '09:00 AM - 10:00 AM', subject: 'Computer Networks', room: 'LH 202'),
    ],
    'Wednesday': [],
    'Thursday': [],
    'Friday': [],
    'Saturday': [],
  };

  List<NoteDocument> _notes = [
    NoteDocument(
      id: 'n1',
      title: 'Module 2: Graph Algorithms & BST Notes',
      subject: 'Data Structures & Algorithms',
      category: 'Class Notes',
      link: 'https://drive.google.com/file/d/demo1',
      date: '2026-08-25',
    )
  ];

  double _globalTarget = 75.0;

  List<Subject> get subjects => _subjects;
  Map<String, List<TimetableSlot>> get timetable => _timetable;
  List<NoteDocument> get notes => _notes;
  double get globalTarget => _globalTarget;

  AttendanceProvider() {
    _loadFromPrefs();
  }

  double get overallPercentage {
    int totalAttended = _subjects.fold(0, (sum, item) => sum + item.attended);
    int totalConducted = _subjects.fold(0, (sum, item) => sum + item.total);
    if (totalConducted == 0) return 100.0;
    return (totalAttended / totalConducted) * 100.0;
  }

  void markPresent(String subjectId) {
    final index = _subjects.indexWhere((s) => s.id == subjectId);
    if (index != -1) {
      _subjects[index].attended += 1;
      _subjects[index].total += 1;
      _saveToPrefs();
      notifyListeners();
    }
  }

  void markAbsent(String subjectId) {
    final index = _subjects.indexWhere((s) => s.id == subjectId);
    if (index != -1) {
      _subjects[index].total += 1;
      _saveToPrefs();
      notifyListeners();
    }
  }

  void undoAttendance(String subjectId) {
    final index = _subjects.indexWhere((s) => s.id == subjectId);
    if (index != -1 && _subjects[index].total > 0) {
      _subjects[index].total -= 1;
      if (_subjects[index].attended > _subjects[index].total) {
        _subjects[index].attended = _subjects[index].total;
      }
      _saveToPrefs();
      notifyListeners();
    }
  }

  void addSubject(Subject subject) {
    _subjects.add(subject);
    _saveToPrefs();
    notifyListeners();
  }

  void deleteSubject(String id) {
    _subjects.removeWhere((s) => s.id == id);
    _saveToPrefs();
    notifyListeners();
  }

  void updateGlobalTarget(double newTarget) {
    _globalTarget = newTarget;
    for (var s in _subjects) {
      s.target = newTarget;
    }
    _saveToPrefs();
    notifyListeners();
  }

  Future<void> _loadFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final subjectsJson = prefs.getString('bm_subjects');
      if (subjectsJson != null) {
        final List<dynamic> decoded = jsonDecode(subjectsJson);
        _subjects = decoded.map((item) => Subject.fromJson(item)).toList();
      }
      _globalTarget = prefs.getDouble('bm_target') ?? 75.0;
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading prefs: $e');
    }
  }

  Future<void> _saveToPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final subjectsJson = jsonEncode(_subjects.map((s) => s.toJson()).toList());
      await prefs.setString('bm_subjects', subjectsJson);
      await prefs.setDouble('bm_target', _globalTarget);
    } catch (e) {
      debugPrint('Error saving prefs: $e');
    }
  }
}
