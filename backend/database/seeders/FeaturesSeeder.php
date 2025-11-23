<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Feature;

class FeaturesSeeder extends Seeder
{
    public function run()
    {
        $features = [
            "4 Seats",
            "Hybrid",
            "Automatic",
            "Manual",
            "Air Conditioning",
            "Leather Seats",
            "Bluetooth",
            "GPS Navigation",
            "Sunroof",
            "All-Wheel Drive",
            "Cruise Control",
            "Heated Seats",
            "Rear Camera"
        ];

        foreach ($features as $feature) {
            Feature::create(['name' => $feature]);
        }
    }
}
