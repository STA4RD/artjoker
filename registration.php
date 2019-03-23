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
		echo json_encode(['data' => $result]);
	}
}

