<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'contract_id',
        'title',
        'description',
        'appointment_date',
        'end_date',
        'status',
        'location',
        'notify',
    ];

    protected $casts = [
        'appointment_date' => 'datetime',
        'end_date' => 'datetime',
        'notify' => 'boolean',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }
}
