<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::with(['customer', 'contract', 'items'])
            ->orderBy('invoice_date', 'desc');

        if ($request->has('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('invoice_number', 'like', "%{$search}%");
        }

        $invoices = $query->paginate($request->get('per_page', 15));

        return response()->json($invoices);
    }

    public function show(Invoice $invoice)
    {
        return response()->json($invoice->load(['customer', 'contract', 'items']));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'contract_id' => 'sometimes|exists:contracts,id',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date|after:invoice_date',
            'items' => 'sometimes|array',
            'items.*.description' => 'required_with:items|string',
            'items.*.quantity' => 'required_with:items|integer|min:1',
            'items.*.unit_price' => 'required_with:items|numeric|min:0',
            'notes' => 'sometimes|string',
        ]);

        $invoiceNumber = 'INV-' . date('Ymd') . '-' . rand(1000, 9999);

        $subtotal = 0;
        $items = $validated['items'] ?? [];

        foreach ($items as $item) {
            $subtotal += $item['quantity'] * $item['unit_price'];
        }

        $tax = $subtotal * 0.19;
        $total = $subtotal + $tax;

        $invoice = Invoice::create([
            'customer_id' => $validated['customer_id'],
            'contract_id' => $validated['contract_id'] ?? null,
            'invoice_number' => $invoiceNumber,
            'invoice_date' => $validated['invoice_date'],
            'due_date' => $validated['due_date'],
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
            'status' => 'draft',
            'notes' => $validated['notes'] ?? null,
        ]);

        foreach ($items as $item) {
            $itemTotal = $item['quantity'] * $item['unit_price'];
            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total_price' => $itemTotal,
            ]);
        }

        return response()->json([
            'message' => 'Rechnung erfolgreich erstellt',
            'invoice' => $invoice->load(['customer', 'items']),
        ], 201);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:draft,sent,paid,overdue,cancelled',
            'notes' => 'sometimes|string',
        ]);

        $invoice->update($validated);

        return response()->json([
            'message' => 'Rechnung erfolgreich aktualisiert',
            'invoice' => $invoice,
        ]);
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();

        return response()->json([
            'message' => 'Rechnung erfolgreich gelöscht',
        ]);
    }

    public function addItem(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
        ]);

        $totalPrice = $validated['quantity'] * $validated['unit_price'];

        $item = InvoiceItem::create([
            'invoice_id' => $invoice->id,
            'description' => $validated['description'],
            'quantity' => $validated['quantity'],
            'unit_price' => $validated['unit_price'],
            'total_price' => $totalPrice,
        ]);

        $this->updateInvoiceTotals($invoice);

        return response()->json([
            'message' => 'Element erfolgreich hinzugefügt',
            'item' => $item,
        ], 201);
    }

    public function removeItem(Request $request, Invoice $invoice, InvoiceItem $item)
    {
        $item->delete();
        $this->updateInvoiceTotals($invoice);

        return response()->json([
            'message' => 'Element erfolgreich entfernt',
        ]);
    }

    private function updateInvoiceTotals(Invoice $invoice)
    {
        $subtotal = $invoice->items()->sum('total_price');
        $tax = $subtotal * 0.19;
        $total = $subtotal + $tax;

        $invoice->update([
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
        ]);
    }

    public function generatePdf(Invoice $invoice)
    {
        return response()->json([
            'message' => 'PDF-Generierung wird implementiert',
            'invoice_id' => $invoice->id,
        ]);
    }
}
