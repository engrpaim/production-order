<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('excess_database', function (Blueprint $table) {
            $table->id();
            $table->string('model')->required();
            $table->string('lot_number')->required();
            $table->string('generated_lot_number')->required()->unique();
            $table->integer('excess')->required();
            $table->string('merge_to')->nullable()->default(null);
            $table->date('start_date')->useCurrent(); 
            $table->date('merge_date')->nullable()->default(null);
          

            $table->double('retention')
                  ->storedAs('DATEDIFF(merge_date, start_date)')
                  ->nullable();

            $table->string('shelf')->required();
            $table->string('ip_address')->required();
            $table->enum('status',['hold','merge','reject','disposed'])->default('hold');
            $table->timestamps();

            $table->index(['model']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('excess_database');
    }
};
