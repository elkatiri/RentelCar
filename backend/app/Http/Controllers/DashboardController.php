<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // Dashboard overview stats
    public function overview()
    {
        $totalRevenue = Reservation::where('status', 'approved')
            ->join('vehicles', 'reservations.vehicle_id', '=', 'vehicles.id')
            ->selectRaw('SUM(vehicles.price_per_day * DATEDIFF(reservations.end_date, reservations.start_date)) as total')
            ->value('total') ?? 0;

        $totalBookings = Reservation::count();
        $totalVehicles = Vehicle::count();
        $activeUsers = User::count();
        $pendingReservations = Reservation::where('status', 'pending')->count();

        return response()->json([
            'revenue' => floatval($totalRevenue),
            'bookings' => $totalBookings,
            'vehicles' => $totalVehicles,
            'users' => $activeUsers,
            'pending_reservations' => $pendingReservations,
        ], 200);
    }

    // Recent activity
    public function recentActivity()
    {
        $reservations = Reservation::with(['user', 'vehicle'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json($reservations, 200);
    }

    // Revenue analytics by date
    public function revenueAnalytics(Request $request)
    {
        $days = $request->query('days', 30);

        $revenue = Reservation::where('status', 'approved')
            ->join('vehicles', 'reservations.vehicle_id', '=', 'vehicles.id')
            ->selectRaw('DATE(reservations.created_at) as date, SUM(vehicles.price_per_day * DATEDIFF(reservations.end_date, reservations.start_date)) as amount')
            ->whereDate('reservations.created_at', '>=', now()->subDays($days))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($revenue, 200);
    }

    // Bookings by vehicle
    public function bookingsByVehicle()
    {
        $data = Reservation::join('vehicles', 'reservations.vehicle_id', '=', 'vehicles.id')
            ->selectRaw('vehicles.brand, vehicles.model, COUNT(*) as count')
            ->groupBy('vehicles.id', 'vehicles.brand', 'vehicles.model')
            ->orderByRaw('count DESC')
            ->get();

        return response()->json($data, 200);
    }

    // Reservation status breakdown
    public function reservationStatus()
    {
        $data = Reservation::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        return response()->json($data, 200);
    }

    // Top vehicles
    public function topVehicles()
    {
        $data = Reservation::join('vehicles', 'reservations.vehicle_id', '=', 'vehicles.id')
            ->selectRaw('vehicles.id, vehicles.brand, vehicles.model, vehicles.price_per_day, COUNT(*) as bookings')
            ->groupBy('vehicles.id', 'vehicles.brand', 'vehicles.model', 'vehicles.price_per_day')
            ->orderByRaw('bookings DESC')
            ->limit(10)
            ->get();

        return response()->json($data, 200);
    }
}
