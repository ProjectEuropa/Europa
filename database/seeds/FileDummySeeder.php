<?php

use Illuminate\Database\Seeder;

class FileDummySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      App\File::truncate();
      factory(App\File::class, 50)->create([
        'delete_password' => 'hoge'
      ]);
    }
}
