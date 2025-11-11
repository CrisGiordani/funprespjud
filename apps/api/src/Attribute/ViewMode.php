<?php

namespace App\Attribute;

use Attribute;

#[Attribute(Attribute::TARGET_METHOD)]
class ViewMode
{
    public function __construct(public array $roles = [])
    {
    }
}
