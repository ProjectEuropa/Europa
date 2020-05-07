<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\File;
use Faker\Generator as Faker;

$factory->define(File::class, function (Faker $faker) {
    $upload_user_id = $faker->numberBetween(0, 100);

    return [
      'upload_user_id' => $upload_user_id,
      'upload_owner_name' => $faker->name,
      'file_name' => $faker->toUpper(Str::random(5)).'.che', //大文字英数字5文字のファイル名.che
      'file_comment' => $faker->sentence(3),
      'file_data' => '',
      'upload_type' => ($upload_user_id === 0) ? 2 : 1, 
      'data_type' => $faker->numberBetween(1, 2),
      'delete_password' => Hash::make('hoge'),
    ];
});
