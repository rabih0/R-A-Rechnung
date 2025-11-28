class Appointment {
  final int? id;
  final int customerId;
  final int? contractId;
  final DateTime date;
  final String time;
  final String description;

  Appointment({
    this.id,
    required this.customerId,
    this.contractId,
    required this.date,
    required this.time,
    required this.description,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'customer_id': customerId,
    'contract_id': contractId,
    'date': date.toIso8601String(),
    'time': time,
    'description': description,
  };

  static Appointment fromJson(Map<String, dynamic> json) => Appointment(
    id: json['id'] as int?,
    customerId: json['customer_id'] as int,
    contractId: json['contract_id'] as int?,
    date: DateTime.parse(json['date'] as String),
    time: json['time'] as String,
    description: json['description'] as String,
  );
}
