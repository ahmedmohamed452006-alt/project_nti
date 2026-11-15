<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EngineerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * GET /api/admin/pending-users
     * عرض حسابات المهندسين والصنايعية والموردين التي تنتظر المراجعة
     */
    public function pendingUsers()
    {
        $users = User::with(['engineerProfile.specialty', 'workerProfile', 'supplierProfile'])
            ->where('status', 'pending')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'status' => 'success',
            'total'  => $users->count(),
            'users'  => $users,
        ]);
    }

    /**
     * POST /api/admin/users/{id}/approve
     * اعتماد حساب مهندس أو صنايعي أو مورد وتفعيل شارة التوثيق
     */
    public function approveUser($id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => 'approved']);

        if ($user->role === 'engineer') {
            EngineerProfile::where('user_id', $user->id)->update(['is_verified' => true]);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'تم اعتماد الحساب وتوثيقه بنجاح',
            'user'    => $user,
        ]);
    }

    /**
     * POST /api/newsletter/subscribe
     * الاشتراك في نشرة أسعار الخامات الشهرية
     */
    public function subscribeNewsletter(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:150',
        ]);

        DB::table('newsletter_subscribers')->updateOrInsert(
            ['email' => $validated['email']],
            ['created_at' => now()]
        );

        return response()->json([
            'status'  => 'success',
            'message' => 'تم الاشتراك في نشرة BUNYORA الهندسية بنجاح',
        ]);
    }
}
