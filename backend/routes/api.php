<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Autenticacao
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });
});

// Usuarios
Route::get('users/{id}', [UserController::class, 'show']);
Route::get('users/{id}/reviews', [UserController::class, 'reviews']);
Route::middleware('auth:sanctum')->group(function () {
    Route::put('users/profile', [UserController::class, 'updateProfile']);
});
