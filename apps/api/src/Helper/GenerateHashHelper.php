<?php

namespace App\Helper;

class GenerateHashHelper
{
    /**
     * @param string $data
     *
     * @return string
     */
    public static function generateHash(string $data): string
    {
        return hash('sha256', $data);
    }

    /**
     * @param string $data
     *
     * @return string
     */
    public static function generateHashMd5(string $data): string
    {
        return md5($data);
    }
}
