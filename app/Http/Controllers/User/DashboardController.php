<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $user = Auth::user();
        $appointments = $user->appointments()->latest()->get();

        return Inertia::render('user/dashboard', [
            'appointments' => $appointments,
            'auth' => ['user' => $user],
        ]);
    }
}
