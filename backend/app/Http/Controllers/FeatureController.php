<?php

namespace App\Http\Controllers;

use App\Models\Feature;
use Illuminate\Http\Request;

class FeatureController extends Controller
{
    public function index()
    {
        return response()->json(Feature::all(), 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|string']);
        $feature = Feature::create($data);
        return response()->json($feature, 201);
    }

    public function update(Request $request, $id)
    {
        $feature = Feature::findOrFail($id);
        $data = $request->validate(['name' => 'required|string']);
        $feature->update($data);
        return response()->json($feature, 200);
    }

    public function destroy($id)
    {
        $feature = Feature::findOrFail($id);
        $feature->delete();
        return response()->json(['message' => 'Feature deleted successfully'], 200);
    }
}
