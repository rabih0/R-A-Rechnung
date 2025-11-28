import 'dart:convert';

class Invoice {
  final int? id;
  final int contractId;
  final String invoiceNumber;
  final DateTime date;
  final double totalAmount;
  final List<InvoiceItem> items;

  Invoice({
    this.id,
    required this.contractId,
    required this.invoiceNumber,
    required this.date,
    required this.totalAmount,
    required this.items,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'contract_id': contractId,
    'invoice_number': invoiceNumber,
    'date': date.toIso8601String(),
    'total_amount': totalAmount,
    'items': jsonEncode(items.map((e) => e.toJson()).toList()),
  };

  static Invoice fromJson(Map<String, dynamic> json) => Invoice(
    id: json['id'] as int?,
    contractId: json['contract_id'] as int,
    invoiceNumber: json['invoice_number'] as String,
    date: DateTime.parse(json['date'] as String),
    totalAmount: (json['total_amount'] as num).toDouble(),
    items: (jsonDecode(json['items'] as String) as List<dynamic>)
        .map((e) => InvoiceItem.fromJson(e))
        .toList(),
  );
}

class InvoiceItem {
  final String description;
  final int quantity;
  final double unitPrice;
  final double total;

  InvoiceItem({
    required this.description,
    required this.quantity,
    required this.unitPrice,
    required this.total,
  });

  Map<String, dynamic> toJson() => {
    'description': description,
    'quantity': quantity,
    'unitPrice': unitPrice,
    'total': total,
  };

  static InvoiceItem fromJson(Map<String, dynamic> json) => InvoiceItem(
    description: json['description'] as String,
    quantity: json['quantity'] as int,
    unitPrice: (json['unitPrice'] as num).toDouble(),
    total: (json['total'] as num).toDouble(),
  );
}
