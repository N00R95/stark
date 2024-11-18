<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Property::query()
                ->where('booking_status', 'available')
                ->with(['images', 'amenities', 'owner.profile']);

            // Apply filters if they exist
            if ($request->has('type') && $request->type !== 'all') {
                $query->where('type', $request->type);
            }

            if ($request->has('priceRange') && $request->priceRange !== 'all') {
                list($min, $max) = explode('-', $request->priceRange);
                $query->whereBetween('price', [$min, $max]);
            }

            if ($request->has('bedrooms') && $request->bedrooms !== 'all') {
                $query->where('bedrooms', $request->bedrooms);
            }

            if ($request->has('location') && $request->location !== 'all') {
                $query->where('location', $request->location);
            }

            if ($request->has('areaRange') && $request->areaRange !== 'all') {
                list($min, $max) = explode('-', $request->areaRange);
                $query->whereBetween('area', [$min, $max]);
            }

            if ($request->has('amenities') && !empty($request->amenities)) {
                $query->whereHas('amenities', function($q) use ($request) {
                    $q->whereIn('name', $request->amenities);
                });
            }

            $properties = $query->latest()->paginate(12);

            // Add is_saved flag if user is authenticated
            if ($request->user()) {
                $properties->through(function ($property) use ($request) {
                    $property->is_saved = $property->savedBy()->where('user_id', $request->user()->id)->exists();
                    return $property;
                });
            }

            // Ensure we're returning an array of properties in the data field
            return response()->json([
                'success' => true,
                'data' => [
                    'data' => $properties->items(),
                    'current_page' => $properties->currentPage(),
                    'last_page' => $properties->lastPage(),
                    'per_page' => $properties->perPage(),
                    'total' => $properties->total()
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Property fetch failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch properties: ' . $e->getMessage(),
                'data' => [] // Return empty array instead of null
            ], 500);
        }
    }
}
