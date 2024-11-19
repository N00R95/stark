<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\Amenity;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    public function run()
    {
        // Get or create default user
        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Sample User',
                'password' => bcrypt('password123')
            ]
        );

        // Create owner profile
        $owner = Profile::firstOrCreate(
            ['type' => 'owner', 'user_id' => $user->id],
            [
                'full_name' => 'Sample Owner',
                'phone' => '+966500000000',
                'email' => 'user@example.com',
                'type' => 'owner'
            ]
        );

        // Create amenities with categories
        $amenities = [
            'Basic Features' => [
                'Central AC',
                'Parking',
                'Elevator',
                '24/7 Security',
                'Reception'
            ],
            'Comfort & Convenience' => [
                'Furnished',
                'Kitchen Appliances',
                'Private Roof',
                'Storage Room',
                'Driver Room',
                'Maid Room'
            ],
            'Leisure & Recreation' => [
                'Swimming Pool',
                'Gym',
                'Garden',
                'Playground',
                'BBQ Area'
            ],
            'Services & Utilities' => [
                'Internet',
                'Satellite/Cable TV',
                'Intercom',
                'Maintenance',
                'Backup Generator'
            ],
            'Nearby Facilities' => [
                'Mosque',
                'Shopping Centers',
                'Schools',
                'Restaurants',
                'Medical Facilities'
            ]
        ];

        foreach ($amenities as $category => $items) {
            foreach ($items as $item) {
                Amenity::firstOrCreate(['title' => $item]);
            }
        }

        // Property images by type
        $propertyImages = [
            'apartment' => [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'
            ],
            'villa' => [
                'https://images.unsplash.com/photo-1613977257363-707ba9348227',
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'
            ],
            'office' => [
                'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
                'https://images.unsplash.com/photo-1497366216548-37526070297c',
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36'
            ],
            'floor' => [
                'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7',
                'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e',
                'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8'
            ]
        ];

        // Create properties
        $locations = ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina'];
        $types = ['apartment', 'villa', 'floor', 'office'];
        $descriptions = [
            'apartment' => 'Modern apartment featuring contemporary design and premium finishes. Enjoy panoramic city views and state-of-the-art amenities.',
            'villa' => 'Luxurious villa with spacious rooms and elegant architecture. Perfect for families seeking comfort and privacy.',
            'office' => 'Premium office space in a prime location. Ideal for businesses looking for a professional environment.',
            'floor' => 'Entire floor with flexible layout options. Suitable for both residential and commercial use.'
        ];

        for ($i = 0; $i < 12; $i++) {
            $type = $types[array_rand($types)];
            $property = Property::create([
                'owner_id' => $owner->id,
                'title' => 'Luxury ' . ucfirst($type) . ' in ' . $locations[array_rand($locations)],
                'description' => $descriptions[$type],
                'type' => $type,
                'price' => rand(500000, 2000000),
                'bedrooms' => $type === 'office' ? null : rand(2, 6),
                'bathrooms' => rand(2, 4),
                'area' => rand(150, 500),
                'location' => $locations[array_rand($locations)],
                'year_built' => now()->subYears(rand(0, 10))->format('Y-m-d'),
                'year' => now()->year - rand(0, 10),
                'furnished' => rand(0, 1) ? 'furnished' : 'unfurnished',
                'booking_status' => 'unbooked'
            ]);

            // Add relevant images based on property type
            foreach ($propertyImages[$type] as $imageUrl) {
                PropertyImage::create([
                    'property_id' => $property->id,
                    'image' => $imageUrl
                ]);
            }

            // Add relevant amenities based on property type
            $relevantAmenities = [];
            if ($type == 'apartment' || $type == 'villa') {
                $relevantAmenities = array_merge(
                    array_random($amenities['Basic Features'], 3),
                    array_random($amenities['Comfort & Convenience'], 2),
                    array_random($amenities['Leisure & Recreation'], 2),
                    array_random($amenities['Services & Utilities'], 2),
                    array_random($amenities['Nearby Facilities'], 2)
                );
            } else {
                $relevantAmenities = array_merge(
                    array_random($amenities['Basic Features'], 3),
                    array_random($amenities['Services & Utilities'], 3),
                    array_random($amenities['Nearby Facilities'], 2)
                );
            }

            $amenityIds = Amenity::whereIn('title', $relevantAmenities)->pluck('id');
            $property->amenities()->attach($amenityIds);
        }
    }
}

// Helper function to get random array elements
function array_random($array, $count) {
    $keys = array_rand($array, min($count, count($array)));
    $keys = is_array($keys) ? $keys : [$keys];
    $result = [];
    foreach ($keys as $key) {
        $result[] = $array[$key];
    }
    return $result;
}
