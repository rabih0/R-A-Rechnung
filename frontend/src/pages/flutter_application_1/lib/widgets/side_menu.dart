import 'package:flutter/material.dart';

class SideMenu extends StatelessWidget {
  const SideMenu({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(color: Colors.blue),
            child: Text(
              'Umzugsmanagement',
              style: TextStyle(color: Colors.white, fontSize: 24),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.dashboard),
            title: const Text('Dashboard'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/');
            },
          ),
          ListTile(
            leading: const Icon(Icons.people),
            title: const Text('Kunden'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/customers');
            },
          ),
          ListTile(
            leading: const Icon(Icons.description),
            title: const Text('Verträge'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/contracts');
            },
          ),
          ListTile(
            leading: const Icon(Icons.receipt),
            title: const Text('Rechnungen'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/invoices');
            },
          ),
          ListTile(
            leading: const Icon(Icons.calendar_today),
            title: const Text('Termine'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/appointments');
            },
          ),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('Einstellungen'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/settings');
            },
          ),
        ],
      ),
    );
  }
}
