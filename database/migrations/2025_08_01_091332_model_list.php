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
        Schema::create('Order_Models', function (Blueprint $table) {
            $table->id();
            $table->string('Model')->nullable();
            $table->string('Media_Size')->nullable();
            $table->string('Pre_Treatment')->nullable();
            $table->string('Post_Treatment')->nullable();
            $table->string('Condition_Number')->nullable();
            $table->string('Allowed_Lines')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Order_Models');
    }
};
