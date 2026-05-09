<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/password', [AuthController::class, 'updatePassword']);

    Route::get('/users', [UserController::class, 'index']);

    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::get('/messages/{user}', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::post('/messages/attachment', [MessageController::class, 'storeAttachment']);
    Route::get('/messages/attachments/{attachment}/download', [MessageController::class, 'downloadAttachment']);

    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/documents/{document}/download', [DocumentController::class, 'download']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);

    Route::get('/announcements', [\App\Http\Controllers\Api\AdminController::class, 'announcements']);
    Route::post('/announcements/{announcement}/read', [\App\Http\Controllers\Api\AdminController::class, 'markAnnouncementRead']);

    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/users', [\App\Http\Controllers\Api\AdminController::class, 'users']);
        Route::get('/documents', [\App\Http\Controllers\Api\AdminController::class, 'documents']);
        Route::post('/users/{user}/toggle-admin', [\App\Http\Controllers\Api\AdminController::class, 'toggleAdmin']);
        Route::post('/users/{user}/compliance', [\App\Http\Controllers\Api\AdminController::class, 'updateUserCompliance']);
        Route::post('/documents/{document}/compliance', [\App\Http\Controllers\Api\AdminController::class, 'updateDocumentCompliance']);
        Route::post('/announcements', [\App\Http\Controllers\Api\AdminController::class, 'storeAnnouncement']);
        Route::delete('/users/{user}', [\App\Http\Controllers\Api\AdminController::class, 'deleteUser']);
    });
});
