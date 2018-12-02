<?php

require("Base.php");

class class_Parametros extends class_Base
{


  public function method_autocompletarTipoReparacion($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT descrip AS label, id_tipo_reparacion AS model FROM tipo_reparacion WHERE descrip LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson($this->mysqli->query($sql));
  }
  
  
  public function method_autocompletarTaller($params, $error) {
  	$p = $params[0];
  	
	if (is_numeric($p->texto)) {
		$sql = "SELECT";
		$sql.= "  razones_sociales.cod_razon_social AS model";
		$sql.= ", CONCAT(proveedores.cuit, ' (', razones_sociales.razon_social, ')') AS label";
		$sql.= ", proveedores.cuit";
		$sql.= ", razones_sociales.razon_social";
		$sql.= " FROM (proveedores INNER JOIN razones_sociales USING(cod_proveedor)) INNER JOIN taller USING(cod_razon_social)";
		$sql.= " WHERE proveedores.cuit LIKE '" . $p->texto . "%'";
		$sql.= " ORDER BY label";
	} else {
		$sql = "SELECT * FROM (";
			$sql.= "(";
				$sql.= "SELECT";
				$sql.= "  razones_sociales.cod_razon_social AS model";
				$sql.= ", CONCAT(razones_sociales.razon_social, ' (', proveedores.cuit, ')') AS label";
				$sql.= ", proveedores.cuit";
				$sql.= ", razones_sociales.razon_social";
				$sql.= " FROM (proveedores INNER JOIN razones_sociales USING(cod_proveedor)) INNER JOIN taller USING(cod_razon_social)";
			$sql.= ") UNION (";
				$sql.= "SELECT";
				$sql.= "  0 AS model";
				$sql.= ", 'Parque Automotor' AS label";
				$sql.= ", '' AS cuit";
				$sql.= ", 'Parque Automotor' AS razon_social";
			$sql.= ")";
		$sql.= ") AS temporal";
		$sql.= " WHERE razon_social LIKE '%" . $p->texto . "%'";
		$sql.= " ORDER BY label";
	}
	
	return $this->toJson($this->mysqli->query($sql));
  }
  
  
  public function method_autocompletarRazonSocial($params, $error) {
  	$p = $params[0];
  	
	if (is_numeric($p->texto)) {
		$sql = "SELECT";
		$sql.= "  razones_sociales.cod_razon_social AS model";
		$sql.= ", CONCAT(proveedores.cuit, ' (', razones_sociales.razon_social, ')') AS label";
		$sql.= ", proveedores.cuit";
		$sql.= ", razones_sociales.razon_social";
		$sql.= " FROM proveedores INNER JOIN razones_sociales USING(cod_proveedor)";
		$sql.= " WHERE proveedores.cuit LIKE '" . $p->texto . "%'";
		$sql.= " ORDER BY label";
	} else {
		$sql = "SELECT";
		$sql.= "  razones_sociales.cod_razon_social AS model";
		$sql.= ", CONCAT(razones_sociales.razon_social, ' (', proveedores.cuit, ')') AS label";
		$sql.= ", proveedores.cuit";
		$sql.= ", razones_sociales.razon_social";
		$sql.= " FROM proveedores INNER JOIN razones_sociales USING(cod_proveedor)";
		$sql.= " WHERE razones_sociales.razon_social LIKE '%" . $p->texto . "%'";
		$sql.= " ORDER BY label";
	}
	
	return $this->toJson($sql);
  }
  
  
  public function method_leer_taller($params, $error) {
	$sql = "SELECT";
	$sql.= "  cod_razon_social";
	$sql.= ", CONCAT(razones_sociales.razon_social, ' (', proveedores.cuit, ')') AS descrip";
	$sql.= " FROM (taller LEFT JOIN razones_sociales USING(cod_razon_social)) LEFT JOIN proveedores USING(cod_proveedor)";
	$sql.= " ORDER BY descrip";
	
	return $this->toJson($sql);
  }
  
  
  public function method_agregar_taller($params, $error) {
  	$p = $params[0];
  	
	$sql = "INSERT taller SET cod_razon_social=" . $p->cod_razon_social;
	$this->mysqli->query($sql);
	
	$this->auditoria($sql, $this->mysqli->insert_id, "insert_taller");
  }
  
  
  public function method_agregar_parque($params, $error) {
  	$p = $params[0];
  	
	$sql = "INSERT parque SET descrip='" . $p->descrip . "', organismo_area_id='" . $p->organismo_area_id . "'";
	$this->mysqli->query($sql);
	$insert_id = $this->mysqli->insert_id;
	
	$this->auditoria($sql, $insert_id, "insert_parque");
	
	return $insert_id;
  }
  
  
  public function method_leer_parque($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();
  	
	$sql = "SELECT * FROM parque ORDER BY descrip";
	
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$sql = "SELECT";
		$sql.= "  CONCAT(_organismos_areas.organismo_area, ' (', CASE WHEN _organismos_areas.organismo_area_tipo_id='E' THEN _departamentos.departamento ELSE _organismos.organismo END, ')') AS label";
		$sql.= " FROM (_organismos_areas INNER JOIN _organismos USING(organismo_id)) LEFT JOIN _departamentos ON _organismos_areas.organismo_areas_id_departamento=_departamentos.codigo_indec";
		$sql.= " WHERE _organismos_areas.organismo_area_id='" . $row->organismo_area_id . "'";
		
		$rsDependencia = $this->mysqli->query($sql);
		if ($rsDependencia->num_rows > 0) {
			$rowDependencia = $rsDependencia->fetch_object();
			$row->dependencia = $rowDependencia->label;
		} else {
			$row->dependencia = "";
		}
		
		$resultado[] = $row;
	}
	
	return $resultado;
  }
}

?>