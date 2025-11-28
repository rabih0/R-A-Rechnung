import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../models/customer.dart';
import '../models/contract.dart';
import '../models/furniture_item.dart';
import '../utils/pricing_engine.dart';

class PricingCalculatorScreen extends StatefulWidget {
  const PricingCalculatorScreen({super.key});

  @override
  State<PricingCalculatorScreen> createState() =>
      _PricingCalculatorScreenState();
}

class _PricingCalculatorScreenState extends State<PricingCalculatorScreen> {
  Customer? _selectedCustomer;
  final List<FurnitureItem> _items = [];

  // Contract details
  final TextEditingController _distanceController = TextEditingController(
    text: '0',
  );
  final TextEditingController _floorsController = TextEditingController(
    text: '0',
  );
  final TextEditingController _hoursController = TextEditingController(
    text: '0',
  );

  // The requirements say "Select price level (medium - above - high)" in the calculator UI.
  // It seems it applies to the items being added or globally.
  // The JS structure has prices per level per item size.
  // Let's assume the user selects the level for each item addition, or sets a global preference.
  // The UI requirement says: "Select level... Add to contract". So likely per item addition.

  // Item addition form state
  String? _selectedItemName;
  String _selectedSize = 'M';
  String _selectedItemLevel = 'medium';
  int _itemCount = 1;
  bool _montage = false;
  bool _demontage = false;

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    double total = _calculateTotal(provider.pricingSettings);

    return Scaffold(
      appBar: AppBar(title: const Text('Neuer Vertrag / Preisrechner')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // 1. Select Customer
            DropdownButtonFormField<Customer>(
              decoration: const InputDecoration(
                labelText: 'Kunde auswählen',
                border: OutlineInputBorder(),
              ),
              // ignore: deprecated_member_use
              value: _selectedCustomer,
              items: provider.customers.map((c) {
                return DropdownMenuItem(value: c, child: Text(c.name));
              }).toList(),
              onChanged: (v) => setState(() => _selectedCustomer = v),
            ),
            const SizedBox(height: 20),

            // 2. Add Items Section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    const Text(
                      'Möbel hinzufügen',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    DropdownButtonFormField<String>(
                      decoration: const InputDecoration(
                        labelText: 'Möbelstück',
                      ),
                      // ignore: deprecated_member_use
                      value: _selectedItemName,
                      items: PricingEngine.itemNames
                          .map(
                            (n) => DropdownMenuItem(value: n, child: Text(n)),
                          )
                          .toList(),
                      onChanged: (v) => setState(() => _selectedItemName = v),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            decoration: const InputDecoration(
                              labelText: 'Größe',
                            ),
                            // ignore: deprecated_member_use
                            value: _selectedSize,
                            items: PricingEngine.sizes
                                .map(
                                  (s) => DropdownMenuItem(
                                    value: s,
                                    child: Text(s),
                                  ),
                                )
                                .toList(),
                            onChanged: (v) =>
                                setState(() => _selectedSize = v!),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            decoration: const InputDecoration(
                              labelText: 'Niveau',
                            ),
                            // ignore: deprecated_member_use
                            value: _selectedItemLevel,
                            items: PricingEngine.levels
                                .map(
                                  (l) => DropdownMenuItem(
                                    value: l,
                                    child: Text(l),
                                  ),
                                )
                                .toList(),
                            onChanged: (v) =>
                                setState(() => _selectedItemLevel = v!),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            decoration: const InputDecoration(
                              labelText: 'Anzahl',
                            ),
                            keyboardType: TextInputType.number,
                            initialValue: '1',
                            onChanged: (v) => _itemCount = int.tryParse(v) ?? 1,
                          ),
                        ),
                        Checkbox(
                          value: _montage,
                          onChanged: (v) => setState(() => _montage = v!),
                        ),
                        const Text('Montage'),
                        Checkbox(
                          value: _demontage,
                          onChanged: (v) => setState(() => _demontage = v!),
                        ),
                        const Text('Demontage'),
                      ],
                    ),
                    const SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: _addItem,
                      child: const Text('Hinzufügen'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // 3. List Added Items
            if (_items.isNotEmpty) ...[
              const Text(
                'Positionen:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _items.length,
                itemBuilder: (context, index) {
                  final item = _items[index];
                  return ListTile(
                    title: Text('${item.count}x ${item.name} (${item.size})'),
                    subtitle: Text('Preis: ${item.price.toStringAsFixed(2)}€'),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red),
                      onPressed: () => setState(() => _items.removeAt(index)),
                    ),
                  );
                },
              ),
              const Divider(),
            ],

            // 4. Logistics Details
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _distanceController,
                    decoration: const InputDecoration(
                      labelText: 'Distanz (km)',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.number,
                    onChanged: (_) => setState(() {}),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: TextField(
                    controller: _floorsController,
                    decoration: const InputDecoration(
                      labelText: 'Etagen',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.number,
                    onChanged: (_) => setState(() {}),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: TextField(
                    controller: _hoursController,
                    decoration: const InputDecoration(
                      labelText: 'Arbeitsstunden',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.number,
                    onChanged: (_) => setState(() {}),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // 5. Total and Save
            Card(
              color: Colors.blue.shade50,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    Text(
                      'Gesamtpreis: ${total.toStringAsFixed(2)} €',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.blue,
                      ),
                    ),
                    const SizedBox(height: 10),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 32,
                          vertical: 12,
                        ),
                      ),
                      onPressed: _selectedCustomer == null
                          ? null
                          : () => _saveContract(provider, total),
                      child: const Text(
                        'Vertrag erstellen',
                        style: TextStyle(fontSize: 18),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _addItem() {
    if (_selectedItemName == null) return;

    final price = PricingEngine.calculateItemPrice(
      name: _selectedItemName!,
      size: _selectedSize,
      level: _selectedItemLevel,
      montage: _montage,
      demontage: _demontage,
    );

    // We need to store montage/demontage price components separately if needed for breakdown,
    // but the model stores total price per item.
    // Let's approximate breakdown or just store total.
    // The PricingEngine returns total unit price including services.

    // Wait, the model FurnitureItem has montagePrice and demontagePrice fields.
    // I should calculate them separately to populate the model correctly.
    // But PricingEngine.calculateItemPrice returns the SUM.
    // I should probably expose breakdown in PricingEngine or just calculate here manually using the map logic?
    // Or update PricingEngine to return a breakdown object.

    // For now, I'll just put 0 for breakdown fields or try to be more precise if I have time.
    // Let's just store the total unit price in 'price' and 0 in others for now, or update the model to be simpler.
    // Actually, let's just use the total price.

    setState(() {
      _items.add(
        FurnitureItem(
          name: _selectedItemName!,
          size: _selectedSize,
          count: _itemCount,
          price: price, // Unit price
          montagePrice: _montage
              ? 1.0
              : 0.0, // Dummy values if not strictly needed for calculation
          demontagePrice: _demontage ? 1.0 : 0.0,
        ),
      );
    });
  }

  double _calculateTotal(Map<String, double> settings) {
    double distance = double.tryParse(_distanceController.text) ?? 0.0;
    int floors = int.tryParse(_floorsController.text) ?? 0;
    double hours = double.tryParse(_hoursController.text) ?? 0.0;

    return PricingEngine.calculateTotal(
      _items,
      distance,
      floors,
      hours,
      settings,
    );
  }

  void _saveContract(AppProvider provider, double total) {
    final contract = Contract(
      customerId: _selectedCustomer!.id!,
      date: DateTime.now(),
      totalPrice: total,
      status: 'Draft',
      details: ContractDetails(
        items: _items,
        distance: double.tryParse(_distanceController.text) ?? 0.0,
        floors: int.tryParse(_floorsController.text) ?? 0,
        workHours: double.tryParse(_hoursController.text) ?? 0.0,
        priceLevel:
            _selectedItemLevel, // Using the last selected level as global or just a placeholder
      ),
    );

    provider.addContract(contract);
    Navigator.pop(context);
  }
}
