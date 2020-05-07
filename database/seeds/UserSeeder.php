<?php

use Illuminate\Database\Seeder;
use App\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      User::truncate();
      DB::table('users')->insert([
        'name' => 'test',
        'email' => 'test@test.com',
        'password' => Hash::make('testtest'),
      ]);
    }
}
