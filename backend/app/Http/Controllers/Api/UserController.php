<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show(string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        return response()->json(['data' => $user]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'avatar' => ['sometimes', 'nullable', 'string', 'max:2048'],
            'gender' => ['sometimes', 'nullable', 'in:male,female,other'],
        ]);

        $user->update($data);

        return response()->json(['data' => $user->fresh()]);
    }

    public function reviews(string $id): JsonResponse
    {
        $reviews = Review::with('reviewer:id,name,avatar')
            ->where('reviewed_id', $id)
            ->latest()
            ->get();

        return response()->json(['data' => $reviews]);
    }
}
