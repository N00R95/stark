<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Drop the existing unique index on phone
            $table->dropUnique('profiles_phone_unique');

            // Add a new composite unique index on phone and type
            $table->unique(['phone', 'type'], 'profiles_phone_type_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Drop the composite unique index
            $table->dropUnique('profiles_phone_type_unique');

            // Restore single column unique index
            $table->unique('phone', 'profiles_phone_unique');
        });
    }
};
