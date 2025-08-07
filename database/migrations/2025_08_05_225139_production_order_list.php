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
        Schema::create('production_order_list', function (Blueprint $table) {
            $table->id();
            $table->string('Work_Order')->isNotEmpty();
            $table->string('Model_Name')->nullable();
            $table->string('Route_Code')->nullable();
            $table->string('Nickel_1')->nullable();
            $table->string('Nickel_2')->nullable();
            $table->string('Basket_Number')->nullable();
            $table->string('Loader')->nullable();
            $table->timestamp('Loading_time')->nullable();
            $table->string('Unloader')->nullable();
            $table->timestamp('Unloading_time')->nullable();
            $table->string('Endorsed_To')->nullable();
            $table->string('Container')->nullable();
            $table->json('Machine_Details')->nullable();
            $table->json('Model_Details')->nullable();
            $table->json('Daily_Check')->nullable();
            $table->string('PolyBag')->nullable();
            $table->string('CurrentLocation')->nullable();
            $table->string('Remarks')->nullable();
            $table->enum('Status', ['loading', 'loaded', 'unloading', 'unloaded', 'completed'])
                  ->default('loading');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();


            //Indexes
            $table->index(['Status', 'created_at']);
            $table->index(['Work_Order', 'Status']);
            $table->index(['Model_Name', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
