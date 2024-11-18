<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PropertyController extends Controller
{
    public function getOwnerProperties(Request $request)
    {
        try {
            $user = $request->user();
            
            // Get owner profile
            $ownerProfile = $user->profiles()
                ->where('type', 'owner')
                ->first();

            if (!$ownerProfile) {
                Log::error('Owner profile not found', [
                    'user_id' => $user->id,
                    'available_profiles' => $user->profiles->pluck('type')
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Owner profile not found'
                ], 404);
            }

            $properties = Property::where('owner_id', $ownerProfile->id)
                ->with(['images', 'amenities'])
                ->orderBy('created_at', 'desc')
                ->get();

            Log::info('Owner properties fetched', [
                'owner_id' => $ownerProfile->id,
                'count' => $properties->count()
            ]);

            return response()->json([
                'success' => true,
                'properties' => $properties
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch owner properties', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $request->user()?->id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch properties: ' . $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $query = Property::query()->with(['images', 'amenities']);

            // Apply filters
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }

            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }

            $properties = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'properties' => $properties
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch properties', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch properties'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $property = Property::with(['images', 'amenities', 'owner.profile'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'property' => $property
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch property details', [
                'error' => $e->getMessage(),
                'property_id' => $id
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