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
        Schema::table('production_order_list', function (Blueprint $table) {
            $table->double('Copper_1')->nullable();
            $table->double('Copper_2')->nullable();
            $table->double('Quantity')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('production_order_list', function (Blueprint $table) {
            $table->dropColumn(['Quantity' , 'Copper_1' , 'Copper_2']);
        });
    }
};
