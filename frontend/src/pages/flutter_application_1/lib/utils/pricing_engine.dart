import '../models/furniture_item.dart';

class PricingEngine {
  // Factor 1.09 is applied to all base prices as per requirements
  static const double _factor = 1.09;

  static final Map<String, Map<String, dynamic>> _catalog = {
    "Bett": {
      "M": {
        "medium": 50 * _factor,
        "above": 60 * _factor,
        "high": 75 * _factor,
      },
      "L": {
        "medium": 70 * _factor,
        "above": 85 * _factor,
        "high": 110 * _factor,
      },
      "XL": {
        "medium": 90 * _factor,
        "above": 110 * _factor,
        "high": 140 * _factor,
      },
      "XXL": {
        "medium": 120 * _factor,
        "above": 150 * _factor,
        "high": 180 * _factor,
      },
      "montage": 25 * _factor,
      "demontage": 20 * _factor,
    },
    "Sofa": {
      "M": {
        "medium": 40 * _factor,
        "above": 55 * _factor,
        "high": 70 * _factor,
      },
      "L": {
        "medium": 60 * _factor,
        "above": 75 * _factor,
        "high": 95 * _factor,
      },
      "XL": {
        "medium": 80 * _factor,
        "above": 100 * _factor,
        "high": 130 * _factor,
      },
      "XXL": {
        "medium": 110 * _factor,
        "above": 130 * _factor,
        "high": 160 * _factor,
      },
      "montage": 0.0,
      "demontage": 0.0,
    },
    "Küchenschrank": {
      "M": {
        "medium": 50 * _factor,
        "above": 60 * _factor,
        "high": 80 * _factor,
      },
      "L": {
        "medium": 70 * _factor,
        "above": 85 * _factor,
        "high": 110 * _factor,
      },
      "XL": {
        "medium": 90 * _factor,
        "above": 110 * _factor,
        "high": 140 * _factor,
      },
      "XXL": {
        "medium": 120 * _factor,
        "above": 150 * _factor,
        "high": 180 * _factor,
      },
      "montage": 30 * _factor,
      "demontage": 25 * _factor,
    },
    "Waschmaschine": {
      "M": {
        "medium": 50 * _factor,
        "above": 60 * _factor,
        "high": 80 * _factor,
      },
      "L": {
        "medium": 70 * _factor,
        "above": 85 * _factor,
        "high": 110 * _factor,
      },
      "XL": {
        "medium": 90 * _factor,
        "above": 110 * _factor,
        "high": 140 * _factor,
      },
      "XXL": {
        "medium": 120 * _factor,
        "above": 150 * _factor,
        "high": 180 * _factor,
      },
      "montage": 15 * _factor,
      "demontage": 10 * _factor,
    },
    "Kartons": {
      "M": {"medium": 3 * _factor, "above": 4 * _factor, "high": 5 * _factor},
      "L": {"medium": 4 * _factor, "above": 5 * _factor, "high": 6 * _factor},
      "XL": {"medium": 5 * _factor, "above": 6 * _factor, "high": 7 * _factor},
      "XXL": {"medium": 6 * _factor, "above": 7 * _factor, "high": 8 * _factor},
      "montage": 0.0,
      "demontage": 0.0,
    },
    "Heavy Item": {
      "M": {
        "medium": 200 * _factor,
        "above": 220 * _factor,
        "high": 250 * _factor,
      },
      "L": {
        "medium": 250 * _factor,
        "above": 280 * _factor,
        "high": 320 * _factor,
      },
      "XL": {
        "medium": 300 * _factor,
        "above": 350 * _factor,
        "high": 400 * _factor,
      },
      "XXL": {
        "medium": 400 * _factor,
        "above": 450 * _factor,
        "high": 500 * _factor,
      },
      "montage": 50 * _factor,
      "demontage": 50 * _factor,
    },
    "Lampe": {
      "M": {"medium": 5 * _factor, "above": 6 * _factor, "high": 8 * _factor},
      "L": {"medium": 5 * _factor, "above": 6 * _factor, "high": 8 * _factor},
      "XL": {"medium": 5 * _factor, "above": 6 * _factor, "high": 8 * _factor},
      "XXL": {"medium": 5 * _factor, "above": 6 * _factor, "high": 8 * _factor},
      "montage": 2 * _factor,
      "demontage": 2 * _factor,
    },
    "Fitnessraum": {
      "M": {
        "medium": 50 * _factor,
        "above": 60 * _factor,
        "high": 80 * _factor,
      },
      "L": {
        "medium": 70 * _factor,
        "above": 85 * _factor,
        "high": 110 * _factor,
      },
      "XL": {
        "medium": 90 * _factor,
        "above": 110 * _factor,
        "high": 140 * _factor,
      },
      "XXL": {
        "medium": 120 * _factor,
        "above": 150 * _factor,
        "high": 180 * _factor,
      },
      "montage": 15 * _factor,
      "demontage": 10 * _factor,
    },
    "Garten": {
      "M": {
        "medium": 30 * _factor,
        "above": 40 * _factor,
        "high": 50 * _factor,
      },
      "L": {
        "medium": 50 * _factor,
        "above": 60 * _factor,
        "high": 70 * _factor,
      },
      "XL": {
        "medium": 70 * _factor,
        "above": 85 * _factor,
        "high": 100 * _factor,
      },
      "XXL": {
        "medium": 100 * _factor,
        "above": 120 * _factor,
        "high": 150 * _factor,
      },
      "montage": 10 * _factor,
      "demontage": 5 * _factor,
    },
    "Garage": {
      "M": {
        "medium": 40 * _factor,
        "above": 50 * _factor,
        "high": 60 * _factor,
      },
      "L": {
        "medium": 60 * _factor,
        "above": 70 * _factor,
        "high": 85 * _factor,
      },
      "XL": {
        "medium": 80 * _factor,
        "above": 100 * _factor,
        "high": 120 * _factor,
      },
      "XXL": {
        "medium": 100 * _factor,
        "above": 120 * _factor,
        "high": 150 * _factor,
      },
      "montage": 10 * _factor,
      "demontage": 10 * _factor,
    },
    "Keller": {
      "M": {
        "medium": 50 * _factor,
        "above": 60 * _factor,
        "high": 75 * _factor,
      },
      "L": {
        "medium": 70 * _factor,
        "above": 85 * _factor,
        "high": 110 * _factor,
      },
      "XL": {
        "medium": 90 * _factor,
        "above": 110 * _factor,
        "high": 140 * _factor,
      },
      "XXL": {
        "medium": 120 * _factor,
        "above": 150 * _factor,
        "high": 180 * _factor,
      },
      "montage": 20 * _factor,
      "demontage": 15 * _factor,
    },
  };

  static List<String> get itemNames => _catalog.keys.toList();
  static List<String> get sizes => ["M", "L", "XL", "XXL"];
  static List<String> get levels => ["medium", "above", "high"];

  static double calculateItemPrice({
    required String name,
    required String size,
    required String level,
    required bool montage,
    required bool demontage,
  }) {
    if (!_catalog.containsKey(name)) return 0.0;

    final itemData = _catalog[name]!;
    final sizeData = itemData[size] as Map<String, dynamic>?;

    if (sizeData == null) return 0.0;

    double price = (sizeData[level] as num).toDouble();

    if (montage) {
      price += (itemData['montage'] as num).toDouble();
    }
    if (demontage) {
      price += (itemData['demontage'] as num).toDouble();
    }

    return price;
  }

  static double calculateTotal(
    List<FurnitureItem> items,
    double distance,
    int floors,
    double workHours,
    Map<String, double> settings,
  ) {
    double total = 0.0;

    // Items total
    for (var item in items) {
      total += item.price * item.count;
    }

    // Distance
    double kmPrice = settings['preisProKm'] ?? (1.2 * _factor);
    total += distance * kmPrice;

    // Floors
    double floorPrice = settings['preisProEtage'] ?? (8 * _factor);
    total += floors * floorPrice;

    // Work Hours
    double hourlyRate = settings['stundenlohn'] ?? (25 * _factor);
    total += workHours * hourlyRate;

    // Base Price
    double basePrice = settings['grundpreis'] ?? (50 * _factor);
    total += basePrice;

    return total;
  }
}
