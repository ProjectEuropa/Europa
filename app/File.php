<?php

namespace App;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class File extends Model
{
    protected $table = "files";

    public function createdAt(): Attribute
    {
        return new Attribute(
            get: fn ($value) => Carbon::parse($value)->timezone('Asia/Tokyo')->format('Y-m-d H:i')
        );
    }
}
