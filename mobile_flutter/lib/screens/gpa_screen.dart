import 'package:flutter/material.dart';

class GpaScreen extends StatefulWidget {
  const GpaScreen({super.key});

  @override
  State<GpaScreen> createState() => _GpaScreenState();
}

class _GpaScreenState extends State<GpaScreen> {
  final List<Map<String, dynamic>> _courses = [
    {'name': 'Data Structures & Algorithms', 'credits': 4, 'gradePoint': 9},
    {'name': 'Database Management Systems', 'credits': 3, 'gradePoint': 10},
    {'name': 'Operating Systems', 'credits': 3, 'gradePoint': 8},
    {'name': 'Computer Networks', 'credits': 4, 'gradePoint': 7},
  ];

  double get calculatedSgpa {
    int totalCredits = 0;
    int totalPoints = 0;
    for (var c in _courses) {
      final creds = c['credits'] as int;
      final pts = c['gradePoint'] as int;
      totalCredits += creds;
      totalPoints += creds * pts;
    }
    return totalCredits == 0 ? 0.0 : totalPoints / totalCredits;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // SGPA Hero Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Semester SGPA', style: TextStyle(color: Colors.grey, fontSize: 12)),
                      SizedBox(height: 4),
                      Text('Predicted Grade', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                    ],
                  ),
                  Text(
                    '${calculatedSgpa.toStringAsFixed(2)} / 10',
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF10B981),
                    ),
                  )
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Courses Table List
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _courses.length,
              itemBuilder: (ctx, i) {
                final c = _courses[i];
                return Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withOpacity(0.08)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          c['name'],
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                      ),
                      Text(
                        'Credits: ${c['credits']} | Pt: ${c['gradePoint']}',
                        style: const TextStyle(color: Color(0xFF14B8A6), fontWeight: FontWeight.bold, fontSize: 12),
                      )
                    ],
                  ),
                );
              },
            )
          ],
        ),
      ),
    );
  }
}
