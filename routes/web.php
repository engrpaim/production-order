<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\ProcessOrderController;
use App\Models\MachineAllocation;



Route::get('/production-order', function () {
    return Inertia::render('Main', [
        'appName' => config('app.name'),
    ]);
});

Route::get('/production-order/home', function () {
    return Inertia::render('Main', [
        'appName' => config('app.name'),
    ]);
});

Route::get('/production-order/encode', [ProcessOrderController::class, 'getDailyCheck']);

Route::post('/production-order/encode', [ProcessOrderController::class, 'saveLoading']);

Route::get('/production-order/view', function () {
    return Inertia::render('Main', [
        'appName' => config('app.name'),
    ]);
});



Route::get('/', function () {
    return redirect('/production-order');
});
