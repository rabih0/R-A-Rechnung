import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;

  DatabaseHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('moving_system.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(path, version: 1, onCreate: _createDB);
  }

  Future _createDB(Database db, int version) async {
    const idType = 'INTEGER PRIMARY KEY AUTOINCREMENT';
    const textType = 'TEXT NOT NULL';
    const integerType = 'INTEGER NOT NULL';
    const realType = 'REAL NOT NULL';

    // Customers Table
    await db.execute('''
CREATE TABLE customers (
  id $idType,
  name $textType,
  email $textType,
  phone $textType,
  address $textType
)
''');

    // Contracts Table
    await db.execute('''
CREATE TABLE contracts (
  id $idType,
  customer_id $integerType,
  date $textType,
  total_price $realType,
  status $textType,
  details $textType,
  FOREIGN KEY (customer_id) REFERENCES customers (id)
)
''');

    // Invoices Table
    await db.execute('''
CREATE TABLE invoices (
  id $idType,
  contract_id $integerType,
  invoice_number $textType,
  date $textType,
  total_amount $realType,
  items $textType,
  FOREIGN KEY (contract_id) REFERENCES contracts (id)
)
''');

    // Appointments Table
    await db.execute('''
CREATE TABLE appointments (
  id $idType,
  customer_id $integerType,
  contract_id $integerType,
  date $textType,
  time $textType,
  description $textType,
  FOREIGN KEY (customer_id) REFERENCES customers (id),
  FOREIGN KEY (contract_id) REFERENCES contracts (id)
)
''');

    // Pricing Settings Table
    await db.execute('''
CREATE TABLE pricing_settings (
  key $textType PRIMARY KEY,
  value $realType
)
''');

    // Insert default pricing settings
    await _insertDefaultPricing(db);
  }

  Future _insertDefaultPricing(Database db) async {
    final defaults = {
      'grundpreis': 50 * 1.09,
      'preisProKm': 1.2 * 1.09,
      'preisProEtage': 8 * 1.09,
      'stundenlohn': 25 * 1.09,
      'prozentAufschlag': 0.0,
    };

    for (var entry in defaults.entries) {
      await db.insert('pricing_settings', {
        'key': entry.key,
        'value': entry.value,
      });
    }
  }

  Future<void> close() async {
    final db = await instance.database;
    db.close();
  }
}
