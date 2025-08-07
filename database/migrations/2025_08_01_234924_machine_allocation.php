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
        Schema::create('machine_allocation', function(Blueprint $table){
                $table->id();
                $table->string('user')->nullable()->unique();
                $table->string('id_number')->nullable()->unique();
                $table->string('ip_address')->nullable()->unique();
                $table->enum('permission',['loading','unloading','view'])->default('view');
                $table->string('location')->nullable();
                $table->string('line')->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
           });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
      Schema::dropIfExists('machine_allocation');
    }
};
