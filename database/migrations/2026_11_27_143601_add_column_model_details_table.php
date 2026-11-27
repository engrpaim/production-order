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
        Schema::table('Order_Models', function (Blueprint $table) {
            $table->string('Copper_1_2')->nullable()->default(null);
            $table->string('Copper_2_2')->nullable()->default(null);
            $table->string('Container_2')->default(null);
            $table->string('Pre_Treatment_2')->default(null);
            $table->string('Basket_Type_2')->default(null);
            $table->string('Nickel_1_2_2')->default(null);
            $table->integer('Quantity_2')->default(null);
            $table->string('Copper_1_3')->nullable()->default(null);
            $table->string('Copper_2_3')->nullable()->default(null);
            $table->string('Container_3')->default(null);
            $table->string('Pre_Treatment_3')->default(null);
            $table->string('Basket_Type_3')->default(null);
            $table->string('Nickel_1_2_3')->default(null);
            $table->integer('Quantity_3')->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_models', function (Blueprint $table) {

        });
    }
};
