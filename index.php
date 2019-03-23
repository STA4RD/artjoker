<?php
include_once('./Models/Models.php');

$userModel      = new UserModel();
$territoryModel = new TerritoryModel();

$regions = $territoryModel->select('ter_mask', [1, 2]);

require_once 'view/form.php';
