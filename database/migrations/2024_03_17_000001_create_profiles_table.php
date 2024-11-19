<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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

            // Add composite unique index from the start
            $table->unique(['phone', 'type'], 'profiles_phone_type_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
