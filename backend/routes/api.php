<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('customers', CustomerController::class);
    Route::get('/customers-stats', [CustomerController::class, 'getStats']);

    Route::apiResource('contracts', ContractController::class);
    Route::post('/contracts/{contract}/items', [ContractController::class, 'addItem']);
    Route::post('/contracts/calculate-price', [ContractController::class, 'calculatePrice']);

    Route::apiResource('invoices', InvoiceController::class);
    Route::post('/invoices/{invoice}/items', [InvoiceController::class, 'addItem']);
    Route::delete('/invoices/{invoice}/items/{item}', [InvoiceController::class, 'removeItem']);
    Route::get('/invoices/{invoice}/pdf', [InvoiceController::class, 'generatePdf']);

    Route::apiResource('appointments', AppointmentController::class);
    Route::get('/appointments/calendar-events', [AppointmentController::class, 'getCalendarEvents']);

    Route::get('/settings/pricing', [SettingsController::class, 'getPricingSettings']);
    Route::post('/settings/pricing', [SettingsController::class, 'updatePricingSettings']);
    Route::get('/settings/furniture-list', [SettingsController::class, 'getFurnitureList']);
    Route::get('/settings/furniture-details', [SettingsController::class, 'getFurnitureDetails']);
    Route::get('/settings/company', [SettingsController::class, 'getCompanySettings']);
    Route::post('/settings/company', [SettingsController::class, 'updateCompanySettings']);
    Route::get('/settings/dashboard-stats', [SettingsController::class, 'getDashboardStats']);
});
