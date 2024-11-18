<?php

namespace App\Enums;

enum ProfileTypesEnum: string
{
    case OWNER = 'owner';
    case RENTER = 'renter';

    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

    public static function names(): array
    {
        return array_map(fn($case) => $case->name, self::cases());
    }

    public static function array(): array
    {
        return array_combine(self::names(), self::values());
    }
}
