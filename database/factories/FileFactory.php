<?php

namespace Database\Factories;

use App\File;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class FileFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = File::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $upload_user_id = $this->faker->numberBetween(0, 100);

        return [
            'upload_user_id' => $upload_user_id,
            'upload_owner_name' => $this->faker->name,
            'file_name' => $this->faker->toUpper(Str::random(5)).'.CHE', //大文字英数字5文字のファイル名.che
            'file_comment' => 'test',
            'file_data' => '',
            'upload_type' => ($upload_user_id === 0) ? 2 : 1,
            'data_type' => $this->faker->numberBetween(1, 2),
            'delete_password' => 'hoge',
        ];
    }
}
