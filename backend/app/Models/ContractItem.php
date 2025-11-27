<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContractItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'furniture_name',
        'size',
        'quantity',
        'unit_price',
        'montage_price',
        'demontage_price',
        'total_price',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'montage_price' => 'decimal:2',
        'demontage_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }
}
