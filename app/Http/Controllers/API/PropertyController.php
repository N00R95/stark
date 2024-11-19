<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Property::with(['images', 'amenities', 'owner'])
                ->where('booking_status', 'unbooked');  // Only show unbooked properties

            // Apply filters
            if ($request->has('type') && $request->type !== 'all') {
                $query->where('type', $request->type);
            }

            if ($request->has('priceRange') && $request->priceRange !== 'all') {
                list($min, $max) = explode('-', $request->priceRange);
                $query->where('price', '>=', $min)
                      ->where('price', '<=', $max);
            }

            $properties = $query->latest()->get();

            // Transform the properties to include necessary data
            $properties = $properties->map(function ($property) {
                return [
                    'id' => $property->id,
                    'title' => $property->title,
                    'description' => $property->description,
                    'type' => $property->type,
                    'price' => $property->price,
                    'bedrooms' => $property->bedrooms,
                    'bathrooms' => $property->bathrooms,
                    'area' => $property->area,
                    'location' => $property->location,
                    'images' => $property->images->pluck('image'),
                    'amenities' => $property->amenities->map(function ($amenity) {
                        return [
                            'id' => $amenity->id,
                            'title' => $amenity->title
                        ];
                    }),
                    'owner' => [
                        'name' => $property->owner->full_name,
                        'phone' => $property->owner->phone,
                    ],
                    'booking_status' => $property->booking_status,
                    'furnished' => $property->furnished,
                ];
            });

            Log::info('Properties fetched successfully', [
                'count' => $properties->count(),
                'filters' => $request->all()
            ]);

            return response()->json([
                'success' => true,
                'data' => $properties
            ]);

        } catch (\Exception $e) {
            Log::error('Property fetch failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'filters' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch properties: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $property = Property::with(['images', 'amenities', 'owner'])
                ->findOrFail($id);

            // Transform the property data
            $transformedProperty = [
                'id' => $property->id,
                'title' => $property->title,
                'description' => $property->description,
                'type' => $property->type,
                'price' => $property->price,
                'bedrooms' => $property->bedrooms,
                'bathrooms' => $property->bathrooms,
                'area' => $property->area,
                'location' => $property->location,
                'year_built' => $property->year_built,
                'year' => $property->year,
                'furnished' => $property->furnished,
                'booking_status' => $property->booking_status,
                'images' => $property->images->pluck('image'),
                'amenities' => $property->amenities->map(function ($amenity) {
                    return [
                        'id' => $amenity->id,
                        'title' => $amenity->title
                    ];
                }),
                'owner' => [
                    'name' => $property->owner->full_name,
                    'phone' => $property->owner->phone,
                    'email' => $property->owner->email,
                ],
                'created_at' => $property->created_at,
                'updated_at' => $property->updated_at,
            ];

            return response()->json([
                'success' => true,
                'data' => $transformedProperty
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch property details', [
                'error' => $e->getMessage(),
                'property_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Property not found'
            ], 404);
        }
    }

    public function toggleSave(Request $request, $id)
    {
        try {
            $user = $request->user();
            $property = Property::findOrFail($id);

            if ($user->savedProperties()->where('property_id', $id)->exists()) {
                $user->savedProperties()->detach($id);
                $message = 'Property removed from saved list';
            } else {
                $user->savedProperties()->attach($id);
                $message = 'Property saved successfully';
            }

            return response()->json([
                'success' => true,
                'message' => $message
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to toggle save property', [
                'error' => $e->getMessage(),
                'property_id' => $id,
                'user_id' => $request->user()?->id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update saved status'
            ], 500);
        }
    }
}
