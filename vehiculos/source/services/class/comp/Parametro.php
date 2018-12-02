<?php

class class_Parametro
{
	protected $mysqli;
	
	function __construct() {
		require('Conexion.php');
		
		$aux = new mysqli_driver;
		$aux->report_mode = MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT;
		
		$this->mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
		$this->mysqli->query("SET NAMES 'utf8'");
	}
  
  
  public function method_editar_parametro($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT id_" . $p->tabla . " FROM " . $p->tabla . " WHERE UPPER(descrip)='" . strtoupper($p->model->descrip) . "' AND id_" . $p->tabla . " <> " . $p->model->{"id_" . $p->tabla};
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$error->SetError(0, "duplicado");
		return $error;
	} else {
		$insert_id = $p->model->{"id_" . $p->tabla};
  		
  		if ($insert_id == "0") {
  			$sql = "INSERT " . $p->tabla . " SET descrip='" . $p->model->descrip . "'";
  			$this->mysqli->query($sql);
  			$insert_id = $this->mysqli->insert_id;
  		} else {
			$sql = "UPDATE " . $p->tabla . " SET descrip='" . $p->model->descrip . "' WHERE id_" . $p->tabla . "=" . $p->model->{"id_" . $p->tabla};
			$this->mysqli->query($sql);
  		}
  		
  		return $insert_id;
  	}
  }
  
  
  public function method_leer_parametro($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();

	$sql = "SELECT * FROM " . $p->tabla . " ORDER BY descrip";
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) $resultado[] = $row;
	
	return $resultado;
  }
}

?>