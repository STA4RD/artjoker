<?php

//error_reporting(E_ALL);
//ini_set('display_errors', 1);


define('DB_HOST', 'localhost');
define('DB_NAME', 'artjoker');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('DB_CHAR', 'utf8');

class User
{
	public $id = false;//приходит из базы
	public $name;
	public $email;
	public $territory_id;

	public function __construct($name, $email, $territory_id)
	{
		$this->name         = $name;
		$this->email        = $email;
		$this->territory_id = $territory_id;
	}
}

class Territory
{
	public $ter_id = false;//приходит из базы;
	public $ter_pid;
	public $ter_name;
	public $ter_address;
	public $ter_type_id;
	public $ter_level;
	public $ter_mask;
	public $reg_id;

	public function __construct(
		$ter_id,
		$ter_pid,
		$ter_name,
		$ter_address,
		$ter_type_id,
		$ter_level,
		$ter_mask,
		$reg_id
	) {
		$this->ter_id      = $ter_id;
		$this->ter_pid     = $ter_pid;
		$this->ter_name    = $ter_name;
		$this->ter_address = $ter_address;
		$this->ter_type_id = $ter_type_id;
		$this->ter_level   = $ter_level;
		$this->ter_mask    = $ter_mask;
		$this->reg_id      = $reg_id;
	}
}

class AbstractModel
{
	protected $tableName = 'default_table';

	public function __construct()
	{
		$dsn              = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHAR;
		$this->connection = new PDO($dsn, DB_USER, DB_PASS);
	}

	public function insert($data)
	{
		$values        = $this->getValues($data);
		$valuesEncoded = [];
		foreach ($values as $value) {
			$valuesEncoded[] = '?';
		}
		$query     = 'INSERT INTO ' . $this->tableName . '(' . implode(',', $this->fields) . ') VALUES ('
			. implode(',', $valuesEncoded) . ')';
		$statement = $this->connection->prepare($query);
		$statement->execute($values);
	}

	public function select($column, $value)
	{
		$query     = 'SELECT * FROM ' . $this->tableName . ' WHERE ' . $column . ' = ?';
		$statement = $this->connection->prepare($query);
		$statement->execute([$value]);
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}
}

class UserModel extends AbstractModel
{
	protected $fields    = ['name', 'email', 'territory_id'];
	protected $tableName = 'users';

	public function getValues($data)
	{
		return [$data->name, $data->email, $data->territory_id];
	}

	public function select($column, $value)
	{
		parent::select($column, $value);
		$query     = 'SELECT * FROM ' . $this->tableName . ' WHERE ' . $column . ' = ?';
		$statement = $this->connection->prepare($query);
		$statement->execute([$value]);
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		//Возвращает объект класса User
		$user     = new User($result[0]['name'], $result[0]['email'], $result[0]['territory_id']);
		$user->id = $result[0]['id'];
		return $user;

	}
}

class TerritoryModel extends AbstractModel
{
	protected $fields
		                 = [
			'ter_id',
			'ter_pid',
			'ter_name',
			'ter_address',
			'ter_type_id',
			'ter_level',
			'ter_mask',
			'reg_id'
		];
	protected $tableName = 't_koatuu_tree';

	public function select($column, $value)
	{
		parent::select($column, $value);
		$in        = str_repeat('?,', count($value) - 1) . '?';
		$query     = 'SELECT * FROM ' . $this->tableName . ' WHERE ' . $column . ' IN (' . $in . ')';
		$statement = $this->connection->prepare($query);
		$statement->execute($value);
		$results = $statement->fetchAll(PDO::FETCH_ASSOC);
		//Возвращает объект класса Territory
		foreach ($results as $result) {
			$territories[] = new Territory(
				$result['ter_id'],
				$result['ter_pid'],
				$result['ter_name'],
				$result['ter_address'],
				$result['ter_type_id'],
				$result['ter_level'],
				$result['ter_mask'],
				$result['reg_id']
			);
		}
		return $territories;
	}
}

$userModel      = new UserModel();
$territoryModel = new TerritoryModel();