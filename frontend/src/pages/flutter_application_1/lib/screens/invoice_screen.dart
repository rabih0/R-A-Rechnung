import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:printing/printing.dart';
import 'package:uuid/uuid.dart';
import '../providers/app_provider.dart';
import '../widgets/side_menu.dart';
import '../models/invoice.dart';
import '../models/contract.dart';
import '../utils/pdf_generator.dart';

class InvoiceScreen extends StatelessWidget {
  const InvoiceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Rechnungen')),
      drawer: const SideMenu(),
      body: ListView.builder(
        itemCount: provider.invoices.length,
        itemBuilder: (context, index) {
          final invoice = provider.invoices[index];
          return ListTile(
            leading: const Icon(Icons.receipt),
            title: Text('Rechnung ${invoice.invoiceNumber}'),
            subtitle: Text(
              '${DateFormat('dd.MM.yyyy').format(invoice.date)} | ${invoice.totalAmount.toStringAsFixed(2)} €',
            ),
            trailing: IconButton(
              icon: const Icon(Icons.print),
              onPressed: () => _printInvoice(context, provider, invoice),
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCreateInvoiceDialog(context, provider),
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showCreateInvoiceDialog(BuildContext context, AppProvider provider) {
    Contract? selectedContract;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('Rechnung erstellen'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Wählen Sie einen Vertrag aus:'),
              const SizedBox(height: 10),
              DropdownButton<Contract>(
                isExpanded: true,
                value: selectedContract,
                hint: const Text('Vertrag wählen'),
                items: provider.contracts.map((c) {
                  final customer = provider.customers.firstWhere(
                    (cust) => cust.id == c.customerId,
                  );
                  return DropdownMenuItem(
                    value: c,
                    child: Text(
                      '#${c.id} - ${customer.name} (${c.totalPrice.toStringAsFixed(2)}€)',
                    ),
                  );
                }).toList(),
                onChanged: (v) => setState(() => selectedContract = v),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Abbrechen'),
            ),
            ElevatedButton(
              onPressed: selectedContract == null
                  ? null
                  : () {
                      _createInvoice(context, provider, selectedContract!);
                      Navigator.pop(context);
                    },
              child: const Text('Erstellen'),
            ),
          ],
        ),
      ),
    );
  }

  void _createInvoice(
    BuildContext context,
    AppProvider provider,
    Contract contract,
  ) {
    // Convert contract items to invoice items
    final items = contract.details.items.map((item) {
      return InvoiceItem(
        description: '${item.name} (${item.size})',
        quantity: item.count,
        unitPrice: item.price,
        total: item.price * item.count,
      );
    }).toList();

    // Add logistics as items if needed, or just rely on total match.
    // For simplicity, we'll add one item for "Logistik & Services" to balance the total if needed,
    // or just list the furniture items and assume the rest is base price/services.
    // Let's add explicit items for Distance, Floors, etc.

    // Actually, let's just use the items we have and maybe one "Service Pauschale" for the difference?
    double itemsTotal = items.fold(0, (sum, item) => sum + item.total);
    double difference = contract.totalPrice - itemsTotal;

    if (difference > 0.01) {
      items.add(
        InvoiceItem(
          description: 'Dienstleistungen (Transport, Etagen, etc.)',
          quantity: 1,
          unitPrice: difference,
          total: difference,
        ),
      );
    }

    final invoice = Invoice(
      contractId: contract.id!,
      invoiceNumber: 'INV-${const Uuid().v4().substring(0, 8).toUpperCase()}',
      date: DateTime.now(),
      totalAmount: contract.totalPrice,
      items: items,
    );

    provider.addInvoice(invoice);
  }

  Future<void> _printInvoice(
    BuildContext context,
    AppProvider provider,
    Invoice invoice,
  ) async {
    final contract = provider.contracts.firstWhere(
      (c) => c.id == invoice.contractId,
    );
    final customer = provider.customers.firstWhere(
      (c) => c.id == contract.customerId,
    );

    final pdfBytes = await PdfGenerator.generateInvoice(invoice, customer);

    await Printing.layoutPdf(
      onLayout: (format) async => pdfBytes,
      name: 'Rechnung-${invoice.invoiceNumber}.pdf',
    );
  }
}
