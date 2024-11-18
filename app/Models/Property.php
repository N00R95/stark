<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Property extends Model
{
    protected $fillable = [
        'owner_id',
        'title',
        'description',
        'type',
        'price',
        'location',
        'bedrooms',
        'bathrooms',
        'area',
        'status'
    ];

    protected $with = ['images', 'amenities'];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'owner_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class);
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class);
    }
}
