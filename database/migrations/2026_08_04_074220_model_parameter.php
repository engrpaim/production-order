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
        Schema::create('parameters',function(Blueprint $table){
            $table->id();
            $table->string('parameter')->nullable()->unique();
            $table->enum('type',['Media Size', 'Pre-treatment' , 'Post-treatment'  , 'Condition Number' ,'Nickel 1','Nickel 2','Poly Bag','Basket Number','Container','Endorsement'])->require();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
       
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::dropIfExists('parameters');
         
    }
};
