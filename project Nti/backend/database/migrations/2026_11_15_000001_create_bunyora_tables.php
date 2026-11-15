<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for BUNYORA Platform (11 Tables).
     */
    public function up(): void
    {
        Schema::create('specialties', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 60)->unique();
            $table->string('name_ar', 120);
            $table->string('name_en', 120);
            $table->string('icon', 30)->default('◈');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('full_name', 150);
            $table->string('email', 150)->unique();
            $table->string('phone', 30);
            $table->string('password');
            $table->enum('role', ['admin', 'customer', 'engineer', 'worker', 'supplier'])->default('customer');
            $table->string('governorate', 80)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('avatar_url')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'suspended'])->default('approved');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('engineer_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->foreignId('specialty_id')->constrained('specialties')->restrictOnDelete();
            $table->unsignedInteger('years_experience')->default(0);
            $table->string('university', 180)->nullable();
            $table->string('syndicate_number', 60)->nullable();
            $table->string('qualification_doc_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->text('bio')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->decimal('avg_rating', 3, 2)->default(0.00);
            $table->unsignedInteger('review_count')->default(0);
            $table->timestamps();
        });

        Schema::create('engineer_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('engineer_profile_id')->constrained('engineer_profiles')->cascadeOnDelete();
            $table->string('title', 180);
            $table->string('description', 500)->nullable();
            $table->decimal('price', 12, 2)->nullable();
            $table->enum('pricing_type', ['fixed', 'per_meter', 'after_inspection'])->default('fixed');
            $table->timestamps();
        });

        Schema::create('engineer_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('engineer_profile_id')->constrained('engineer_profiles')->cascadeOnDelete();
            $table->string('title', 180);
            $table->string('category', 100)->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('area_sqm')->nullable();
            $table->string('location', 120)->nullable();
            $table->string('image_url')->nullable();
            $table->year('completed_year')->nullable();
            $table->timestamps();
        });

        Schema::create('worker_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('trade', 120);
            $table->string('trade_group', 120);
            $table->string('icon', 30)->default('🧰');
            $table->unsignedInteger('years_experience')->default(1);
            $table->text('summary')->nullable();
            $table->json('tags')->nullable();
            $table->decimal('avg_rating', 3, 2)->default(4.80);
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });

        Schema::create('supplier_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('business_name', 180);
            $table->string('category', 120);
            $table->string('supplier_group', 120);
            $table->string('icon', 30)->default('🏪');
            $table->string('delivery_info', 180)->default('يتوفر توصيل للموقع');
            $table->string('address')->nullable();
            $table->text('summary')->nullable();
            $table->json('tags')->nullable();
            $table->string('commercial_reg_doc')->nullable();
            $table->boolean('is_verified')->default(true);
            $table->timestamps();
        });

        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('specialty_id')->constrained('specialties')->restrictOnDelete();
            $table->foreignId('target_engineer_id')->nullable()->constrained('engineer_profiles')->nullOnDelete();
            $table->string('title', 200);
            $table->string('unit_type', 80)->default('شقة سكنية');
            $table->string('governorate', 80);
            $table->string('city', 100);
            $table->unsignedInteger('area_sqm')->nullable();
            $table->string('budget_range', 100)->default('يحدد بعد المعاينة');
            $table->text('description')->nullable();
            $table->string('customer_name', 150);
            $table->string('customer_phone', 30);
            $table->string('customer_email', 150)->nullable();
            $table->enum('status', ['open', 'offers_received', 'selected', 'in_progress', 'completed', 'cancelled'])->default('open');
            $table->timestamps();
        });

        Schema::create('request_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_id')->constrained('service_requests')->cascadeOnDelete();
            $table->foreignId('engineer_profile_id')->constrained('engineer_profiles')->cascadeOnDelete();
            $table->decimal('offered_price', 12, 2);
            $table->string('duration_text', 80);
            $table->text('proposal_note');
            $table->enum('status', ['pending', 'accepted', 'rejected', 'withdrawn'])->default('pending');
            $table->timestamps();
            $table->unique(['request_id', 'engineer_profile_id']);
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('engineer_profile_id')->constrained('engineer_profiles')->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('request_id')->nullable()->constrained('service_requests')->nullOnDelete();
            $table->string('author_name', 150);
            $table->unsignedTinyInteger('rating')->default(5);
            $table->text('comment');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email', 150)->unique();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('request_offers');
        Schema::dropIfExists('service_requests');
        Schema::dropIfExists('supplier_profiles');
        Schema::dropIfExists('worker_profiles');
        Schema::dropIfExists('engineer_projects');
        Schema::dropIfExists('engineer_services');
        Schema::dropIfExists('engineer_profiles');
        Schema::dropIfExists('users');
        Schema::dropIfExists('specialties');
    }
};
