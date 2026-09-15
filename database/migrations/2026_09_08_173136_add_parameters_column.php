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
        Schema::table('parameters', function (Blueprint $table) {
            $table->enum('type',[
                                    'Media Size', 
                                    'Pre-treatment' , 
                                    'Post-treatment'  , 
                                    'Condition Number' ,
                                    'Nickel 1',
                                    'Nickel 2',
                                    'Copper 1',
                                    'Copper 2',
                                    'Poly Bag',
                                    'Basket Number',
                                    'Container',
                                    'Endorsement',
                                    "Magnet Type",
                                    "Basket Type",
                                    "Nickel_1_2_A",
                                    "Drying Method",
                                    "Plating Specs"
                                ])->change();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('parameters', function (Blueprint $table) {
            $table->enum('type',[
                                    'Media Size', 
                                    'Pre-treatment' , 
                                    'Post-treatment'  , 
                                    'Condition Number' ,
                                    'Nickel 1','Nickel 2',
                                    'Copper 1','Copper 2',
                                    'Poly Bag',
                                    'Basket Number',
                                    'Container',
                                    'Endorsement',
                                    "Magnet Type",
                                    "Basket Type",
                                    "Nickel_1_2_A",
                                    "Drying Method",
                                    "Plating Specs"
                                ])->change();
        });
    }
};
