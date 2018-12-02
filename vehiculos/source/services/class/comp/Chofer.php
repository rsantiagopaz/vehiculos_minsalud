<?php
session_start();

require("Base.php");

class class_Chofer extends class_Base
{
  

  public function method_alta_modifica_chofer($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT dni FROM _personal WHERE dni='" . $p->model->dni . "'";
  	$rs = $this->mysqli->query($sql);
  	if ($rs->num_rows == 0) {
  		$error->SetError(0, "personal");
  		return $error;
  	}
  	
  	$sql = "SELECT id_chofer FROM chofer WHERE dni='" . $p->model->dni . "' AND id_chofer <> " . $p->model->id_chofer;
  	$rs = $this->mysqli->query($sql);
  	if ($rs->num_rows > 0) {
  		$error->SetError(0, "dni");
  		return $error;
  	}

  	$sql = "SELECT id_chofer FROM chofer WHERE apenom='" . $p->model->apenom . "' AND id_chofer <> " . $p->model->id_chofer;
  	$rs = $this->mysqli->query($sql);
  	if ($rs->num_rows > 0) {
  		$error->SetError(0, "apenom");
  		return $error;
  	}
  	

	$set = $this->prepararCampos($p->model, "chofer");
		
	if ($p->model->id_chofer == "0") {
		$sql = "INSERT chofer SET " . $set . ", id_parque=" . $_SESSION['parque']->id_parque . ", f_inscripcion=NOW()";
		$this->mysqli->query($sql);
		
		$this->auditoria($sql, $this->mysqli->insert_id, "insert_chofer");
	} else {
		$sql = "UPDATE chofer SET " . $set . " WHERE id_chofer=" . $p->model->id_chofer;
		$this->mysqli->query($sql);
		
		$this->auditoria($sql, $p->model->id_chofer, "update_chofer");
	}
  }
  
  
  public function method_alta_modifica_incidente($params, $error) {
  	$p = $params[0];
  	
  	$p->model->id_usuario = $_SESSION['login']->usuario;
  	
	$set = $this->prepararCampos($p->model, "incidente");
		
	if ($p->model->id_incidente == "0") {
		$sql = "INSERT incidente SET " . $set;
		$this->mysqli->query($sql);
		
		$this->auditoria($sql, $this->mysqli->insert_id, "insert_incidente");
	} else {
		$sql = "UPDATE incidente SET " . $set . " WHERE id_incidente=" . $p->model->id_incidente;
		$this->mysqli->query($sql);
		
		$this->auditoria($sql, $p->model->id_incidente, "update_incidente");
	}
  }
  
  
  public function method_leer_incidentes($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT incidente.*, tipo_incidente.descrip AS tipo_incidente_descrip FROM incidente INNER JOIN tipo_incidente USING(id_tipo_incidente) WHERE id_chofer=" . $p->id_chofer . " ORDER BY fecha DESC";
	return $this->toJson($sql);
  }
  
  
  public function method_leer_tipo_incidente($params, $error) {
	$sql = "SELECT * FROM tipo_incidente ORDER BY descrip";
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarChofer($params, $error) {
  	$p = $params[0];
  	
  	if (is_numeric($p->texto)) {
  		$sql = "SELECT id_chofer AS model, CONCAT(dni, ' - ', apenom) AS label FROM chofer WHERE id_parque=" . $_SESSION['parque']->id_parque . " AND dni LIKE '%" . $p->texto . "%' ORDER BY label";
  	} else {
  		$sql = "SELECT id_chofer AS model, CONCAT(apenom, ' - ', dni) AS label FROM chofer WHERE id_parque=" . $_SESSION['parque']->id_parque . " AND apenom LIKE '%" . $p->texto . "%' ORDER BY label";
  	}
  	
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarChoferCompleto($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();
  	
  	if (is_numeric($p->texto)) {
  		$sql = "SELECT id_chofer AS model, CONCAT(dni, ' - ', apenom) AS label, chofer.* FROM chofer WHERE id_parque=" . $_SESSION['parque']->id_parque . " AND dni LIKE '%" . $p->texto . "%' ORDER BY label";
  	} else {
  		$sql = "SELECT id_chofer AS model, CONCAT(apenom, ' - ', dni) AS label, chofer.* FROM chofer WHERE id_parque=" . $_SESSION['parque']->id_parque . " AND apenom LIKE '%" . $p->texto . "%' ORDER BY label";
  	}
  	
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$rowAux = new stdClass;
		
		$rowAux->model = $row->model;
		$rowAux->label = $row->label;
		
		unset($row->model);
		unset($row->label);
		
		$rowAux->chofer = $row;

		
		$sql = "SELECT";
		$sql.= "  CONCAT(_organismos_areas.organismo_area, ' (', CASE WHEN _organismos_areas.organismo_area_tipo_id='E' THEN _departamentos.departamento ELSE _organismos.organismo END, ')') AS label";
		$sql.= "  , _organismos_areas.organismo_area_id AS model";
		$sql.= " FROM (_organismos_areas INNER JOIN _organismos USING(organismo_id)) LEFT JOIN _departamentos ON _organismos_areas.organismo_areas_id_departamento=_departamentos.codigo_indec";
		$sql.= " WHERE _organismos_areas.organismo_area_id='" . $row->organismo_area_id . "'";
		
		$rsDependencia = $this->mysqli->query($sql);
		if ($rsDependencia->num_rows > 0) $rowAux->cboDependencia = $rsDependencia->fetch_object();

		$row = $rowAux;
		
		$resultado[] = $row;
	}
  	
	return $resultado;
  }
}

?>