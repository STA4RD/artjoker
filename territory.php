<?php

include_once('./Models/Models.php');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data["territory_id"])) {
    $cities = $territoryModel->select('ter_pid', [$data["territory_id"]]);
    echo json_encode(['cities' => $cities]);
} elseif (isset($data["city_id"])) {
    $district = $territoryModel->select('ter_pid', [$data["city_id"]]);
    if (count($district) > 0) {
        echo json_encode(['districts' => $district]);
    } else {
        echo json_encode(['districts' => 0]);
    }
}