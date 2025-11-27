<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->string('contract_number')->unique();
            $table->dateTime('contract_date');
            $table->string('from_address');
            $table->string('to_address');
            $table->decimal('distance_km', 10, 2);
            $table->integer('from_floors');
            $table->integer('to_floors');
            $table->enum('price_level', ['medium', 'above', 'high'])->default('medium');
            $table->decimal('total_price', 15, 2)->nullable();
            $table->enum('status', ['draft', 'pending', 'confirmed', 'completed', 'cancelled'])->default('draft');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
