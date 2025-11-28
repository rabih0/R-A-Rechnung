import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../models/customer.dart';
import '../widgets/side_menu.dart';

class CustomerScreen extends StatelessWidget {
  const CustomerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Kunden')),
      drawer: const SideMenu(),
      body: ListView.builder(
        itemCount: provider.customers.length,
        itemBuilder: (context, index) {
          final customer = provider.customers[index];
          return ListTile(
            title: Text(customer.name),
            subtitle: Text('${customer.email} | ${customer.phone}'),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(
                  icon: const Icon(Icons.edit, color: Colors.blue),
                  onPressed: () => _showCustomerDialog(context, customer),
                ),
                IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: () =>
                      _confirmDelete(context, provider, customer.id!),
                ),
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCustomerDialog(context, null),
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showCustomerDialog(BuildContext context, Customer? customer) {
    final nameController = TextEditingController(text: customer?.name ?? '');
    final emailController = TextEditingController(text: customer?.email ?? '');
    final phoneController = TextEditingController(text: customer?.phone ?? '');
    final addressController = TextEditingController(
      text: customer?.address ?? '',
    );

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(customer == null ? 'Neuer Kunde' : 'Kunde bearbeiten'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: const InputDecoration(labelText: 'Name'),
              ),
              TextField(
                controller: emailController,
                decoration: const InputDecoration(labelText: 'Email'),
              ),
              TextField(
                controller: phoneController,
                decoration: const InputDecoration(labelText: 'Telefon'),
              ),
              TextField(
                controller: addressController,
                decoration: const InputDecoration(labelText: 'Adresse'),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Abbrechen'),
          ),
          ElevatedButton(
            onPressed: () {
              final newCustomer = Customer(
                id: customer?.id,
                name: nameController.text,
                email: emailController.text,
                phone: phoneController.text,
                address: addressController.text,
              );

              final provider = Provider.of<AppProvider>(context, listen: false);
              if (customer == null) {
                provider.addCustomer(newCustomer);
              } else {
                provider.updateCustomer(newCustomer);
              }
              Navigator.pop(context);
            },
            child: const Text('Speichern'),
          ),
        ],
      ),
    );
  }

  void _confirmDelete(BuildContext context, AppProvider provider, int id) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Löschen bestätigen'),
        content: const Text('Möchten Sie diesen Kunden wirklich löschen?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Nein'),
          ),
          ElevatedButton(
            onPressed: () {
              provider.deleteCustomer(id);
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Ja'),
          ),
        ],
      ),
    );
  }
}
