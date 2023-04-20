<?php

namespace Database\Factories;

use App\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{

    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Event::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $register_user_id = $this->faker->numberBetween(1, 100);

        return [
            'register_user_id' => $register_user_id,
            'event_name' => 'test',
            'event_details' => 'test',
            'event_reference_url' => 'test url',
            'event_type' => $this->faker->numberBetween(1, 2),
            'event_closing_day' => now(),
            'event_displaying_day' => now(),
        ];
    }
}
