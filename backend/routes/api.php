<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FeatureController;
Route::apiResource('vehicles', VehicleController::class);
Route::apiResource('reservations', ReservationController::class);
Route::apiResource('features', FeatureController::class);



Route::apiResource('users', UserManagementController::class);
Route::post('register', [UserManagementController::class, 'register']);
Route::post('login', [UserManagementController::class, 'login']);
Route::post('logout', [UserManagementController::class, 'logout'])->middleware('auth:sanctum');