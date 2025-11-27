<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%");
        }

        $customers = $query->paginate($request->get('per_page', 15));

        return response()->json($customers);
    }

    public function show(Customer $customer)
    {
        return response()->json($customer);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:10',
            'country' => 'sometimes|string|max:100',
            'notes' => 'sometimes|string',
        ]);

        $customer = Customer::create($validated);

        return response()->json([
            'message' => 'Kunde erfolgreich erstellt',
            'customer' => $customer,
        ], 201);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:customers,email,' . $customer->id,
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:100',
            'postal_code' => 'sometimes|string|max:10',
            'country' => 'sometimes|string|max:100',
            'notes' => 'sometimes|string',
        ]);

        $customer->update($validated);

        return response()->json([
            'message' => 'Kunde erfolgreich aktualisiert',
            'customer' => $customer,
        ]);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return response()->json([
            'message' => 'Kunde erfolgreich gelöscht',
        ]);
    }

    public function getStats()
    {
        return response()->json([
            'total_customers' => Customer::count(),
            'total_contracts' => Customer::sum('contracts_count'),
            'total_invoices' => Customer::sum('invoices_count'),
        ]);
    }
}
