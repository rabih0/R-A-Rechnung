import 'dart:typed_data';

import 'package:pdf/widgets.dart' as pw;
import 'package:intl/intl.dart';
import '../models/invoice.dart';
import '../models/customer.dart';

class PdfGenerator {
  static Future<Uint8List> generateInvoice(
    Invoice invoice,
    Customer customer,
  ) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        build: (context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Header(
                level: 0,
                child: pw.Text(
                  'RECHNUNG',
                  style: pw.TextStyle(
                    fontSize: 40,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),
              ),
              pw.SizedBox(height: 20),
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text('Rechnung Nr: ${invoice.invoiceNumber}'),
                      pw.Text(
                        'Datum: ${DateFormat('dd.MM.yyyy').format(invoice.date)}',
                      ),
                    ],
                  ),
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.end,
                    children: [
                      pw.Text(customer.name),
                      pw.Text(customer.address),
                      pw.Text(customer.email),
                    ],
                  ),
                ],
              ),
              pw.SizedBox(height: 40),
              pw.TableHelper.fromTextArray(
                context: context,
                headers: ['Beschreibung', 'Menge', 'Einzelpreis', 'Gesamt'],
                data: invoice.items.map((item) {
                  return [
                    item.description,
                    item.quantity.toString(),
                    '${item.unitPrice.toStringAsFixed(2)} €',
                    '${item.total.toStringAsFixed(2)} €',
                  ];
                }).toList(),
              ),
              pw.SizedBox(height: 20),
              pw.Divider(),
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.end,
                children: [
                  pw.Text(
                    'Gesamtbetrag: ${invoice.totalAmount.toStringAsFixed(2)} €',
                    style: pw.TextStyle(
                      fontSize: 20,
                      fontWeight: pw.FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );

    return pdf.save();
  }
}
