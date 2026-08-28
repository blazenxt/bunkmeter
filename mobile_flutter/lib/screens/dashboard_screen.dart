import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/attendance_provider.dart';
import '../models/subject.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AttendanceProvider>(context);
    final overallPct = provider.overallPercentage;
    final isOverallSafe = overallPct >= provider.globalTarget;

    final filteredSubjects = provider.subjects.where((s) {
      return s.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          s.code.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: StartAxisAlignment.start,
          children: [
            // Overall Meter Hero Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.4),
                    blurRadius: 16,
                    offset: const Offset(0, 8),
                  )
                ],
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981).withOpacity(0.15),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
                            ),
                            child: Text(
                              'Target Criteria: ${provider.globalTarget.toInt()}%',
                              style: const TextStyle(
                                color: Color(0xFF34D399),
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '${overallPct.toStringAsFixed(1)}%',
                            style: const TextStyle(
                              fontSize: 36,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                            ),
                          ),
                          const Text(
                            'Overall Attendance Meter',
                            style: TextStyle(color: Colors.grey, fontSize: 12),
                          ),
                        ],
                      ),

                      // Circular Gauge Ring
                      Stack(
                        alignment: Alignment.center,
                        children: [
                          SizedBox(
                            width: 72,
                            height: 72,
                            child: CircularProgressIndicator(
                              value: overallPct / 100.0,
                              strokeWidth: 8,
                              backgroundColor: Colors.white10,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                isOverallSafe ? const Color(0xFF10B981) : const Color(0xFFF43F5E),
                              ),
                            ),
                          ),
                          Text(
                            isOverallSafe ? 'SAFE' : 'LOW',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w900,
                              color: isOverallSafe ? const Color(0xFF10B981) : const Color(0xFFF43F5E),
                            ),
                          )
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Search Bar & Add Button
            Row(
              children: [
                Expanded(
                  child: TextField(
                    onChanged: (val) => setState(() => _searchQuery = val),
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                    decoration: InputDecoration(
                      hintText: 'Filter subjects...',
                      hintStyle: TextStyle(color: Colors.grey[600], fontSize: 13),
                      prefixIcon: const Icon(Icons.search, color: Colors.grey, size: 18),
                      filled: true,
                      fillColor: const Color(0xFF0F172A),
                      contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton.icon(
                  onPressed: () => _showAddSubjectDialog(context),
                  icon: const Icon(Icons.add, size: 18, color: Colors.black),
                  label: const Text(
                    'Add Subject',
                    style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 12),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                )
              ],
            ),

            const SizedBox(height: 16),

            // Subject Cards List
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: filteredSubjects.length,
              itemBuilder: (context, index) {
                final sub = filteredSubjects[index];
                return _buildSubjectCard(context, provider, sub);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSubjectCard(BuildContext context, AttendanceProvider provider, Subject sub) {
    final count = sub.calculatedCount;
    final pctStr = sub.percentage.toStringAsFixed(1);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          sub.name,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white),
                        ),
                        if (sub.code.isNotEmpty) ...[
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.white10,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              sub.code,
                              style: const TextStyle(fontSize: 10, color: Color(0xFF14B8A6), fontWeight: FontWeight.bold),
                            ),
                          )
                        ]
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Attended: ${sub.attended} / ${sub.total} lectures',
                      style: const TextStyle(color: Colors.grey, fontSize: 12),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: sub.isSafe ? const Color(0xFF10B981).withOpacity(0.1) : const Color(0xFFF43F5E).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: sub.isSafe ? const Color(0xFF10B981).withOpacity(0.3) : const Color(0xFFF43F5E).withOpacity(0.3),
                  ),
                ),
                child: Text(
                  '$pctStr%',
                  style: TextStyle(
                    color: sub.isSafe ? const Color(0xFF10B981) : const Color(0xFFF43F5E),
                    fontWeight: FontWeight.w900,
                    fontSize: 13,
                  ),
                ),
              )
            ],
          ),

          const SizedBox(height: 12),

          // Safe Bunk Badge Banner
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: sub.isSafe ? const Color(0xFF064E3B).withOpacity(0.3) : const Color(0xFF881337).withOpacity(0.3),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: sub.isSafe ? const Color(0xFF10B981).withOpacity(0.2) : const Color(0xFFF43F5E).withOpacity(0.2),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  sub.isSafe ? Icons.auto_awesome : Icons.warning_amber_rounded,
                  size: 16,
                  color: sub.isSafe ? const Color(0xFF34D399) : const Color(0xFFFB7185),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    sub.isSafe
                        ? (count > 0 ? 'Safe to bunk $count upcoming classes!' : 'On target boundary! Don\'t miss next class.')
                        : 'Must attend next $count consecutive classes!',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: sub.isSafe ? const Color(0xFF34D399) : const Color(0xFFFB7185),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Action Custom Buttons Row
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => provider.markPresent(sub.id),
                  icon: const Icon(Icons.check_circle_outline, size: 16, color: Color(0xFF10B981)),
                  label: const Text('+ Present', style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 11)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981).withOpacity(0.15),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(color: const Color(0xFF10B981).withOpacity(0.3)),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => provider.markAbsent(sub.id),
                  icon: const Icon(Icons.cancel_outlined, size: 16, color: Color(0xFFF43F5E)),
                  label: const Text('+ Absent', style: TextStyle(color: Color(0xFFF43F5E), fontWeight: FontWeight.bold, fontSize: 11)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFF43F5E).withOpacity(0.15),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(color: const Color(0xFFF43F5E).withOpacity(0.3)),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: () => provider.undoAttendance(sub.id),
                icon: const Icon(Icons.undo_rounded, size: 18, color: Colors.grey),
                style: IconButton.styleFrom(
                  backgroundColor: Colors.white10,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              )
            ],
          )
        ],
      ),
    );
  }

  void _showAddSubjectDialog(BuildContext context) {
    final nameCtrl = TextEditingController();
    final codeCtrl = TextEditingController();
    final attendedCtrl = TextEditingController(text: '0');
    final totalCtrl = TextEditingController(text: '0');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF0F172A),
        title: const Text('Add Subject to BunkMeter', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameCtrl,
              style: const TextStyle(color: Colors.white, fontSize: 13),
              decoration: const InputDecoration(labelText: 'Subject Name', labelStyle: TextStyle(color: Colors.grey)),
            ),
            TextField(
              controller: codeCtrl,
              style: const TextStyle(color: Colors.white, fontSize: 13),
              decoration: const InputDecoration(labelText: 'Subject Code (Optional)', labelStyle: TextStyle(color: Colors.grey)),
            ),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: attendedCtrl,
                    keyboardType: TextInputType.number,
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                    decoration: const InputDecoration(labelText: 'Initial Attended', labelStyle: TextStyle(color: Colors.grey)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    controller: totalCtrl,
                    keyboardType: TextInputType.number,
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                    decoration: const InputDecoration(labelText: 'Initial Total', labelStyle: TextStyle(color: Colors.grey)),
                  ),
                ),
              ],
            )
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            onPressed: () {
              if (nameCtrl.text.isNotEmpty) {
                final newSub = Subject(
                  id: Date.now().toString(),
                  name: nameCtrl.text,
                  code: codeCtrl.text,
                  attended: int.tryParse(attendedCtrl.text) ?? 0,
                  total: int.tryParse(totalCtrl.text) ?? 0,
                );
                Provider.of<AttendanceProvider>(context, listen: false).addSubject(newSub);
                Navigator.pop(ctx);
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
            child: const Text('Save', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
          )
        ],
      ),
    );
  }
}
