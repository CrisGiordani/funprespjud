#!/bin/bash

# Format all PHP files in the project
./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.php --verbose
