import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/app_provider.dart';
import '../widgets/side_menu.dart';
import 'pricing_calculator_screen.dart';

class ContractScreen extends StatelessWidget {
  const ContractScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Verträge')),
      drawer: const SideMenu(),
      body: ListView.builder(
        itemCount: provider.contracts.length,
        itemBuilder: (context, index) {
          final contract = provider.contracts[index];
          final customer = provider.customers.firstWhere(
            (c) => c.id == contract.customerId,
            orElse: () =>
                provider.customers.first, // Fallback if customer deleted
          );

          return ListTile(
            title: Text('Vertrag #${contract.id} - ${customer.name}'),
            subtitle: Text(
              '${DateFormat('dd.MM.yyyy').format(contract.date)} | ${contract.totalPrice.toStringAsFixed(2)} €',
            ),
            trailing: Chip(
              label: Text(contract.status),
              backgroundColor: contract.status == 'Signed'
                  ? Colors.green.shade100
                  : Colors.grey.shade200,
            ),
            onTap: () {
              // View details or edit (not implemented yet)
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const PricingCalculatorScreen(),
            ),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
