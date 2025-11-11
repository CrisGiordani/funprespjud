<?php

namespace App\Enum\Security;

enum RoleEnum: string
{
    case USER_ADMIN = 'USER_ADMIN';
    case USER_OPERATOR = 'USER_OPERATOR';
    case USER_PARTICIPANT = 'USER_PARTICIPANT';
}
