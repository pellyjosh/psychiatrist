<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AppointmentController; // public booking
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\AppointmentController as AdminAppointmentController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\AppointmentController as UserAppointmentController;

Route::get('/', [\App\Http\Controllers\WelcomeController::class, 'index'])->name('home');

// Admin login routes
Route::get('/admin', function () {
    return redirect()->route('admin.login');
});
Route::get('/admin/login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'create'])
    ->middleware('guest')
    ->name('admin.login');

// Public pages
Route::get('/appointments/book', [AppointmentController::class, 'book'])->name('appointments.book');
Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');
Route::post('/appointments/check-returning-client', [AppointmentController::class, 'checkReturningClient'])->name('appointments.check-returning-client');

// Public resources (for unauthenticated users)
Route::get('/resources', [\App\Http\Controllers\User\ResourceController::class, 'index'])->name('public.resources.index');
Route::get('/resources/{resource}', [\App\Http\Controllers\User\ResourceController::class, 'show'])->name('public.resources.show');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // User dashboard & appointments
    Route::get('dashboard', UserDashboardController::class)->name('dashboard');
    Route::resource('user/appointments', UserAppointmentController::class)->only(['index', 'show', 'update'])->names([
        'index' => 'user.appointments.index',
        'show' => 'user.appointments.show',
        'update' => 'user.appointments.update',
    ]);
    Route::patch('user/appointments/{appointment}/cancel', [UserAppointmentController::class, 'cancel'])->name('user.appointments.cancel');
    Route::patch('user/appointments/{appointment}/reschedule', [UserAppointmentController::class, 'reschedule'])->name('user.appointments.reschedule');

    // User resources
    Route::get('user/resources', [\App\Http\Controllers\User\ResourceController::class, 'index'])->name('user.resources.index');
    Route::get('user/resources/{resource}', [\App\Http\Controllers\User\ResourceController::class, 'show'])->name('user.resources.show');

    // Admin area
    Route::middleware('admin')->group(function () {
        Route::get('admin/dashboard', AdminDashboardController::class)->name('admin.dashboard');
        Route::resource('admin/appointments', AdminAppointmentController::class)->names([
            'index' => 'admin.appointments.index',
            'create' => 'admin.appointments.create',
            'store' => 'admin.appointments.store',
            'show' => 'admin.appointments.show',
            'update' => 'admin.appointments.update',
            'destroy' => 'admin.appointments.destroy',
        ]);
        Route::post('admin/appointments/{appointment}/approve', [AdminAppointmentController::class, 'approve'])->name('admin.appointments.approve');
        Route::post('admin/appointments/{appointment}/decline', [AdminAppointmentController::class, 'decline'])->name('admin.appointments.decline');
        Route::get('admin/appointments/trashed', [AdminAppointmentController::class, 'trashed'])->name('admin.appointments.trashed');
        Route::patch('admin/appointments/{id}/restore', [AdminAppointmentController::class, 'restore'])->name('admin.appointments.restore');
        
        // Admin patients management
        Route::get('admin/patients', [\App\Http\Controllers\Admin\PatientController::class, 'index'])->name('admin.patients.index');
        Route::get('admin/patients/{user}', [\App\Http\Controllers\Admin\PatientController::class, 'show'])->name('admin.patients.show');
        
        // Admin resources management
        Route::resource('admin/resources', \App\Http\Controllers\Admin\ResourceController::class)->names([
            'index' => 'admin.resources.index',
            'create' => 'admin.resources.create',
            'store' => 'admin.resources.store',
            'show' => 'admin.resources.show',
            'edit' => 'admin.resources.edit',
            'update' => 'admin.resources.update',
            'destroy' => 'admin.resources.destroy',
        ]);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
