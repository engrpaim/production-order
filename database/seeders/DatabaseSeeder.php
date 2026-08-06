<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\OrderModelList;
use App\Models\Parameters;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        OrderModelList::factory()->count(1000)->create();
        Parameters::factory()->count(1000)->create();
        
    }

   
}
