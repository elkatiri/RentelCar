<?php

namespace App\Models;
use App\Models\Feature;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand',
        'model',
        'year',
        'price_per_day',
        'description',
        'image',
        'available',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
    public function features()
{
    return $this->belongsToMany(Feature::class);
}

}
