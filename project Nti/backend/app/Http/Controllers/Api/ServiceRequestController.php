<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use App\Models\RequestOffer;
use App\Models\Specialty;
use Illuminate\Http\Request;

class ServiceRequestController extends Controller
{
    /**
     * GET /api/requests
     * عرض كل طلبات الخدمات الهندسية مع عروض الأسعار المقدمة عليها
     */
    public function index()
    {
        $requests = ServiceRequest::with(['specialty', 'offers.engineer.user', 'offers.engineer.specialty'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($req) {
                return [
                    'id'            => $req->id,
                    'title'         => $req->title,
                    'specialty'     => $req->specialty->slug,
                    'specialty_ar'  => $req->specialty->name_ar,
                    'unit_type'     => $req->unit_type,
                    'governorate'   => $req->governorate,
                    'city'          => $req->city,
                    'area'          => ($req->area_sqm ?? 180) . ' م²',
                    'budget'        => $req->budget_range,
                    'status'        => $req->status,
                    'customer_name' => $req->customer_name,
                    'description'   => $req->description,
                    'created_at'    => optional($req->created_at)->format('Y-m-d'),
                    'offers'        => $req->offers->map(fn($o) => [
                        'id'            => $o->id,
                        'engineer_id'   => $o->engineer_profile_id,
                        'engineer_name' => $o->engineer->user->full_name,
                        'specialty_ar'  => $o->engineer->specialty->name_ar,
                        'price'         => (float) $o->offered_price,
                        'duration'      => $o->duration_text,
                        'note'          => $o->proposal_note,
                        'status'        => $o->status,
                    ]),
                ];
            });

        return response()->json([
            'status'   => 'success',
            'total'    => $requests->count(),
            'requests' => $requests,
        ]);
    }

    /**
     * POST /api/requests
     * إرسال طلب خدمة هندسية جديد (من الفورم متعدد الخطوات)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:200',
            'specialty'      => 'required|string',
            'unit_type'      => 'nullable|string|max:80',
            'governorate'    => 'required|string|max:80',
            'city'           => 'required|string|max:100',
            'area_sqm'       => 'nullable|numeric',
            'budget_range'   => 'nullable|string|max:100',
            'description'    => 'nullable|string',
            'customer_name'  => 'required|string|max:150',
            'customer_phone' => 'required|string|max:30',
            'customer_email' => 'nullable|email|max:150',
        ]);

        $specialty = Specialty::where('slug', $validated['specialty'])->first()
            ?? Specialty::first();

        $serviceRequest = ServiceRequest::create([
            'specialty_id'   => $specialty->id,
            'title'          => $validated['title'],
            'unit_type'      => $validated['unit_type'] ?? 'شقة سكنية',
            'governorate'    => $validated['governorate'],
            'city'           => $validated['city'],
            'area_sqm'       => $validated['area_sqm'] ?? 180,
            'budget_range'   => $validated['budget_range'] ?? 'يحدد بعد المعاينة',
            'description'    => $validated['description'] ?? '',
            'customer_name'  => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_email' => $validated['customer_email'] ?? null,
            'status'         => 'open',
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'تم تسجيل طلب الخدمة الهندسية بنجاح',
            'request' => $serviceRequest,
        ], 201);
    }

    /**
     * POST /api/requests/{id}/offers
     * تقديم عرض سعر من مهندس على طلب عميل
     */
    public function submitOffer(Request $request, $id)
    {
        $validated = $request->validate([
            'engineer_profile_id' => 'required|exists:engineer_profiles,id',
            'offered_price'       => 'required|numeric|min:100',
            'duration_text'       => 'required|string|max:80',
            'proposal_note'       => 'required|string',
        ]);

        $serviceRequest = ServiceRequest::findOrFail($id);

        $offer = RequestOffer::updateOrCreate(
            [
                'request_id'          => $serviceRequest->id,
                'engineer_profile_id' => $validated['engineer_profile_id'],
            ],
            [
                'offered_price' => $validated['offered_price'],
                'duration_text' => $validated['duration_text'],
                'proposal_note' => $validated['proposal_note'],
                'status'        => 'pending',
            ]
        );

        $serviceRequest->update(['status' => 'offers_received']);

        return response()->json([
            'status'  => 'success',
            'message' => 'تم إرسال عرض السعر بنجاح',
            'offer'   => $offer,
        ], 201);
    }

    /**
     * POST /api/offers/{id}/accept
     * قبول عرض سعر من قبل العميل
     */
    public function acceptOffer($id)
    {
        $offer = RequestOffer::findOrFail($id);
        $offer->update(['status' => 'accepted']);

        RequestOffer::where('request_id', $offer->request_id)
            ->where('id', '!=', $offer->id)
            ->update(['status' => 'rejected']);

        ServiceRequest::where('id', $offer->request_id)
            ->update(['status' => 'selected']);

        return response()->json([
            'status'  => 'success',
            'message' => 'تم قبول عرض المهندس واعتماد المشروع بنجاح',
            'offer'   => $offer,
        ]);
    }
}
