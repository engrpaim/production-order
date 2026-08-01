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
       Schema::table('Order_models', function(Blueprint $table){
                $table->double('Quantity')->nullable();
                $table->string('Model_Code')->nullable();
           });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       
    }
};
