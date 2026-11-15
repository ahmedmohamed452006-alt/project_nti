<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EngineerProfile;
use Illuminate\Http\Request;

class EngineerController extends Controller
{
    /**
     * GET /api/engineers
     * عرض وبحث وفلترة المهندسين
     */
    public function index(Request $request)
    {
        $query = EngineerProfile::with(['user', 'specialty', 'services'])
            ->withCount('services as service_count');

        if ($request->filled('specialty')) {
            $query->whereHas('specialty', function ($q) use ($request) {
                $q->where('slug', $request->specialty);
            });
        }

        if ($request->filled('governorate')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('governorate', $request->governorate);
            });
        }

        if ($request->filled('years')) {
            $query->where('years_experience', '>=', (int) $request->years);
        }

        if ($request->boolean('verified')) {
            $query->where('is_verified', true);
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->filled('q')) {
            $keyword = $request->q;
            $query->where(function ($sub) use ($keyword) {
                $sub->where('bio', 'like', "%{$keyword}%")
                    ->orWhereHas('user', function ($u) use ($keyword) {
                        $u->where('full_name', 'like', "%{$keyword}%")
                          ->orWhere('city', 'like', "%{$keyword}%");
                    });
            });
        }

        if ($request->sort === 'rating') {
            $query->orderByDesc('avg_rating');
        } elseif ($request->sort === 'experience') {
            $query->orderByDesc('years_experience');
        } else {
            $query->orderByDesc('is_featured')->orderByDesc('avg_rating');
        }

        $engineers = $query->get()->map(function ($eng) {
            return [
                'id'               => $eng->id,
                'full_name'        => $eng->user->full_name,
                'specialty'        => $eng->specialty->slug,
                'specialty_ar'     => $eng->specialty->name_ar,
                'governorate'      => $eng->user->governorate,
                'city'             => $eng->user->city,
                'years_experience' => $eng->years_experience,
                'university'       => $eng->university,
                'bio'              => $eng->bio,
                'verified'         => (bool) $eng->is_verified,
                'avg_rating'       => (float) $eng->avg_rating,
                'review_count'     => $eng->review_count,
                'service_count'    => $eng->service_count,
                'photo_url'        => $eng->user->avatar_url ?? 'assets/img/32.jpg',
                'services'         => $eng->services,
            ];
        });

        return response()->json([
            'status'    => 'success',
            'total'     => $engineers->count(),
            'engineers' => $engineers,
        ]);
    }

    /**
     * GET /api/engineers/{id}
     * عرض الملف المهني الكامل للمهندس (الخدمات + سابقة الأعمال + التقييمات)
     */
    public function show($id)
    {
        $eng = EngineerProfile::with(['user', 'specialty', 'services', 'projects', 'reviews'])
            ->findOrFail($id);

        return response()->json([
            'status'   => 'success',
            'engineer' => [
                'id'               => $eng->id,
                'full_name'        => $eng->user->full_name,
                'specialty'        => $eng->specialty->slug,
                'specialty_ar'     => $eng->specialty->name_ar,
                'governorate'      => $eng->user->governorate,
                'city'             => $eng->user->city,
                'years_experience' => $eng->years_experience,
                'university'       => $eng->university,
                'syndicate_number' => $eng->syndicate_number,
                'bio'              => $eng->bio,
                'verified'         => (bool) $eng->is_verified,
                'avg_rating'       => (float) $eng->avg_rating,
                'review_count'     => $eng->review_count,
                'photo_url'        => $eng->user->avatar_url ?? 'assets/img/32.jpg',
                'services'         => $eng->services,
                'projects'         => $eng->projects,
                'reviews'          => $eng->reviews,
            ],
        ]);
    }
}
