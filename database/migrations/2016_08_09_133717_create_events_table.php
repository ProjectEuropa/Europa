<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->increments('id');
            $table->string('register_user_id')->nullable();
            $table->string('event_name');
            $table->string('event_details');
            $table->string('event_reference_url')->nullable();
            $table->string('event_type');   //大会:1 その他:2
            $table->timestamp('event_closing_day');
            $table->timestamp('event_displaying_day');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('events');
    }
}
