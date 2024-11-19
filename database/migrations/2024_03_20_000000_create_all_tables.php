<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add this before other tables
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        // Users table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        // Profiles table
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('full_name');
            $table->string('phone');
            $table->string('email');
            $table->enum('type', ['owner', 'renter']);
            $table->string('business_name')->nullable();
            $table->string('business_license')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();

            $table->unique(['phone', 'type']);
            $table->unique(['email', 'type']);
        });

        // Properties table
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('profiles')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->enum('type', ['apartment', 'villa', 'floor', 'office'])->default('apartment');
            $table->double('price');
            $table->integer('bedrooms')->nullable();
            $table->integer('bathrooms');
            $table->integer('area');
            $table->string('location');
            $table->date('year_built');
            $table->integer('year');
            $table->enum('furnished', ['furnished', 'unfurnished'])->default('unfurnished');
            $table->enum('booking_status', ['booked', 'unbooked'])->default('unbooked');
            $table->timestamps();
        });

        // Property Images table
        Schema::create('property_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->string('image');
            $table->timestamps();
        });

        // Amenities table
        Schema::create('amenities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->timestamps();
        });

        // Amenity Property pivot table
        Schema::create('amenity_property', function (Blueprint $table) {
            $table->foreignId('amenity_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->primary(['amenity_id', 'property_id']);
        });

        // Saved Properties pivot table
        Schema::create('saved_properties', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->primary(['user_id', 'property_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('saved_properties');
        Schema::dropIfExists('amenity_property');
        Schema::dropIfExists('amenities');
        Schema::dropIfExists('property_images');
        Schema::dropIfExists('properties');
        Schema::dropIfExists('profiles');
        Schema::dropIfExists('users');
    }
};
