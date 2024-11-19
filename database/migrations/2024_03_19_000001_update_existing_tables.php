<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Update profiles table to have composite unique index
        try {
            Schema::table('profiles', function (Blueprint $table) {
                // Check if the old unique index exists
                $sm = Schema::getConnection()->getDoctrineSchemaManager();
                $indexes = $sm->listTableIndexes('profiles');

                if (isset($indexes['profiles_phone_unique'])) {
                    $table->dropUnique('profiles_phone_unique');
                }

                if (!isset($indexes['profiles_phone_type_unique'])) {
                    $table->unique(['phone', 'type'], 'profiles_phone_type_unique');
                }
            });
        } catch (\Exception $e) {
            \Log::error('Failed to update profiles table:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        // Update properties table if needed
        if (!Schema::hasTable('properties')) {
            Schema::create('properties', function (Blueprint $table) {
                $table->id();
                $table->foreignId('owner_id')->constrained('profiles')->onDelete('cascade');
                $table->string('title');
                $table->text('description');
                $table->enum('type', ['apartment', 'villa', 'floor', 'office'])->default('apartment');
                $table->double('price');
                $table->integer('bedrooms');
                $table->integer('bathrooms');
                $table->integer('area');
                $table->string('location');
                $table->date('year_built');
                $table->integer('year');
                $table->enum('furnished', ['furnished', 'unfurnished'])->default('furnished');
                $table->enum('booking_status', ['booked', 'unbooked'])->default('unbooked');
                $table->timestamps();
            });
        }

        // Update personal_access_tokens table if needed
        if (!Schema::hasTable('personal_access_tokens')) {
            Schema::create('personal_access_tokens', function (Blueprint $table) {
                $table->id();
                $table->morphs('tokenable');
                $table->string('name');
                $table->string('token', 64)->unique();
                $table->text('abilities')->nullable();
                $table->timestamp('last_used_at')->nullable();
                $table->timestamp('expires_at')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        // Restore original unique index on profiles table
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropUnique('profiles_phone_type_unique');
            $table->unique('phone', 'profiles_phone_unique');
        });
    }
};
