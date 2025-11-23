<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VehicleController extends Controller
{
    // List all vehicles with reservations and features
    public function index()
    {
        $vehicles = Vehicle::with(['reservations', 'features'])->get();
        return response()->json($vehicles, 200);
    }

    // Store a new vehicle
    public function store(Request $request)
    {
        $data = $request->validate([
            'brand' => 'required|string',
            'model' => 'required|string',
            'year' => 'required|integer',
            'price_per_day' => 'required|numeric',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'available' => 'nullable',
            'features' => 'nullable|array',
            'features.*' => 'integer|exists:features,id',
        ]);

        $data['available'] = $request->has('available') ? filter_var($request->available, FILTER_VALIDATE_BOOLEAN) : true;

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('vehicles', 'public');
        }

        $vehicle = Vehicle::create($data);

        if (!empty($data['features'])) {
            $vehicle->features()->attach($data['features']);
        }

        $vehicle->load('features');
        $vehicle->image = $vehicle->image ? asset('storage/' . $vehicle->image) : null;

        return response()->json([
            'message' => 'Vehicle created successfully',
            'data' => $vehicle,
        ], 201);
    }

    // Show a single vehicle
    public function show($id)
    {
        $vehicle = Vehicle::with('features')->find($id);

        if (!$vehicle) {
            return response()->json(['message' => 'Vehicle not found'], 404);
        }

        $vehicle->image = $vehicle->image ? asset('storage/' . $vehicle->image) : null;

        return response()->json($vehicle, 200);
    }

    // Update a vehicle
    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json(['message' => 'Vehicle not found'], 404);
        }

        $data = $request->validate([
            'brand' => 'sometimes|required|string',
            'model' => 'sometimes|required|string',
            'year' => 'sometimes|required|integer',
            'price_per_day' => 'sometimes|required|numeric',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'available' => 'nullable',
            'features' => 'nullable|array',
            'features.*' => 'integer|exists:features,id',
        ]);

        if ($request->has('available')) {
            $data['available'] = filter_var($request->available, FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('image')) {
            if ($vehicle->image && Storage::disk('public')->exists($vehicle->image)) {
                Storage::disk('public')->delete($vehicle->image);
            }
            $data['image'] = $request->file('image')->store('vehicles', 'public');
        }

        $vehicle->update($data);

        if (isset($data['features'])) {
            $vehicle->features()->sync($data['features']);
        }

        $vehicle->load('features');
        $vehicle->image = $vehicle->image ? asset('storage/' . $vehicle->image) : null;

        return response()->json([
            'message' => 'Vehicle updated successfully',
            'data' => $vehicle,
        ], 200);
    }

    // Delete a vehicle
    public function destroy($id)
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json(['message' => 'Vehicle not found'], 404);
        }

        if ($vehicle->image && Storage::disk('public')->exists($vehicle->image)) {
            Storage::disk('public')->delete($vehicle->image);
        }

        $vehicle->delete();

        return response()->json(['message' => 'Vehicle deleted successfully'], 200);
    }
}
