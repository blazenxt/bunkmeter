class TimetableSlot {
  final String id;
  final String day;
  final String time;
  final String subject;
  final String room;

  TimetableSlot({
    required this.id,
    required this.day,
    required this.time,
    required this.subject,
    this.room = '',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'day': day,
        'time': time,
        'subject': subject,
        'room': room,
      };

  factory TimetableSlot.fromJson(Map<String, dynamic> json) => TimetableSlot(
        id: json['id'],
        day: json['day'] ?? 'Monday',
        time: json['time'] ?? '',
        subject: json['subject'] ?? '',
        room: json['room'] ?? '',
      );
}
