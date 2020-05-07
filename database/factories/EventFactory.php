<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Model;
use App\Event;
use Faker\Generator as Faker;

$factory->define(Event::class, function (Faker $faker) {
    $register_user_id = $faker->numberBetween(1, 100);

    return [
      'register_user_id'     => $register_user_id,
      'event_name'           => $faker->word,
      'event_details'        => $faker->realText(20),
      'event_reference_url'  => $faker->url,
      'event_type'           => $faker->numberBetween(1, 2),
      'event_closing_day'    => $faker->dateTimeBetween($startDate = 'now', $endDate = '+1 month', $timezone = null),
      'event_displaying_day' => $faker->dateTimeBetween($startDate = 'now', $endDate = '+1 month', $timezone = null),
    ];
});
