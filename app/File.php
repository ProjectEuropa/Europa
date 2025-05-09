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
}
