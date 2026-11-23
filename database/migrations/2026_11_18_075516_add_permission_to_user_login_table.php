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
        Schema::table('user_login', function (Blueprint $table) {
            $table->enum('permission', ['admin' , 'batching'])->default('batching');
            $table->enum('status', ['requesting' , 'approved','rejected', 'inactive'])->default('requesting');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_login', function (Blueprint $table) {
            $table->dropColumn(['permission', 'status']);
        });
    }
};
