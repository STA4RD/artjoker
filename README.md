# artjoker_reg

Для создания базы данных пользователей используйте:

```
CREATE TABLE `artjoker`.`users` ( `id` INT(11) NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `email` VARCHAR(255) NOT NULL , `territory_id` CHAR(10) NOT NULL , PRIMARY KEY (`id`), UNIQUE `email` (`email`)) ENGINE = InnoDB;
```

Работоспособность можно проверить по адресу:
[ТЫЦ!](http://artjoker.gorbanaleksandr.php.a-level.com.ua/)
