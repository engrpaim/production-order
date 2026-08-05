<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderModelList>
 */
class OrderModelListFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Model' => fake()->name(),
            'Media_Size' => fake()->buildingNumber().fake()->buildingNumber(),
            'Pre_Treatment'=> fake()->buildingNumber(),
            'Post_Treatment'=> fake()->buildingNumber(),
            'Condition_Number'=> fake()->buildingNumber(),
            'Allowed_Lines'=> array(fake()->buildingNumber(),fake()->name(),fake()->name()),
            'Ip_Address'=> fake()->buildingNumber(),
            'Author' => fake()->userName(), 
        ];
    }
}

