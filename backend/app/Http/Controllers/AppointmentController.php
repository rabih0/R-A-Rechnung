<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::with(['customer', 'contract'])
            ->orderBy('appointment_date', 'asc');

        if ($request->has('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('month') && $request->has('year')) {
            $month = $request->get('month');
            $year = $request->get('year');
            $query->whereYear('appointment_date', $year)
                ->whereMonth('appointment_date', $month);
        }

        $appointments = $query->paginate($request->get('per_page', 15));

        return response()->json($appointments);
    }

    public function show(Appointment $appointment)
    {
        return response()->json($appointment->load(['customer', 'contract']));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'contract_id' => 'sometimes|exists:contracts,id',
            'title' => 'required|string|max:255',
            'description' => 'sometimes|string',
            'appointment_date' => 'required|date_format:Y-m-d H:i:s',
            'end_date' => 'required|date_format:Y-m-d H:i:s|after:appointment_date',
            'location' => 'sometimes|string',
            'notify' => 'sometimes|boolean',
        ]);

        $appointment = Appointment::create([
            'customer_id' => $validated['customer_id'],
            'contract_id' => $validated['contract_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'appointment_date' => $validated['appointment_date'],
            'end_date' => $validated['end_date'],
            'status' => 'scheduled',
            'location' => $validated['location'] ?? null,
            'notify' => $validated['notify'] ?? true,
        ]);

        return response()->json([
            'message' => 'Termin erfolgreich erstellt',
            'appointment' => $appointment->load(['customer', 'contract']),
        ], 201);
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'appointment_date' => 'sometimes|date_format:Y-m-d H:i:s',
            'end_date' => 'sometimes|date_format:Y-m-d H:i:s',
            'location' => 'sometimes|string',
            'status' => 'sometimes|in:scheduled,in_progress,completed,cancelled',
            'notify' => 'sometimes|boolean',
        ]);

        $appointment->update($validated);

        return response()->json([
            'message' => 'Termin erfolgreich aktualisiert',
            'appointment' => $appointment,
        ]);
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return response()->json([
            'message' => 'Termin erfolgreich gelöscht',
        ]);
    }

    public function getCalendarEvents(Request $request)
    {
        $month = $request->get('month', date('m'));
        $year = $request->get('year', date('Y'));

        $appointments = Appointment::whereYear('appointment_date', $year)
            ->whereMonth('appointment_date', $month)
            ->with(['customer', 'contract'])
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'title' => $appointment->title,
                    'start' => $appointment->appointment_date,
                    'end' => $appointment->end_date,
                    'status' => $appointment->status,
                    'customer' => $appointment->customer->full_name,
                ];
            });

        return response()->json($appointments);
    }
}
