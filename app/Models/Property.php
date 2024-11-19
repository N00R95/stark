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
        'bedrooms',
        'bathrooms',
        'area',
        'location',
        'year_built',
        'year',
        'furnished',
        'booking_status'
    ];

    protected $with = ['images', 'amenities'];

    protected $casts = [
        'price' => 'float',
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
        'area' => 'integer',
        'year' => 'integer',
        'year_built' => 'date',
    ];

    protected $attributes = [
        'booking_status' => 'unbooked',
        'furnished' => 'unfurnished',
        'bedrooms' => null
    ];

    public function savedBy()
    {
        return $this->belongsToMany(User::class, 'saved_properties');
    }

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
        return $this->belongsToMany(Amenity::class, 'amenity_property', 'property_id', 'amenity_id');
    }
}
