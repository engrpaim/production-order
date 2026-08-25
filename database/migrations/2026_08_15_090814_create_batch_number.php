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
        Schema::create('batch_number', function (Blueprint $table) {

            $table->unsignedBigInteger('data_id');
            $table->string('data_lot_number');
            $table->string('model');
            $table->string('generated_batch_number')->unique();
            $table->string('quantity');
            $table->string('work_order_id')->unique()->nullable();
            $table->string('route_code')->nullable();
            $table->string('condition')->nullable();
            $table->string('remarks')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();

            $table->index(['data_id']);

            //Composite Foreign Key
            $table->foreign(['data_id'])
                  ->references(['id'])
                  ->on('lot_number')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batch_number');
    }
};
