class FurnitureItem {
  final String name;
  final String size; // M, L, XL, XXL
  final int count;
  final double price;
  final double montagePrice;
  final double demontagePrice;

  FurnitureItem({
    required this.name,
    required this.size,
    required this.count,
    required this.price,
    required this.montagePrice,
    required this.demontagePrice,
  });

  Map<String, dynamic> toJson() => {
    'name': name,
    'size': size,
    'count': count,
    'price': price,
    'montagePrice': montagePrice,
    'demontagePrice': demontagePrice,
  };

  static FurnitureItem fromJson(Map<String, dynamic> json) => FurnitureItem(
    name: json['name'] as String,
    size: json['size'] as String,
    count: json['count'] as int,
    price: (json['price'] as num).toDouble(),
    montagePrice: (json['montagePrice'] as num).toDouble(),
    demontagePrice: (json['demontagePrice'] as num).toDouble(),
  );
}
