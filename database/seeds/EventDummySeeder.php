<?php

use Illuminate\Database\Seeder;

class EventDummySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      App\Event::truncate();
      factory(App\Event::class, 30)->create();
    }
}
