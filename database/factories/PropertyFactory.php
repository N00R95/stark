<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Owner;
use App\Models\Property;

class PropertyFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Property::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'owner_id' => Owner::factory(),
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->text(),
            'type' => $this->faker->randomElement(["apartment","villa","floor","office"]),
            'price' => $this->faker->randomFloat(0, 0, 9999999999.),
            'bedrooms' => $this->faker->numberBetween(-10000, 10000),
            'bathrooms' => $this->faker->numberBetween(-10000, 10000),
            'area' => $this->faker->numberBetween(-10000, 10000),
            'location' => $this->faker->word(),
            'year_built' => $this->faker->date(),
            'year' => $this->faker->numberBetween(-10000, 10000),
            'furnished' => $this->faker->randomElement(["furnished","unfurnished"]),
            'booking_status' => $this->faker->randomElement(["booked","unbooked"]),
        ];
    }
}
