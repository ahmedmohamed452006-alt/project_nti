<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Specialty;
use App\Models\EngineerProfile;
use App\Models\WorkerProfile;
use App\Models\SupplierProfile;
use App\Models\ServiceRequest;

class CatalogController extends Controller
{
    /**
     * GET /api/catalog
     * إرجاع التخصصات الهندسية والمحافظات وإحصائيات المنصة
     */
    public function index()
    {
        $categories = Specialty::withCount('engineers as engineer_count')
            ->orderBy('sort_order')
            ->get();

        $governorates = [
            "القاهرة", "الجيزة", "الإسكندرية", "الشرقية", "الدقهلية",
            "القليوبية", "الغربية", "المنوفية", "البحيرة", "بورسعيد",
            "الإسماعيلية", "السويس", "دمياط", "كفر الشيخ", "الفيوم",
            "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان"
        ];

        return response()->json([
            'status'       => 'success',
            'categories'   => $categories,
            'governorates' => $governorates,
            'stats'        => [
                'engineers_count' => EngineerProfile::count(),
                'workers_count'   => WorkerProfile::count(),
                'suppliers_count' => SupplierProfile::count(),
                'requests_count'  => ServiceRequest::count(),
            ],
        ]);
    }
}
