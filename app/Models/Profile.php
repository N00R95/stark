<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'phone',
        'email',
        'type',
        'business_name',
        'business_license',
        'address'
    ];

    protected $casts = [
        'type' => 'string'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isOwner()
    {
        return $this->type === 'owner';
    }

    public function isRenter()
    {
        return $this->type === 'renter';
    }
}
