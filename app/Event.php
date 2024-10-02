<?php

namespace App;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Event extends Model
{

    use HasFactory;

    /**
     * 日付を変形する属性
     *
     * @var array
     */
    protected $dates = [
        'event_closing_day',
        'event_displaying_day',
    ];

  public function eventClosingDay(): Attribute
  {
    return new Attribute(
      get:fn($value) => Carbon::parse($value)->timezone('Asia/Tokyo')->format('Y-m-d H:i')
    );
  }
}
