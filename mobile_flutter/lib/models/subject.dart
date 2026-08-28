import 'dart:math';

class Subject {
  final String id;
  String name;
  String code;
  int attended;
  int total;
  double target;

  Subject({
    required this.id,
    required this.name,
    required this.code,
    required this.attended,
    required this.total,
    this.target = 75.0,
  });

  double get percentage => total == 0 ? 100.0 : (attended / total) * 100.0;

  bool get isSafe => percentage >= target;

  int get calculatedCount {
    if (total == 0) return 0;
    double tDec = target / 100.0;

    if (isSafe) {
      int safeBunks = ((attended - (tDec * total)) / tDec).floor();
      return max(0, safeBunks);
    } else {
      int mustAttend = (((tDec * total) - attended) / (1.0 - tDec)).ceil();
      return max(0, mustAttend);
    }
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'code': code,
        'attended': attended,
        'total': total,
        'target': target,
      };

  factory Subject.fromJson(Map<String, dynamic> json) => Subject(
        id: json['id'],
        name: json['name'] ?? '',
        code: json['code'] ?? '',
        attended: json['attended'] ?? 0,
        total: json['total'] ?? 0,
        target: (json['target'] ?? 75.0).toDouble(),
      );
}
