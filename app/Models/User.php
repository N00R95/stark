<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function profiles()
    {
        return $this->hasMany(Profile::class);
    }

    public function renterProfile()
    {
        return $this->hasOne(Profile::class)->where('type', 'renter');
    }

    public function ownerProfile()
    {
        return $this->hasOne(Profile::class)->where('type', 'owner');
    }

    public function profile()
    {
        // Get the current profile based on requested type
        $type = request()->type ?? request()->route('type') ?? 'renter';
        return $this->hasOne(Profile::class)->where('type', $type);
    }
}
