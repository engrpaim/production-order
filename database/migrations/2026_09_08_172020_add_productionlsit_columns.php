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
            $table->string('Magnet_Type')->nullable()->default(null);
            $table->string('Basket_Type')->nullable()->default(null);
            $table->string('Nickel_1_2_A')->nullable()->default(null);
            $table->string('Drying_Method')->nullable()->default(null);
            $table->string('Plating_Specs')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('production_order_list', function (Blueprint $table) {
             $table->dropColumn(["Magnet_Type","Basket_Type","Nickel_1_2_A","Drying_Method","Plating_Specs"]);
        });
    }
};
