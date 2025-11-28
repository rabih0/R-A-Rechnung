import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/app_provider.dart';
import 'screens/dashboard_screen.dart';
import 'screens/customer_screen.dart';
import 'screens/contract_screen.dart';
import 'screens/invoice_screen.dart';
import 'screens/appointment_screen.dart';
import 'screens/settings_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AppProvider()..loadData()),
      ],
      child: MaterialApp(
        title: 'Umzugsmanagement System',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
          useMaterial3: true,
        ),
        initialRoute: '/',
        routes: {
          '/': (context) => const DashboardScreen(),
          '/customers': (context) => const CustomerScreen(),
          '/contracts': (context) => const ContractScreen(),
          '/invoices': (context) => const InvoiceScreen(),
          '/appointments': (context) => const AppointmentScreen(),
          '/settings': (context) => const SettingsScreen(),
        },
      ),
    );
  }
}
