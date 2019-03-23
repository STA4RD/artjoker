<?php
class Database
{
    private static $connection;

    private function __construct()
    {
        $dsn = 'mysql:host=localhost;dbname=artjoker';
        $login = 'root';
        $password = 'root';
        $this->connection = new PDO($dsn, $login, $password);
    }

    public static function Connect()
    {
        if (!isset(self::$connection)) {
            self::$connection = new Database;
        }
        return self::$connection;
    }

    private function __wakeup()
    {
    }

    private function __clone()
    {
    }
}

$connect = Database::Connect();
