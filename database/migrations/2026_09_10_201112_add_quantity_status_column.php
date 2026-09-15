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
        Schema::table('batch_number', function (Blueprint $table) {
            $table->enum('quantity_status' , ['exact','excess'])->required();
            $table->boolean('inventory_encoding')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('batch_number', function (Blueprint $table) {
            $table->dropColumn(['quantity_status' , 'inventory_encoding']);
        });
    }
};
