class Customer {
  final int? id;
  final String name;
  final String email;
  final String phone;
  final String address;

  Customer({
    this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.address,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'phone': phone,
    'address': address,
  };

  static Customer fromJson(Map<String, dynamic> json) => Customer(
    id: json['id'] as int?,
    name: json['name'] as String,
    email: json['email'] as String,
    phone: json['phone'] as String,
    address: json['address'] as String,
  );

  Customer copy({
    int? id,
    String? name,
    String? email,
    String? phone,
    String? address,
  }) => Customer(
    id: id ?? this.id,
    name: name ?? this.name,
    email: email ?? this.email,
    phone: phone ?? this.phone,
    address: address ?? this.address,
  );
}
