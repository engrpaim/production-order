<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ParametersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'parameter' => fake()->unique()->firstName(),
            'type' => fake()->randomElement([
                                            'Media Size',
                                            'Pre-treatment',
                                            'Post-treatment',
                                            'Model Code',
                                            'Condition Number',
                                            'Nickel 1',
                                            'Nickel 2',
                                            'Poly Bag',
                                            'Basket Number',
                                            'Container',
                                            'Endorsement',
                                        ]),
        ];
    }
}
