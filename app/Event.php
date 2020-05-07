<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{

    /**
     * 日付を変形する属性
     *
     * @var array
     */
    protected $dates = [
      'event_closing_day',
      'event_displaying_day',
  ];
}
