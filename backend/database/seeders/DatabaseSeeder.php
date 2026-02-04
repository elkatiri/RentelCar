<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\Feature;
use App\Models\Reservation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Create test users
        User::create([
            'name' => 'John Host',
            'email' => 'host@example.com',
            'password' => Hash::make('password123'),
            'role' => 'host',
        ]);

        User::create([
            'name' => 'Jane Customer',
            'email' => 'customer@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
        ]);

        // Create features
        $featuresData = [
            ['name' => 'GPS Navigation'],
            ['name' => 'Air Conditioning'],
            ['name' => 'Bluetooth'],
            ['name' => 'Backup Camera'],
            ['name' => 'Cruise Control'],
            ['name' => 'All-Wheel Drive'],
        ];

        $features = collect();
        foreach ($featuresData as $featureData) {
            $features->push(Feature::create($featureData));
        }

        // Create vehicles with images
        $images = [
            'Nc2OiKeWCjTaoaMRIg00fF1BsBXREJKLX2gFvoSY.jpg',
            'Zqd4E9yUSLwk7x5RBt1AdlBjVQ4MCRrJxAvCNo4c.jpg',
            'fhTen4TmyIUhnMRtca0tjkmz66Uix5CxT4s7hj5r.jpg',
            'jBHDkRUKIWj2rRqXZCqQneKvqOPuuxsyeoFXbtuB.jpg',
            't7qrhL4rU6j1oYu675NZ2triTNTP69h9kayZPTMY.jpg',
        ];

        $vehicles = [
            [
                'brand' => 'Mercedes',
                'model' => 'S-Class',
                'year' => 2024,
                'price_per_day' => 250,
                'description' => 'Premium luxury sedan with advanced technology',
                'image' => $images[0],
                'available' => true,
            ],
            [
                'brand' => 'BMW',
                'model' => 'X7',
                'year' => 2023,
                'price_per_day' => 220,
                'description' => 'Spacious luxury SUV perfect for families',
                'image' => $images[1],
                'available' => true,
            ],
            [
                'brand' => 'Porsche',
                'model' => '911 Turbo',
                'year' => 2024,
                'price_per_day' => 350,
                'description' => 'High-performance sports car',
                'image' => $images[2],
                'available' => true,
            ],
            [
                'brand' => 'Range Rover',
                'model' => 'Evoque',
                'year' => 2023,
                'price_per_day' => 180,
                'description' => 'Compact luxury SUV with off-road capability',
                'image' => $images[3],
                'available' => true,
            ],
            [
                'brand' => 'Audi',
                'model' => 'A8',
                'year' => 2023,
                'price_per_day' => 200,
                'description' => 'Elegant luxury sedan with cutting-edge features',
                'image' => $images[4],
                'available' => true,
            ],
        ];

        foreach ($vehicles as $vehicleData) {
            $vehicle = Vehicle::create($vehicleData);
            // Attach random features
            $vehicle->features()->attach(
                $features->random(rand(2, 4))->pluck('id')->toArray()
            );
        }

        // Create sample reservations
        $users = User::where('role', 'user')->get();
        $vehicles = Vehicle::all();

        foreach ($users as $user) {
            Reservation::create([
                'user_id' => $user->id,
                'vehicle_id' => $vehicles->random()->id,
                'start_date' => now()->addDays(5),
                'end_date' => now()->addDays(7),
                'status' => 'pending',
            ]);
        }
    }
}
