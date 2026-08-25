<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lot_number', function (Blueprint $table) {
            $table->id();
            $table->string('model');
            $table->string('lot_number');
            $table->double('lot_quantity');
            $table->double('total_batches');
            $table->double('quantity_per_batch');
            $table->string('condition')->nullable();
            $table->string('route_code')->nullable();
            $table->double('excess')->nullable();
            $table->string('remarks')->nullable();
            $table->enum('status',['batching','id','production','done']);
            $table->string('ip_address');
            $table->timestamps();
            $table->unique(['id', 'lot_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lot_number');
    }
};
