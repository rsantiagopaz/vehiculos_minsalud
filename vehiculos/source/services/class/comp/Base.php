<?php

class class_Base
{
	protected $mysqli;
	
	function __construct() {
		require('Conexion.php');
		
		set_time_limit(0);
		
		if ( $this->is_session_started() === false ) session_start();
		
		
		if (! isset($_SESSION["vehiculos_LAST_ACTIVITY"])) {
			throw new JsonRpcError("sesion_terminada", 0);
			
		} else {
			$request_time = (int) $_SERVER["REQUEST_TIME"];
			

			if ($_SESSION["cookie_lifetime"] == 0) {
				$timeout_duration = $_SESSION["gc_maxlifetime"] - 60;
			} else if ($_SESSION["cookie_lifetime"] <= $_SESSION["gc_maxlifetime"]) {
				$timeout_duration = $_SESSION["cookie_lifetime"] - 60;
			} else if ($_SESSION["gc_maxlifetime"] <= $_SESSION["cookie_lifetime"]) {
				$timeout_duration = $_SESSION["gc_maxlifetime"] - 60;
			}

			
			$timeout_duration = 60 * 3;
			
			if (($request_time - $_SESSION["vehiculos_LAST_ACTIVITY"]) > $timeout_duration) {
				throw new JsonRpcError("sesion_terminada", 0);
			} else {
				$_SESSION["vehiculos_LAST_ACTIVITY"] = $request_time;
				
				
				
				$aux = new mysqli_driver;
				$aux->report_mode = MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT;
				
				$this->mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
				$this->mysqli->query("SET NAMES 'utf8'");
			}
		}
	}
	
	
  public function toJson($paramet, &$opciones = null) {
	if (is_string($paramet)) {
		$paramet = $this->mysqli->query($paramet);
		if ($this->mysqli->errno > 0) {
			return $this->mysqli->errno . " " . $this->mysqli->error . "\n";
		} else {
			return $this->toJson($paramet, $opciones);
		}
	} else if (is_a($paramet, "MySQLi_Result")) {
		$rows = array();
		if (is_null($opciones)) {
			while ($row = $paramet->fetch_object()) {
				$rows[] = $row;
			}
		} else {
			while ($row = $paramet->fetch_object()) {
				foreach($opciones as $key => $value) {
					if ($value=="int") {
						$row->$key = (int) $row->$key;
					} else if ($value=="float") {
						$row->$key = (float) $row->$key;
					} else if ($value=="bool") {
						$row->$key = (bool) $row->$key;
					} else {
						$resultado = $value($row, $key);
						if (! is_null($resultado)) $row = $resultado;
					}
				}

				$rows[] = $row;
			}
		}
		return $rows;
	}
  }

  
  public function prepararCampos(&$model, $tabla = null) {
  	static $campos = array();
	$set = array();
	$chequear = false;
	if (!is_null($tabla)) {
		$chequear = true;
		if (is_null($campos[$tabla])) {
			$campos[$tabla] = array();
			$rs = $this->mysqli->query("SHOW COLUMNS FROM " . $tabla);
			while ($row = $rs->fetch_assoc()) {
				$campos[$tabla][$row['Field']] = true;
			}
		}
	}
	foreach($model as $key => $value) {
		if ($chequear) {
			if (!is_null($campos[$tabla][$key])) {
				//$set[] = $key . "='" . $value . "'";
				$set[] = $key . "=" . ((is_null($value)) ? "NULL" : "'" . $value . "'");
			}			
		} else {
			//$set[] = $key . "='" . $value . "'";
			$set[] = $key . "=" . ((is_null($value)) ? "NULL" : "'" . $value . "'");
		}
	}
	return implode(", ", $set);
  }
  
  
  public function auditoria($sql_texto, $id, $tag) {
	$sql = "INSERT _auditoria SET fecha=NOW(), sql_texto='" . $this->mysqli->real_escape_string($sql_texto) . "', id='" . $id . "', tag='" . $tag . "', usuario='" . $_SESSION['login']->usuario . "'";
	$this->mysqli->query($sql);
  }
  
  
  public function is_session_started() {
	if ( php_sapi_name() !== 'cli' ) {
		if ( version_compare(phpversion(), '5.4.0', '>=') ) {
			return session_status() === PHP_SESSION_ACTIVE ? true : false;
		} else {
			return session_id() === '' ? false : true;
		}
	}

	return false;
  }
}

?>