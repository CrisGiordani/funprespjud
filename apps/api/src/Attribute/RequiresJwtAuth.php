<?php

namespace App\Attribute;

#[\Attribute(\Attribute::TARGET_CLASS | \Attribute::TARGET_METHOD)]
class RequiresJwtAuth
{
    public function __construct(
        public bool $required = true,
        public array $roles = []
    ) {
    }
}
