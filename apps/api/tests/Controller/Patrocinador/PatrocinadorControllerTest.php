<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class Patrocinador/PatrocinadorControllerTest extends WebTestCase
{
    public function testIndex(): void
    {
        $client = static::createClient();
        $client->request('GET', '/patrocinador/patrocinador');

        self::assertResponseIsSuccessful();
    }
}
