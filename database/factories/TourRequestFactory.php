<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Owner;
use App\Models\Property;
use App\Models\Renter;
use App\Models\TourRequest;

class TourRequestFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TourRequest::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'owner_id' => Owner::factory(),
            'renter_id' => Renter::factory(),
            'tour_date' => $this->faker->date(),
            'tour_time' => $this->faker->word(),
            'status' => $this->faker->randomElement(["pending","approved","rejected"]),
        ];
    }
}
