<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\ContractItem;
use App\Services\PricingEngine;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    protected PricingEngine $pricingEngine;

    public function __construct(PricingEngine $pricingEngine)
    {
        $this->pricingEngine = $pricingEngine;
    }

    public function index(Request $request)
    {
        $query = Contract::with(['customer', 'items'])
            ->orderBy('contract_date', 'desc');

        if ($request->has('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('contract_number', 'like', "%{$search}%")
                ->orWhere('from_address', 'like', "%{$search}%")
                ->orWhere('to_address', 'like', "%{$search}%");
        }

        $contracts = $query->paginate($request->get('per_page', 15));

        return response()->json($contracts);
    }

    public function show(Contract $contract)
    {
        return response()->json($contract->load(['customer', 'items']));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'contract_date' => 'required|date',
            'from_address' => 'required|string',
            'to_address' => 'required|string',
            'distance_km' => 'required|numeric|min:0',
            'from_floors' => 'required|integer|min:0',
            'to_floors' => 'required|integer|min:0',
            'price_level' => 'sometimes|in:medium,above,high',
            'items' => 'sometimes|array',
            'items.*.furniture_name' => 'required_with:items|string',
            'items.*.size' => 'required_with:items|in:M,L,XL,XXL',
            'items.*.quantity' => 'sometimes|integer|min:1',
            'items.*.montage' => 'sometimes|boolean',
            'items.*.demontage' => 'sometimes|boolean',
            'notes' => 'sometimes|string',
        ]);

        $contractNumber = 'CT-' . date('Ymd') . '-' . rand(1000, 9999);

        $priceLevel = $validated['price_level'] ?? 'medium';

        $contract = Contract::create([
            'customer_id' => $validated['customer_id'],
            'contract_number' => $contractNumber,
            'contract_date' => $validated['contract_date'],
            'from_address' => $validated['from_address'],
            'to_address' => $validated['to_address'],
            'distance_km' => $validated['distance_km'],
            'from_floors' => $validated['from_floors'],
            'to_floors' => $validated['to_floors'],
            'price_level' => $priceLevel,
            'status' => 'draft',
            'notes' => $validated['notes'] ?? null,
        ]);

        $items = $validated['items'] ?? [];

        if (count($items) > 0) {
            $pricingResult = $this->pricingEngine->calculatePrice(
                $items,
                $priceLevel,
                $validated['distance_km'],
                $validated['from_floors'],
                $validated['to_floors']
            );

            foreach ($pricingResult['items_details'] as $item) {
                ContractItem::create([
                    'contract_id' => $contract->id,
                    'furniture_name' => $item['furniture_name'],
                    'size' => $item['size'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'montage_price' => $item['montage_price'],
                    'demontage_price' => $item['demontage_price'],
                    'total_price' => $item['total_price'],
                ]);
            }

            $contract->update(['total_price' => $pricingResult['total']]);
        }

        return response()->json([
            'message' => 'Vertrag erfolgreich erstellt',
            'contract' => $contract->load(['customer', 'items']),
        ], 201);
    }

    public function update(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'contract_date' => 'sometimes|date',
            'from_address' => 'sometimes|string',
            'to_address' => 'sometimes|string',
            'distance_km' => 'sometimes|numeric|min:0',
            'from_floors' => 'sometimes|integer|min:0',
            'to_floors' => 'sometimes|integer|min:0',
            'price_level' => 'sometimes|in:medium,above,high',
            'status' => 'sometimes|in:draft,pending,confirmed,completed,cancelled',
            'notes' => 'sometimes|string',
        ]);

        $contract->update($validated);

        return response()->json([
            'message' => 'Vertrag erfolgreich aktualisiert',
            'contract' => $contract,
        ]);
    }

    public function destroy(Contract $contract)
    {
        $contract->delete();

        return response()->json([
            'message' => 'Vertrag erfolgreich gelöscht',
        ]);
    }

    public function calculatePrice(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.furniture_name' => 'required|string',
            'items.*.size' => 'required|in:M,L,XL,XXL',
            'items.*.quantity' => 'sometimes|integer|min:1',
            'items.*.montage' => 'sometimes|boolean',
            'items.*.demontage' => 'sometimes|boolean',
            'distance_km' => 'required|numeric|min:0',
            'from_floors' => 'required|integer|min:0',
            'to_floors' => 'required|integer|min:0',
            'price_level' => 'sometimes|in:medium,above,high',
        ]);

        $pricingResult = $this->pricingEngine->calculatePrice(
            $validated['items'],
            $validated['price_level'] ?? 'medium',
            $validated['distance_km'],
            $validated['from_floors'],
            $validated['to_floors']
        );

        return response()->json($pricingResult);
    }

    public function addItem(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'furniture_name' => 'required|string',
            'size' => 'required|in:M,L,XL,XXL',
            'quantity' => 'required|integer|min:1',
            'montage' => 'sometimes|boolean',
            'demontage' => 'sometimes|boolean',
        ]);

        $item = ContractItem::create([
            'contract_id' => $contract->id,
            'furniture_name' => $validated['furniture_name'],
            'size' => $validated['size'],
            'quantity' => $validated['quantity'],
            'unit_price' => 0,
            'montage_price' => $validated['montage'] ? 0 : null,
            'demontage_price' => $validated['demontage'] ? 0 : null,
            'total_price' => 0,
        ]);

        return response()->json([
            'message' => 'Element erfolgreich hinzugefügt',
            'item' => $item,
        ], 201);
    }
}
