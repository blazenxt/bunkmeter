class NoteDocument {
  final String id;
  final String title;
  final String subject;
  final String category;
  final String link;
  final String date;

  NoteDocument({
    required this.id,
    required this.title,
    required this.subject,
    required this.category,
    required this.link,
    required this.date,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'subject': subject,
        'category': category,
        'link': link,
        'date': date,
      };

  factory NoteDocument.fromJson(Map<String, dynamic> json) => NoteDocument(
        id: json['id'],
        title: json['title'] ?? '',
        subject: json['subject'] ?? '',
        category: json['category'] ?? 'Class Notes',
        link: json['link'] ?? '',
        date: json['date'] ?? '',
      );
}
