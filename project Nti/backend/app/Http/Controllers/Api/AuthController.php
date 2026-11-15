<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EngineerProfile;
use App\Models\WorkerProfile;
use App\Models\SupplierProfile;
use App\Models\Specialty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /**
     * POST /api/auth/register
     * تسجيل حساب جديد (عميل / مهندس / صنايعي / محل ومورد)
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'full_name'   => 'required|string|max:150',
            'email'       => 'required|email|unique:users,email',
            'phone'       => 'required|string|max:30',
            'password'    => 'required|string|min:6',
            'role'        => 'required|in:customer,engineer,worker,supplier',
            'governorate' => 'nullable|string|max:80',
            'city'        => 'nullable|string|max:100',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            $status = $validated['role'] === 'customer' ? 'approved' : 'pending';

            $user = User::create([
                'full_name'   => $validated['full_name'],
                'email'       => $validated['email'],
                'phone'       => $validated['phone'],
                'password'    => Hash::make($validated['password']),
                'role'        => $validated['role'],
                'governorate' => $validated['governorate'] ?? 'القاهرة',
                'city'        => $validated['city'] ?? '',
                'status'      => $status,
            ]);

            if ($user->role === 'engineer') {
                $specialty = Specialty::where('slug', $request->input('specialty', 'architecture'))->first()
                    ?? Specialty::first();

                EngineerProfile::create([
                    'user_id'          => $user->id,
                    'specialty_id'     => $specialty->id,
                    'years_experience' => (int) $request->input('years_experience', 1),
                    'university'       => $request->input('university', 'كلية الهندسة'),
                    'syndicate_number' => $request->input('syndicate_number'),
                    'bio'              => $request->input('bio', 'مهندس مسجل على منصة BUNYORA.'),
                    'is_verified'      => false,
                ]);
            } elseif ($user->role === 'worker') {
                WorkerProfile::create([
                    'user_id'          => $user->id,
                    'trade'            => $request->input('trade', 'فني تشطيبات'),
                    'trade_group'      => $request->input('trade_group', 'تشطيبات عامة'),
                    'years_experience' => (int) $request->input('years_experience', 3),
                    'summary'          => $request->input('summary', ''),
                    'tags'             => $request->input('tags', ['تشطيبات', 'تأسيس']),
                ]);
            } elseif ($user->role === 'supplier') {
                SupplierProfile::create([
                    'user_id'       => $user->id,
                    'business_name' => $request->input('business_name', $user->full_name),
                    'category'      => $request->input('category', 'خامات ومواد بناء'),
                    'supplier_group'=> $request->input('supplier_group', 'مواد بناء أساسية'),
                    'summary'       => $request->input('summary', ''),
                    'tags'          => $request->input('tags', ['توريد للموقع']),
                ]);
            }

            $token = $user->createToken('bunyora-api-token')->plainTextToken;

            return response()->json([
                'status'  => 'success',
                'message' => 'تم إنشاء الحساب بنجاح على منصة BUNYORA',
                'token'   => $token,
                'user'    => $user->load(['engineerProfile', 'workerProfile', 'supplierProfile']),
            ], 201);
        });
    }

    /**
     * POST /api/auth/login
     * تسجيل الدخول وإصدار Sanctum Bearer Token
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
            ], 401);
        }

        $token = $user->createToken('bunyora-api-token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'تم تسجيل الدخول بنجاح',
            'token'   => $token,
            'user'    => $user->load(['engineerProfile', 'workerProfile', 'supplierProfile']),
        ]);
    }

    /**
     * GET /api/auth/me
     */
    public function me(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'user'   => $request->user()->load(['engineerProfile', 'workerProfile', 'supplierProfile']),
        ]);
    }
}
