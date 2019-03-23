<?php
include_once('./Models/Models.php');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['name']) && isset($data['email']) && isset($data['ter_id'])) {
	$result = $userModel->select('email', $data['email']);

	if ($result->email !== $data['email']) {
		$user = new User($data['name'], $data['email'], $data['ter_id']);
		$userModel->insert($user);
		echo json_encode(['data' => 0]);
	}
	else {
        $userTer = $territoryModel->select('ter_id', [$data["ter_id"]]);

        $existUser = ['name'=>$result->name, 'email'=>$result->email, 'ter_address'=>$userTer[0]->ter_address];

        echo json_encode(['data' => $existUser]);
	}
}

