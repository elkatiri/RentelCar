<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FeatureController;
use App\Http\Controllers\DashboardController;

// Public auth routes
Route::post('register', [UserManagementController::class, 'register']);
Route::post('login', [UserManagementController::class, 'login']);

// API resources
Route::apiResource('vehicles', VehicleController::class);
Route::apiResource('reservations', ReservationController::class);
Route::apiResource('features', FeatureController::class);
Route::apiResource('users', UserManagementController::class);

// Protected routes (require auth)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [UserManagementController::class, 'logout']);
    Route::get('profile', [UserManagementController::class, 'profile']);
    
    // Dashboard analytics routes
    Route::prefix('dashboard')->group(function () {
        Route::get('overview', [DashboardController::class, 'overview']);
        Route::get('recent-activity', [DashboardController::class, 'recentActivity']);
        Route::get('revenue-analytics', [DashboardController::class, 'revenueAnalytics']);
        Route::get('bookings-by-vehicle', [DashboardController::class, 'bookingsByVehicle']);
        Route::get('reservation-status', [DashboardController::class, 'reservationStatus']);
        Route::get('top-vehicles', [DashboardController::class, 'topVehicles']);
    });
});