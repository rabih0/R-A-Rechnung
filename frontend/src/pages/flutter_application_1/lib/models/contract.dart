import 'dart:convert';
import 'furniture_item.dart';

class Contract {
  final int? id;
  final int customerId;
  final DateTime date;
  final double totalPrice;
  final String status; // Draft, Signed, Completed
  final ContractDetails details;

  Contract({
    this.id,
    required this.customerId,
    required this.date,
    required this.totalPrice,
    required this.status,
    required this.details,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'customer_id': customerId,
    'date': date.toIso8601String(),
    'total_price': totalPrice,
    'status': status,
    'details': jsonEncode(details.toJson()),
  };

  static Contract fromJson(Map<String, dynamic> json) => Contract(
    id: json['id'] as int?,
    customerId: json['customer_id'] as int,
    date: DateTime.parse(json['date'] as String),
    totalPrice: (json['total_price'] as num).toDouble(),
    status: json['status'] as String,
    details: ContractDetails.fromJson(jsonDecode(json['details'] as String)),
  );
}

class ContractDetails {
  final List<FurnitureItem> items;
  final double distance;
  final int floors;
  final double workHours;
  final String priceLevel; // medium, above, high

  ContractDetails({
    required this.items,
    required this.distance,
    required this.floors,
    required this.workHours,
    required this.priceLevel,
  });

  Map<String, dynamic> toJson() => {
    'items': items.map((e) => e.toJson()).toList(),
    'distance': distance,
    'floors': floors,
    'workHours': workHours,
    'priceLevel': priceLevel,
  };

  static ContractDetails fromJson(Map<String, dynamic> json) => ContractDetails(
    items: (json['items'] as List<dynamic>)
        .map((e) => FurnitureItem.fromJson(e))
        .toList(),
    distance: (json['distance'] as num).toDouble(),
    floors: json['floors'] as int,
    workHours: (json['workHours'] as num).toDouble(),
    priceLevel: json['priceLevel'] as String,
  );
}
