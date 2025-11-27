<?php

namespace App\Http\Controllers;

use App\Models\PricingSetting;
use App\Services\PricingEngine;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    protected PricingEngine $pricingEngine;

    public function __construct(PricingEngine $pricingEngine)
    {
        $this->pricingEngine = $pricingEngine;
    }

    public function getPricingSettings()
    {
        $settings = PricingSetting::all()->mapWithKeys(function ($setting) {
            return [$setting->key => $setting->value];
        });

        if ($settings->isEmpty()) {
            return response()->json($this->pricingEngine->getSettings());
        }

        return response()->json($settings);
    }

    public function updatePricingSettings(Request $request)
    {
        $validated = $request->validate([
            'grundpreis' => 'sometimes|numeric|min:0',
            'preisProKm' => 'sometimes|numeric|min:0',
            'preisProEtage' => 'sometimes|numeric|min:0',
            'stundenlohn' => 'sometimes|numeric|min:0',
            'preisniveau' => 'sometimes|in:medium,above,high',
            'prozentAufschlag' => 'sometimes|numeric|min:0|max:100',
        ]);

        foreach ($validated as $key => $value) {
            PricingSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'description' => "Einstellung: {$key}"]
            );
        }

        $this->pricingEngine->updateSettings($validated);

        return response()->json([
            'message' => 'Preiseinstellungen erfolgreich aktualisiert',
            'settings' => $this->pricingEngine->getSettings(),
        ]);
    }

    public function getFurnitureList()
    {
        return response()->json([
            'furniture_list' => $this->pricingEngine->getFurnitureList(),
        ]);
    }

    public function getFurnitureDetails(Request $request)
    {
        $furnitureName = $request->get('furniture_name');

        if (!$furnitureName) {
            return response()->json(['error' => 'Möbel Name erforderlich'], 400);
        }

        $details = $this->pricingEngine->getFurnitureDetails($furnitureName);

        if (empty($details)) {
            return response()->json(['error' => 'Möbel nicht gefunden'], 404);
        }

        return response()->json([
            'furniture_name' => $furnitureName,
            'details' => $details,
        ]);
    }

    public function getCompanySettings()
    {
        $settings = PricingSetting::where('key', 'like', 'company_%')->get()
            ->mapWithKeys(function ($setting) {
                return [$setting->key => $setting->value];
            });

        return response()->json($settings);
    }

    public function updateCompanySettings(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'sometimes|string|max:255',
            'company_email' => 'sometimes|email',
            'company_phone' => 'sometimes|string|max:20',
            'company_address' => 'sometimes|string|max:255',
            'company_city' => 'sometimes|string|max:100',
            'company_postal_code' => 'sometimes|string|max:10',
            'company_tax_id' => 'sometimes|string|max:50',
            'vat_rate' => 'sometimes|numeric|min:0|max:100',
        ]);

        foreach ($validated as $key => $value) {
            PricingSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'description' => "Unternehmenseinstellung: {$key}"]
            );
        }

        return response()->json([
            'message' => 'Unternehmenseinstellungen erfolgreich aktualisiert',
            'settings' => $validated,
        ]);
    }

    public function getDashboardStats()
    {
        return response()->json([
            'total_customers' => \App\Models\Customer::count(),
            'total_contracts' => \App\Models\Contract::count(),
            'total_invoices' => \App\Models\Invoice::count(),
            'pending_invoices' => \App\Models\Invoice::whereIn('status', ['sent', 'overdue'])->count(),
            'upcoming_appointments' => \App\Models\Appointment::where('appointment_date', '>=', now())
                ->where('status', '!=', 'cancelled')
                ->count(),
            'completed_contracts' => \App\Models\Contract::where('status', 'completed')->count(),
        ]);
    }
}
