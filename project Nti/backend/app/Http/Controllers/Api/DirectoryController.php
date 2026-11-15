<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkerProfile;
use App\Models\SupplierProfile;
use Illuminate\Http\Request;

class DirectoryController extends Controller
{
    /**
     * GET /api/workers
     * دليل العمال والصنايعية
     */
    public function workers(Request $request)
    {
        $query = WorkerProfile::with('user');

        if ($request->filled('group') && $request->group !== 'الكل') {
            $query->where('trade_group', $request->group);
        }

        if ($request->filled('q')) {
            $kw = $request->q;
            $query->where(function ($sub) use ($kw) {
                $sub->where('trade', 'like', "%{$kw}%")
                    ->orWhere('summary', 'like', "%{$kw}%")
                    ->orWhereHas('user', fn($u) => $u->where('full_name', 'like', "%{$kw}%")->orWhere('city', 'like', "%{$kw}%"));
            });
        }

        $workers = $query->get()->map(fn($w) => [
            'id'         => $w->id,
            'name'       => $w->user->full_name,
            'trade'      => $w->trade,
            'group'      => $w->trade_group,
            'icon'       => $w->icon,
            'city'       => $w->user->city . '، ' . $w->user->governorate,
            'experience' => $w->years_experience . ' سنوات خبرة',
            'phone'      => $w->user->phone,
            'rating'     => (float) $w->avg_rating,
            'summary'    => $w->summary,
            'tags'       => $w->tags ?? [],
        ]);

        return response()->json([
            'status'  => 'success',
            'total'   => $workers->count(),
            'workers' => $workers,
        ]);
    }

    /**
     * GET /api/suppliers
     * دليل الأدوات والمحلات والموردين
     */
    public function suppliers(Request $request)
    {
        $query = SupplierProfile::with('user');

        if ($request->filled('group') && $request->group !== 'الكل') {
            $query->where('supplier_group', $request->group);
        }

        if ($request->filled('q')) {
            $kw = $request->q;
            $query->where(function ($sub) use ($kw) {
                $sub->where('business_name', 'like', "%{$kw}%")
                    ->orWhere('category', 'like', "%{$kw}%")
                    ->orWhere('summary', 'like', "%{$kw}%");
            });
        }

        $suppliers = $query->get()->map(fn($s) => [
            'id'       => $s->id,
            'name'     => $s->business_name,
            'category' => $s->category,
            'group'    => $s->supplier_group,
            'icon'     => $s->icon,
            'city'     => $s->user->city . '، ' . $s->user->governorate,
            'delivery' => $s->delivery_info,
            'phone'    => $s->user->phone,
            'summary'  => $s->summary,
            'tags'     => $s->tags ?? [],
        ]);

        return response()->json([
            'status'    => 'success',
            'total'     => $suppliers->count(),
            'suppliers' => $suppliers,
        ]);
    }
}
