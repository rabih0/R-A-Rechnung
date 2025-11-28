import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../widgets/side_menu.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  // We will use a map to store controllers for each setting
  final Map<String, TextEditingController> _controllers = {};

  @override
  void dispose() {
    for (var controller in _controllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final settings = provider.pricingSettings;

    // Initialize controllers if empty or keys changed
    if (_controllers.isEmpty && settings.isNotEmpty) {
      settings.forEach((key, value) {
        _controllers[key] = TextEditingController(text: value.toString());
      });
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Einstellungen')),
      drawer: const SideMenu(),
      body: settings.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16.0),
              children: [
                const Text(
                  'Preiskonfiguration',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                ...settings.keys.map((key) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16.0),
                    child: TextField(
                      controller: _controllers[key],
                      decoration: InputDecoration(
                        labelText: _formatKey(key),
                        border: const OutlineInputBorder(),
                        suffixText: '€',
                      ),
                      keyboardType: const TextInputType.numberWithOptions(
                        decimal: true,
                      ),
                    ),
                  );
                }),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    _saveSettings(context, provider);
                  },
                  child: const Padding(
                    padding: EdgeInsets.all(12.0),
                    child: Text('Speichern', style: TextStyle(fontSize: 18)),
                  ),
                ),
              ],
            ),
    );
  }

  String _formatKey(String key) {
    switch (key) {
      case 'grundpreis':
        return 'Grundpreis';
      case 'preisProKm':
        return 'Preis pro km';
      case 'preisProEtage':
        return 'Preis pro Etage';
      case 'stundenlohn':
        return 'Stundenlohn';
      case 'prozentAufschlag':
        return 'Prozent Aufschlag';
      default:
        return key;
    }
  }

  void _saveSettings(BuildContext context, AppProvider provider) {
    bool success = true;
    _controllers.forEach((key, controller) {
      final value = double.tryParse(controller.text.replaceAll(',', '.'));
      if (value != null) {
        provider.updatePricingSetting(key, value);
      } else {
        success = false;
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          success
              ? 'Einstellungen gespeichert'
              : 'Fehler beim Speichern (Ungültige Zahlen)',
        ),
        backgroundColor: success ? Colors.green : Colors.red,
      ),
    );
  }
}
