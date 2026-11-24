<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\ProcessOrderController;
use App\Models\MachineAllocation;
//default

$renderMain = function (?string $section = null) {
    $ip = request()->ip();

    try {
        $location = MachineAllocation::where('ip_address', $ip)->first();
        if ($location) {
            $location = $location->toArray();
        }
    } catch (\Throwable $e) {
        $location = null;
    }

    return Inertia::render('Main', [
        'appName' => config('app.name'),
        'location' => $location,
        'section' => $section,
    ]);
};

Route::get('/', function () {
    return redirect('/production-order');
});

Route::get('/production-order', function () {
    return redirect('/production-order/home');
});

Route::get('/production-order/home', fn () => $renderMain('home'));
Route::get('/production-order/encode', function () {
    return Inertia::render('Main');
});


Route::post('/production-order/encode', [ProcessOrderController::class, 'saveLoading']);

Route::get('/production-order/view', [ProcessOrderController::class, 'getProductionOrder']);

Route::post('/production-order/admin',[ProcessOrderController::class, 'postAdminHandler' ]);

Route::middleware('auth')->group(function () {
    //Admin routes
    Route::get('/production-order/admin',[ProcessOrderController::class, 'getAdminManagement']);
});

