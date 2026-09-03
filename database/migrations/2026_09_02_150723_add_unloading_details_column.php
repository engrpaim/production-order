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
            $table->string('container')->nullable();
            $table->string('poly_bag')->nullable();
            $table->string('basket_number')->nullable();
            $table->string('endorsement')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('Order_Models', function (Blueprint $table) {
            $table->dropColumn(['container', 'poly_bag', 'basket_number','endorsement']);
        });
    }
};
