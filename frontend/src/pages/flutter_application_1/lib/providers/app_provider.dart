import 'package:flutter/material.dart';
import 'package:sqflite/sqflite.dart';
import '../db/database_helper.dart';
import '../models/customer.dart';
import '../models/contract.dart';
import '../models/invoice.dart';
import '../models/appointment.dart';

class AppProvider with ChangeNotifier {
  List<Customer> _customers = [];
  List<Contract> _contracts = [];
  List<Invoice> _invoices = [];
  List<Appointment> _appointments = [];
  Map<String, double> _pricingSettings = {};

  List<Customer> get customers => _customers;
  List<Contract> get contracts => _contracts;
  List<Invoice> get invoices => _invoices;
  List<Appointment> get appointments => _appointments;
  Map<String, double> get pricingSettings => _pricingSettings;

  Future<void> loadData() async {
    final db = await DatabaseHelper.instance.database;

    // Load Customers
    final customersData = await db.query('customers');
    _customers = customersData.map((e) => Customer.fromJson(e)).toList();

    // Load Contracts
    final contractsData = await db.query('contracts');
    _contracts = contractsData.map((e) => Contract.fromJson(e)).toList();

    // Load Invoices
    final invoicesData = await db.query('invoices');
    _invoices = invoicesData.map((e) => Invoice.fromJson(e)).toList();

    // Load Appointments
    final appointmentsData = await db.query('appointments');
    _appointments = appointmentsData
        .map((e) => Appointment.fromJson(e))
        .toList();

    // Load Pricing Settings
    final settingsData = await db.query('pricing_settings');
    _pricingSettings = {
      for (var e in settingsData)
        e['key'] as String: (e['value'] as num).toDouble(),
    };

    notifyListeners();
  }

  // Customer Actions
  Future<void> addCustomer(Customer customer) async {
    final db = await DatabaseHelper.instance.database;
    final id = await db.insert('customers', customer.toJson());
    _customers.add(customer.copy(id: id));
    notifyListeners();
  }

  Future<void> updateCustomer(Customer customer) async {
    final db = await DatabaseHelper.instance.database;
    await db.update(
      'customers',
      customer.toJson(),
      where: 'id = ?',
      whereArgs: [customer.id],
    );
    final index = _customers.indexWhere((c) => c.id == customer.id);
    if (index != -1) {
      _customers[index] = customer;
      notifyListeners();
    }
  }

  Future<void> deleteCustomer(int id) async {
    final db = await DatabaseHelper.instance.database;
    await db.delete('customers', where: 'id = ?', whereArgs: [id]);
    _customers.removeWhere((c) => c.id == id);
    notifyListeners();
  }

  // Contract Actions
  Future<void> addContract(Contract contract) async {
    final db = await DatabaseHelper.instance.database;
    await db.insert('contracts', contract.toJson());
    // We need to reload or create a copy with ID, but Contract is immutable and copyWith is not implemented yet.
    // For simplicity, reload data or just add to list if ID is not critical immediately (it is for relationships).
    // Let's reload contracts to be safe or implement copyWith later.
    // Actually, let's just reload all for now to keep it simple and consistent.
    await loadData();
  }

  Future<void> deleteContract(int id) async {
    final db = await DatabaseHelper.instance.database;
    await db.delete('contracts', where: 'id = ?', whereArgs: [id]);
    _contracts.removeWhere((c) => c.id == id);
    notifyListeners();
  }

  // Invoice Actions
  Future<void> addInvoice(Invoice invoice) async {
    final db = await DatabaseHelper.instance.database;
    await db.insert('invoices', invoice.toJson());
    await loadData();
  }

  Future<void> deleteInvoice(int id) async {
    final db = await DatabaseHelper.instance.database;
    await db.delete('invoices', where: 'id = ?', whereArgs: [id]);
    _invoices.removeWhere((i) => i.id == id);
    notifyListeners();
  }

  // Appointment Actions
  Future<void> addAppointment(Appointment appointment) async {
    final db = await DatabaseHelper.instance.database;
    await db.insert('appointments', appointment.toJson());
    await loadData();
  }

  Future<void> deleteAppointment(int id) async {
    final db = await DatabaseHelper.instance.database;
    await db.delete('appointments', where: 'id = ?', whereArgs: [id]);
    _appointments.removeWhere((a) => a.id == id);
    notifyListeners();
  }

  // Settings Actions
  Future<void> updatePricingSetting(String key, double value) async {
    final db = await DatabaseHelper.instance.database;
    await db.insert('pricing_settings', {
      'key': key,
      'value': value,
    }, conflictAlgorithm: ConflictAlgorithm.replace);
    _pricingSettings[key] = value;
    notifyListeners();
  }
}
