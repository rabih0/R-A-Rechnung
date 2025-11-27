<?php

namespace App\Services;

class PricingEngine
{
    private array $settings = [
        'grundpreis' => 54.5,
        'preisProKm' => 1.308,
        'preisProEtage' => 8.72,
        'stundenlohn' => 27.25,
        'preisniveau' => 'medium',
        'prozentAufschlag' => 0,
    ];

    private array $moebel = [
        'Bett' => [
            'M' => ['medium' => 54.5, 'above' => 65.4, 'high' => 81.75],
            'L' => ['medium' => 76.3, 'above' => 92.65, 'high' => 119.9],
            'XL' => ['medium' => 98.1, 'above' => 119.9, 'high' => 152.6],
            'XXL' => ['medium' => 130.8, 'above' => 163.5, 'high' => 196.2],
            'montage' => 27.25,
            'demontage' => 21.8,
        ],
        'Sofa' => [
            'M' => ['medium' => 43.6, 'above' => 59.95, 'high' => 76.3],
            'L' => ['medium' => 65.4, 'above' => 81.75, 'high' => 103.55],
            'XL' => ['medium' => 87.2, 'above' => 109, 'high' => 141.7],
            'XXL' => ['medium' => 119.9, 'above' => 141.7, 'high' => 174.4],
            'montage' => 0,
            'demontage' => 0,
        ],
        'Küchenschrank' => [
            'M' => ['medium' => 54.5, 'above' => 65.4, 'high' => 87.2],
            'L' => ['medium' => 76.3, 'above' => 92.65, 'high' => 119.9],
            'XL' => ['medium' => 98.1, 'above' => 119.9, 'high' => 152.6],
            'XXL' => ['medium' => 130.8, 'above' => 163.5, 'high' => 196.2],
            'montage' => 32.7,
            'demontage' => 27.25,
        ],
        'Waschmaschine' => [
            'M' => ['medium' => 54.5, 'above' => 65.4, 'high' => 87.2],
            'L' => ['medium' => 76.3, 'above' => 92.65, 'high' => 119.9],
            'XL' => ['medium' => 98.1, 'above' => 119.9, 'high' => 152.6],
            'XXL' => ['medium' => 130.8, 'above' => 163.5, 'high' => 196.2],
            'montage' => 16.35,
            'demontage' => 10.9,
        ],
        'Kartons' => [
            'M' => ['medium' => 3.27, 'above' => 4.36, 'high' => 5.45],
            'L' => ['medium' => 4.36, 'above' => 5.45, 'high' => 6.54],
            'XL' => ['medium' => 5.45, 'above' => 6.54, 'high' => 7.63],
            'XXL' => ['medium' => 6.54, 'above' => 7.63, 'high' => 8.72],
            'montage' => 0,
            'demontage' => 0,
        ],
        'Heavy Item' => [
            'M' => ['medium' => 218, 'above' => 239.8, 'high' => 272.5],
            'L' => ['medium' => 272.5, 'above' => 305.2, 'high' => 348.8],
            'XL' => ['medium' => 327, 'above' => 381.5, 'high' => 436],
            'XXL' => ['medium' => 436, 'above' => 490.5, 'high' => 545],
            'montage' => 54.5,
            'demontage' => 54.5,
        ],
        'Fahrdienst' => [
            'M' => ['medium' => 1.09, 'above' => 1.308, 'high' => 1.635],
            'L' => ['medium' => 1.09, 'above' => 1.308, 'high' => 1.635],
            'XL' => ['medium' => 1.09, 'above' => 1.308, 'high' => 1.635],
            'XXL' => ['medium' => 1.09, 'above' => 1.308, 'high' => 1.635],
            'montage' => 0,
            'demontage' => 0,
        ],
        'Etagenaufschlag' => [
            'M' => ['medium' => 5.45, 'above' => 6.54, 'high' => 8.72],
            'L' => ['medium' => 5.45, 'above' => 6.54, 'high' => 8.72],
            'XL' => ['medium' => 5.45, 'above' => 6.54, 'high' => 8.72],
            'XXL' => ['medium' => 5.45, 'above' => 6.54, 'high' => 8.72],
            'montage' => 0,
            'demontage' => 0,
        ],
        'Arbeitsstunde' => [
            'M' => ['medium' => 21.8, 'above' => 27.25, 'high' => 32.7],
            'L' => ['medium' => 21.8, 'above' => 27.25, 'high' => 32.7],
            'XL' => ['medium' => 21.8, 'above' => 27.25, 'high' => 32.7],
            'XXL' => ['medium' => 21.8, 'above' => 27.25, 'high' => 32.7],
            'montage' => 0,
            'demontage' => 0,
        ],
    ];

    public function calculatePrice(array $items, string $priceLevel = 'medium', float $distanceKm = 0, int $fromFloors = 0, int $toFloors = 0): array
    {
        $basePrice = $this->settings['grundpreis'];
        $distancePrice = $distanceKm * $this->settings['preisProKm'];
        $floorPrice = ($fromFloors + $toFloors) * $this->settings['preisProEtage'];

        $itemsPrice = 0;
        $itemsDetails = [];

        foreach ($items as $item) {
            $furnitureName = $item['name'] ?? $item['furniture_name'] ?? '';
            $size = $item['size'] ?? 'M';
            $quantity = $item['quantity'] ?? 1;

            if (!isset($this->moebel[$furnitureName])) {
                continue;
            }

            $furniture = $this->moebel[$furnitureName];
            $sizePrice = $furniture[$size][$priceLevel] ?? 0;
            $montagePrice = ($item['montage'] ?? false) ? ($furniture['montage'] ?? 0) : 0;
            $demontagePrice = ($item['demontage'] ?? false) ? ($furniture['demontage'] ?? 0) : 0;

            $itemTotal = ($sizePrice + $montagePrice + $demontagePrice) * $quantity;
            $itemsPrice += $itemTotal;

            $itemsDetails[] = [
                'furniture_name' => $furnitureName,
                'size' => $size,
                'quantity' => $quantity,
                'unit_price' => $sizePrice,
                'montage_price' => $montagePrice,
                'demontage_price' => $demontagePrice,
                'total_price' => $itemTotal,
            ];
        }

        $subtotal = $basePrice + $distancePrice + $floorPrice + $itemsPrice;
        $surcharge = $subtotal * ($this->settings['prozentAufschlag'] / 100);
        $subtotal += $surcharge;

        $tax = $subtotal * 0.19;
        $total = $subtotal + $tax;

        return [
            'base_price' => round($basePrice, 2),
            'distance_price' => round($distancePrice, 2),
            'floor_price' => round($floorPrice, 2),
            'items_price' => round($itemsPrice, 2),
            'items_details' => $itemsDetails,
            'subtotal' => round($subtotal, 2),
            'tax' => round($tax, 2),
            'total' => round($total, 2),
            'price_level' => $priceLevel,
        ];
    }

    public function updateSettings(array $newSettings): void
    {
        $this->settings = array_merge($this->settings, $newSettings);
    }

    public function getSettings(): array
    {
        return $this->settings;
    }

    public function getFurnitureList(): array
    {
        return array_keys($this->moebel);
    }

    public function getFurnitureDetails(string $furnitureName): array
    {
        return $this->moebel[$furnitureName] ?? [];
    }
}
