<?php

namespace App;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class File extends Model
{
    use HasFactory;

    protected $table = "files";

    /**
     * Disable mass-assignment protection
     */
    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = ['file_data'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'file_data' => 'binary',
    ];

    public function createdAt(): Attribute
    {
        return new Attribute(
            get:fn($value) => Carbon::parse($value)->timezone('Asia/Tokyo')->format('Y-m-d H:i')
        );
    }

    public function downloadableAt(): Attribute
    {
        return new Attribute(
            get: function ($value) {
                if ($value === null) {
                    return null;
                }
                return Carbon::parse($value)->timezone('Asia/Tokyo')->format('Y-m-d H:i');
            }
        );
    }

    /**
     * Scope to filter by keyword including masked comments
     */
    public function scopeWithKeyword(Builder $query, string $keyword): Builder
    {
        return $query->where(function ($q) use ($keyword) {
            $q->where('upload_owner_name', 'LIKE', "%{$keyword}%")
              ->orWhere('file_name', 'LIKE', "%{$keyword}%")
              ->orWhere('search_tag1', 'LIKE', "%{$keyword}%")
              ->orWhere('search_tag2', 'LIKE', "%{$keyword}%")
              ->orWhere('search_tag3', 'LIKE', "%{$keyword}%")
              ->orWhere('search_tag4', 'LIKE', "%{$keyword}%");
        })->orWhere(function ($q) use ($keyword) {
            $q->where(function ($c) {
                $c->whereNull('downloadable_at')
                  ->orWhere('downloadable_at', '<=', now());
            })->where('file_comment', 'LIKE', "%{$keyword}%");
        });
    }

    /**
     * Accessor for masked comment
     */
    public function getMaskedCommentAttribute(): string
    {
        if ($this->downloadable_at && now()->lt($this->downloadable_at)) {
            return 'ダウンロード可能日時が過ぎていないためコメントは非表示です';
        }
        return $this->file_comment;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'upload_user_id');
    }

    /**
     * Prepare the model for Livewire serialization.
     * This method is called when the model is being converted to an array or JSON.
     *
     * @return array
     */
    public function toLivewire()
    {
        // Create a copy of the model's attributes without file_data
        $attributes = $this->attributesToArray();
        unset($attributes['file_data']);

        return $attributes;
    }

    /**
     * Hydrate the model from Livewire data.
     * This method is called when the model is being hydrated from Livewire data.
     *
     * @param array $value
     * @return static
     */
    public static function fromLivewire($value)
    {
        // If we're creating a new instance from Livewire data,
        // we need to make sure we don't try to set file_data
        // from the Livewire data
        return static::find($value['id'] ?? null);
    }
}
