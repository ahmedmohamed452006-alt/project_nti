<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\EngineerController;
use App\Http\Controllers\Api\DirectoryController;
use App\Http\Controllers\Api\ServiceRequestController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| BUNYORA - RESTful API Routes (routes/api.php)
|--------------------------------------------------------------------------
| Base URL: http://localhost/project%20Nti/api
*/

// 1. Public Catalog & Statistics
Route::get('/catalog', [CatalogController::class, 'index']);

// 2. Authentication (Register & Login)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);
});

// 3. Engineers Directory & Profiles
Route::get('/engineers', [EngineerController::class, 'index']);
Route::get('/engineers/{id}', [EngineerController::class, 'show']);

// 4. Workers & Suppliers Directories
Route::get('/workers', [DirectoryController::class, 'workers']);
Route::get('/suppliers', [DirectoryController::class, 'suppliers']);

// 5. Engineering Service Requests & Offers
Route::get('/requests', [ServiceRequestController::class, 'index']);
Route::post('/requests', [ServiceRequestController::class, 'store']);
Route::post('/requests/{id}/offers', [ServiceRequestController::class, 'submitOffer']);
Route::post('/offers/{id}/accept', [ServiceRequestController::class, 'acceptOffer']);

// 6. Admin Approvals & Newsletter
Route::get('/admin/pending-users', [AdminController::class, 'pendingUsers']);
Route::post('/admin/users/{id}/approve', [AdminController::class, 'approveUser']);
Route::post('/newsletter/subscribe', [AdminController::class, 'subscribeNewsletter']);
