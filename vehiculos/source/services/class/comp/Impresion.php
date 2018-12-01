<?php
session_start();

require("Conexion.php");

set_time_limit(0);


$mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
$mysqli->query("SET NAMES 'utf8'");

switch ($_REQUEST['rutina'])
{
	
case "general" : {
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>General</title>
	</head>
	<body>
	<input type="submit" value="Imprimir" onClick="window.print();"/>
	<table border="0" cellpadding="0" cellspacing="0" width="800" align="center">
	<tr><td align="center" colspan="6"><big><b>Parque Automotor</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>Ministerio de Salud</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>ESTADO GENERAL</b></big></td></tr>
	<tr><td align="center" colspan="6"><big><?php echo date("Y-m-d H:i:s"); ?></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big>Ver: <?php
		if (is_numeric($_REQUEST['ver'])) {
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
			$sql.= " WHERE model=" . $_REQUEST['ver'];
			$sql.= " ORDER BY label";
			
			$rs = $mysqli->query($sql);
			$row = $rs->fetch_object();
			echo $row->label;
			
		} else {
			echo $_REQUEST['ver'];
		}
	?></big></td></tr>
	<tr><td>&nbsp;</td></tr>

	
	<?php
	
	$estado = array("E" => "Entrada", "S" => "Salida", "T" => "Taller");
	
	$p = new stdClass;
	$p->ver = $_REQUEST['ver'];
	
	$aux1 = array($p);
	$aux2 = array();
	
	require_once("Vehiculo.php");
	$vehiculo = new class_Vehiculo;
	$resultado = $vehiculo->method_leer_gral($aux1, $aux2);
	
	?>
	<tr><td colspan="20">
	<table border="1" rules="all" cellpadding="5" cellspacing="0" width="100%" align="center">
	<thead>
	<tr><th>Vehículo</th><th>Dependencia</th><th>Entrada</th><th>Salida</th><th>Estado</th><th>Asunto</th><th>Diferido</th></tr>
	</thead>
	<tbody>
	<?php
	
	foreach ($resultado->gral as $item) {
		?>
		<tr>
		<td><?php echo $item->vehiculo; ?></td>
		<td><?php echo $item->dependencia; ?></td>
		<td><?php echo $item->f_ent; ?></td>
		<td><?php echo $item->f_sal; ?></td>
		<td><?php echo $estado[$item->estado]; ?></td>
		<td><?php echo ($item->asunto) ? "En trámite" : ""; ?>&nbsp;</td>
		<td><?php echo ($item->diferido) ? "En trámite" : ""; ?>&nbsp;</td>
		</tr>
		<?php
		
		if ($item->estado == "T") {

			$sql = "SELECT * FROM(";
			$sql.= "(SELECT movimiento.*, razones_sociales.razon_social AS taller FROM movimiento INNER JOIN razones_sociales USING(cod_razon_social))";
			$sql.= " UNION ALL";
			$sql.= "(SELECT movimiento.*, temporal_1.razon_social AS taller FROM movimiento INNER JOIN ";
				$sql.= "(";
				$sql.= "SELECT";
				$sql.= "  0 AS cod_razon_social";
				$sql.= ", 'Parque Automotor' AS razon_social";
				$sql.= ") AS temporal_1";
			$sql.= " USING(cod_razon_social))";
			$sql.= ") AS temporal_2";
			$sql.= " WHERE id_entsal=" . $item->id_entsal . " AND estado='E'";
			$sql.= " ORDER BY f_ent DESC";
			
			
			$rs = $mysqli->query($sql);
			
			?>
			<tr>
			<td colspan="20">
			<table border="0" rules="rows" cellpadding="5" cellspacing="0" width="100%" align="center">
			<?php
			while ($row = $rs->fetch_object()) {
				?>
				<tr>
				<td>&nbsp;</td>
				<td><?php echo "# " . $row->id_movimiento; ?></td>
				<td><?php echo $row->taller; ?></td>
				<td><?php echo $row->f_ent; ?></td>
				<td><?php echo nl2br($row->observa); ?></td>
				<td>&nbsp;</td>
				</tr>
				<?php
			}
			?>
			</table>
			</td>
			</tr>
			<?php
		}
	}
	?>

	</tbody>
	</table>
	</td></tr>
	</table>
	</body>
	</html>
	<?php
	
break;
}



case "gastos" : {
	
	if (! is_null($_REQUEST['cod_up'])) {
		$sql = "SELECT CONCAT(REPLACE(codigo, '-', ''), ' - ', nombre) AS descrip FROM unipresu WHERE cod_up=" . $_REQUEST['cod_up'];
		$rsUnipresu = $mysqli->query($sql);
		$rowUnipresu = $rsUnipresu->fetch_object();
	}
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Gastos</title>
	</head>
	<body>
	<input type="submit" value="Imprimir" onClick="window.print();"/>
	<table border="0" cellpadding="0" cellspacing="0" width="800" align="center">
	<tr><td align="center" colspan="6"><big><b>Parque Automotor</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>Ministerio de Salud</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>LISTADO GASTOS</b></big></td></tr>
	<tr><td align="center" colspan="6"><big><?php echo date("Y-m-d H:i:s"); ?></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big>Período: <?php echo $_REQUEST['desde'] . " / " . $_REQUEST['hasta']; ?></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	
	<?php
	if (! is_null($_REQUEST['cod_up'])) {
		?>
		<tr><td align="center" colspan="10"><big>Unidad presup.: <?php echo $rowUnipresu->descrip; ?></big></td></tr>
		<tr><td>&nbsp;</td></tr>
		<?php
	}
	?>

	<tr><td>&nbsp;</td></tr>
	<tr><td colspan="20">
	<table border="1" rules="all" cellpadding="5" cellspacing="0" width="100%" align="center">
	<thead>
	<tr><th>Vehículo</th><th>#</th><th>Taller</th>
	
	<?php
	if (is_null($_REQUEST['cod_up'])) {
		?>
		<th>Unidad presup.</th>
		<?php
	}
	?>
	
	<th>Salida</th><th>Total</th></tr>
	</thead>
	<tbody>
	<?php
	
	$total = 0;
	
	//$sql = "SELECT movimiento.*, razones_sociales.razon_social AS taller, vehiculo.nro_patente, vehiculo.marca FROM ((movimiento INNER JOIN razones_sociales USING(cod_razon_social)) INNER JOIN entsal USING(id_entsal)) INNER JOIN vehiculo USING(id_vehiculo) WHERE movimiento.estado='S' AND (DATE(movimiento.f_sal) BETWEEN '" . $_REQUEST['desde'] . "' AND '" . $_REQUEST['hasta'] . "')";


	
	$sql = "SELECT * FROM(";
	$sql.= "(SELECT movimiento.*, razones_sociales.razon_social AS taller, entsal.cod_up, vehiculo.nro_patente, vehiculo.marca, CONCAT(REPLACE(unipresu.codigo, '-', ''), ' - ', unipresu.nombre) AS up FROM (((movimiento INNER JOIN razones_sociales USING(cod_razon_social)) INNER JOIN entsal USING(id_entsal)) INNER JOIN vehiculo USING(id_vehiculo)) LEFT JOIN unipresu USING(cod_up))";
	$sql.= " UNION ALL";
	$sql.= "(SELECT movimiento.*, temporal_1.razon_social AS taller, entsal.cod_up, vehiculo.nro_patente, vehiculo.marca, CONCAT(REPLACE(unipresu.codigo, '-', ''), ' - ', unipresu.nombre) AS up FROM (((movimiento INNER JOIN ";
		$sql.= "(";
		$sql.= "SELECT";
		$sql.= "  0 AS cod_razon_social";
		$sql.= ", 'Parque Automotor' AS razon_social";
		$sql.= ") AS temporal_1";
	$sql.= " USING(cod_razon_social)) INNER JOIN entsal USING(id_entsal)) INNER JOIN vehiculo USING(id_vehiculo)) LEFT JOIN unipresu USING(cod_up))";
	$sql.= ") AS temporal_2";
	$sql.= " WHERE estado='S'";
	
	if (! is_null($_REQUEST['cod_up'])) $sql.= " AND cod_up=" . $_REQUEST['cod_up'];
	if (! is_null($_REQUEST['desde'])) $sql.= " AND DATE(f_sal) >= '" . $_REQUEST['desde'] . "'";
	if (! is_null($_REQUEST['hasta'])) $sql.= " AND DATE(f_sal) <= '" . $_REQUEST['hasta'] . "'";
	
	$sql.= " ORDER BY f_ent DESC";
	
	$rs = $mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$row->total = (float) $row->total;
		$total+= $row->total;
		?>
		<tr>
		<td><?php echo $row->nro_patente . "  " . $row->marca; ?></td>
		<td><?php echo $row->id_movimiento; ?></td>
		<td><?php echo $row->taller; ?></td>
		<?php
		if (is_null($_REQUEST['cod_up'])) {
			?>
			<td><?php echo $row->up; ?></td>
			<?php
		}
		?>
		<td><?php echo $row->f_sal; ?></td>
		<td align="right"><?php echo number_format($row->total, 2, ",", "."); ?></td>
		</tr>
		<?php
	}
	?>
	
	<?php
	if (is_null($_REQUEST['cod_up'])) {
		?>
		<tr><td colspan="6" align="right"><?php echo number_format($total, 2, ",", "."); ?></td></tr>
		<?php
	} else {
		?>
		<tr><td colspan="5" align="right"><?php echo number_format($total, 2, ",", "."); ?></td></tr>
		<?php
	}
	?>
	

	</tbody>
	</table>
	</td></tr>
	</table>
	</body>
	</html>
	<?php
	
break;
}


case "incidentes" : {
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Incidentes</title>
	</head>
	<body>
	<input type="submit" value="Imprimir" onClick="window.print();"/>
	<table border="0" cellpadding="0" cellspacing="0" width="800" align="center">
	<tr><td align="center" colspan="6"><big><b>Parque Automotor</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>Ministerio de Salud</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>LISTADO INCIDENTES</b></big></td></tr>
	<tr><td align="center" colspan="6"><big><?php echo date("Y-m-d H:i:s"); ?></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<?php
	if (! is_null($_REQUEST['id_chofer'])) {

	} else if (! is_null($_REQUEST['id_tipo_incidente'])) {
		$sql = "SELECT descrip FROM tipo_incidente WHERE id_tipo_incidente=" . $_REQUEST['id_tipo_incidente'];
		$rsAux = $mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		
		?>
		<tr><td align="center" colspan="10"><big>Tipo incidente: <?php echo $rowAux->descrip; ?></big></td></tr>
		<tr><td>&nbsp;</td></tr>
		<?php
	} else if (! is_null($_REQUEST['organismo_area_id'])) {
		$sql = "SELECT";
		$sql.= "  CONCAT(_organismos_areas.organismo_area, ' (', CASE WHEN _organismos_areas.organismo_area_tipo_id='E' THEN _departamentos.departamento ELSE _organismos.organismo END, ')') AS label";
		$sql.= "  , _organismos_areas.organismo_area_id AS model";
		$sql.= " FROM (_organismos_areas INNER JOIN _organismos USING(organismo_id)) LEFT JOIN _departamentos ON _organismos_areas.organismo_areas_id_departamento=_departamentos.codigo_indec";
		$sql.= " WHERE _organismos_areas.organismo_area_id='" . $_REQUEST['organismo_area_id'] . "'";
		
		$rsAux = $mysqli->query($sql);
		if ($rsAux->num_rows > 0) {
			$rowAux = $rsAux->fetch_object();
			$rowAux = $rowAux->label;
		}
		
		?>
		<tr><td align="center" colspan="10"><big>Dependencia: <?php echo $rowAux; ?></big></td></tr>
		<tr><td>&nbsp;</td></tr>
		<?php
	}
	?>
	<tr><td align="center" colspan="6"><big><?php
		if (! is_null($_REQUEST['desde']) && ! is_null($_REQUEST['hasta'])) {
			echo "Período: " . $_REQUEST['desde'] . " / " . $_REQUEST['hasta'];
		} else if (! is_null($_REQUEST['desde'])) {
			echo "Período: desde " . $_REQUEST['desde'];
		} else if (! is_null($_REQUEST['hasta'])) {
			echo "Período: hasta " . $_REQUEST['hasta'];
		}
	?></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	
	<tr>
	<td colSpan="10">
	<table border="1" cellpadding="5" cellspacing="0" width="100%" align="center">
	<thead>
	<tr><th>Chofer</th><th></th><th>Descripción</th></tr>
	</thead>
	<tbody>

	<?php
	
	
	$sql = "SELECT incidente.*, chofer.apenom, chofer.dni, tipo_incidente.descrip AS tipo_incidente_descrip FROM (incidente INNER JOIN chofer USING(id_chofer)) INNER JOIN tipo_incidente USING(id_tipo_incidente)";
	$sql.= " WHERE TRUE";
	if (! is_null($_REQUEST['id_chofer'])) $sql.= " AND incidente.id_chofer=" . $_REQUEST['id_chofer'];
	if (! is_null($_REQUEST['id_tipo_incidente'])) $sql.= " AND incidente.id_tipo_incidente=" . $_REQUEST['id_tipo_incidente'];
	if (! is_null($_REQUEST['organismo_area_id'])) $sql.= " AND chofer.organismo_area_id='" . $_REQUEST['organismo_area_id'] . "'";
	if (! is_null($_REQUEST['desde'])) $sql.= " AND DATE(fecha) >= '" . $_REQUEST['desde'] . "'";
	if (! is_null($_REQUEST['hasta'])) $sql.= " AND DATE(fecha) <= '" . $_REQUEST['hasta'] . "'";
	$sql.= " ORDER BY fecha DESC, apenom";
	
	
	$rs = $mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		?>
		<tr><td rowSpan="3"><?php echo $row->apenom . " - " . $row->dni; ?></td><td><?php echo $row->fecha; ?></td><td rowSpan="3"><?php echo nl2br($row->descrip); ?></td></tr>
		<tr><td><?php echo $row->tipo_incidente_descrip; ?></td></tr>
		<tr><td><?php echo $row->id_usuario; ?></td></tr>
		<?php
	}
	

	?>
	
	</tbody>
	</table>
	</td>
	</tr>
	

	</table>
	</body>
	</html>
	<?php
	
break;
}



case "choferes" : {
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Choferes</title>
	</head>
	<body>
	<input type="submit" value="Imprimir" onClick="window.print();"/>
	<table border="0" cellpadding="0" cellspacing="0" width="800" align="center">
	<tr><td align="center" colspan="6"><big><b>Parque Automotor</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>Ministerio de Salud</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>LISTADO DE CHOFERES</b></big></td></tr>
	<tr><td align="center" colspan="6"><big><?php echo date("Y-m-d H:i:s"); ?></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<?php
	if (! is_null($_REQUEST['organismo_area_id'])) {
		$sql = "SELECT";
		$sql.= "  CONCAT(_organismos_areas.organismo_area, ' (', CASE WHEN _organismos_areas.organismo_area_tipo_id='E' THEN _departamentos.departamento ELSE _organismos.organismo END, ')') AS label";
		$sql.= "  , _organismos_areas.organismo_area_id AS model";
		$sql.= " FROM (_organismos_areas INNER JOIN _organismos USING(organismo_id)) LEFT JOIN _departamentos ON _organismos_areas.organismo_areas_id_departamento=_departamentos.codigo_indec";
		$sql.= " WHERE _organismos_areas.organismo_area_id='" . $_REQUEST['organismo_area_id'] . "'";
		
		$rsAux = $mysqli->query($sql);
		if ($rsAux->num_rows > 0) {
			$rowAux = $rsAux->fetch_object();
			$rowAux = $rowAux->label;
		}
		
		?>
		<tr><td align="center" colspan="10"><big>Dependencia: <?php echo $rowAux; ?></big></td></tr>
		<tr><td>&nbsp;</td></tr>
		<?php
	}
	?>
	<tr><td>&nbsp;</td></tr>
	
	<tr>
	<td colSpan="10">
	<table border="1" cellpadding="5" cellspacing="0" width="100%" align="center">
	<thead>
	<tr><th>Apellido/Nombre</th><th>DNI</th><th>Dependencia</th><th>Lic.emi.</th><th>Lic.ven.</th><th>Teléfono</th><th>Obs.</th></tr>
	</thead>
	<tbody>

	<?php
	
	
	$sql = "SELECT * FROM chofer";
	$sql.= " WHERE TRUE";
	if (! is_null($_REQUEST['organismo_area_id'])) $sql.= " AND organismo_area_id='" . $_REQUEST['organismo_area_id'] . "'";
	$sql.= " ORDER BY apenom";
	
	
	$rs = $mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		/*
 
		?>
		<tr><td rowSpan="3"><?php echo $row->apenom . " - " . $row->dni; ?></td><td><?php echo $row->fecha; ?></td><td rowSpan="3"><?php echo nl2br($row->descrip); ?></td></tr>
		<tr><td><?php echo $row->tipo_incidente_descrip; ?></td></tr>
		<tr><td><?php echo $row->id_usuario; ?></td></tr>
		<?php

		*/
		
		$sql = "SELECT";
		$sql.= "  CONCAT(_organismos_areas.organismo_area, ' (', CASE WHEN _organismos_areas.organismo_area_tipo_id='E' THEN _departamentos.departamento ELSE _organismos.organismo END, ')') AS label";
		$sql.= "  , _organismos_areas.organismo_area_id AS model";
		$sql.= " FROM (_organismos_areas INNER JOIN _organismos USING(organismo_id)) LEFT JOIN _departamentos ON _organismos_areas.organismo_areas_id_departamento=_departamentos.codigo_indec";
		$sql.= " WHERE _organismos_areas.organismo_area_id='" . $row->organismo_area_id . "'";
		
		$rsAux = $mysqli->query($sql);
		if ($rsAux->num_rows > 0) {
			$rowAux = $rsAux->fetch_object();
			$rowAux = $rowAux->label;
		} else {
			$rowAux = "";
		}
		
		?>
		<tr><td><?php echo $row->apenom; ?></td><td><?php echo $row->dni; ?></td><td><?php echo $rowAux; ?></td><td><?php echo $row->f_emision; ?></td><td><?php echo $row->f_vencimiento; ?></td><td><?php echo $row->telefono; ?></td><td><?php echo $row->observa; ?></td></tr>
		<?php
	}
	

	?>
	
	</tbody>
	</table>
	</td>
	</tr>
	

	</table>
	</body>
	</html>
	<?php
	
break;
}


	
case "historial" : {
	
	$sql = "SELECT * FROM vehiculo WHERE id_vehiculo=" . $_REQUEST['id_vehiculo'];
	$rsVehiculo = $mysqli->query($sql);
	$rowVehiculo = $rsVehiculo->fetch_object();
	
	$sql = "SELECT";
	$sql.= "  CONCAT(_organismos_areas.organismo_area, ' (', CASE WHEN _organismos_areas.organismo_area_tipo_id='E' THEN _departamentos.departamento ELSE _organismos.organismo END, ')') AS label";
	$sql.= " FROM (_organismos_areas INNER JOIN _organismos USING(organismo_id)) LEFT JOIN _departamentos ON _organismos_areas.organismo_areas_id_departamento=_departamentos.codigo_indec";
	$sql.= " WHERE _organismos_areas.organismo_area_id='" . $rowVehiculo->organismo_area_id . "'";
	
	$rsDependencia = $mysqli->query($sql);
	if ($rsDependencia->num_rows > 0) {
		$rowDependencia = $rsDependencia->fetch_object();
		$rowVehiculo->dependencia = $rowDependencia->label;
	} else {
		$rowVehiculo->dependencia = "";
	}
	
	
	?>
	
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Historial</title>
	</head>
	<body>
	<input type="submit" value="Imprimir" onClick="window.print();"/>
	<table border="0" cellpadding="0" cellspacing="0" width="800" align="center">
	<tr><td align="center" colspan="6"><big><b>Parque Automotor</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>Ministerio de Salud</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td><b>Historial Vehiculo: <?php echo $rowVehiculo->nro_patente . "  " . $rowVehiculo->marca; ?></b></td></tr>
	<tr><td colspan="20">Dependencia: <?php echo $rowVehiculo->dependencia; ?></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>Usuario: <?php echo $_SESSION['login']->usuario; ?></td></tr>
	<tr><td>&nbsp;</td></tr>
	
	<?php
	
	$sql = "SELECT * FROM entsal WHERE estado<>'A' AND id_vehiculo=" . $rowVehiculo->id_vehiculo . " ORDER BY f_ent DESC";
	$rsEntsal = $mysqli->query($sql);
	
	while ($rowEntsal = $rsEntsal->fetch_object()) {
		?>
		<tr><td colspan="20"><hr/></td></tr>
		<tr><td>&nbsp;</td></tr>
		<tr><td>&nbsp;</td></tr>
		<tr>
		<td><?php echo "Entrada: " . $rowEntsal->f_ent; ?></td>
		<td><?php echo "Salida: " . $rowEntsal->f_sal; ?></td>
		<td><?php echo "Km: " . number_format($rowEntsal->kilo, 0, ",", "."); ?></td>
		<td align="right"><?php echo "Total: " . number_format($rowEntsal->total, 2, ",", "."); ?></td>
		</tr>
		<?php
		
		//$sql = "SELECT movimiento.*, razones_sociales.razon_social AS taller FROM movimiento INNER JOIN razones_sociales USING(cod_razon_social) WHERE movimiento.estado<>'A' AND id_entsal=" . $rowEntsal->id_entsal . " ORDER BY f_ent DESC";
		
		
		$sql = "SELECT * FROM(";
		$sql.= "(SELECT movimiento.*, razones_sociales.razon_social AS taller FROM movimiento LEFT JOIN razones_sociales USING(cod_razon_social))";
		$sql.= " UNION ALL";
		$sql.= "(SELECT movimiento.*, temporal_1.razon_social AS taller FROM movimiento INNER JOIN ";
			$sql.= "(";
			$sql.= "SELECT";
			$sql.= "  0 AS cod_razon_social";
			$sql.= ", 'Parque Automotor' AS razon_social";
			$sql.= ") AS temporal_1";
		$sql.= " USING(cod_razon_social))";
		$sql.= ") AS temporal_2";
		$sql.= " WHERE estado<>'A' AND id_entsal=" . $rowEntsal->id_entsal;
		$sql.= " ORDER BY f_ent DESC";
		
		
		$rsMovimiento = $mysqli->query($sql);
		
		while ($rowMovimiento = $rsMovimiento->fetch_object()) {
			?>
			<tr><td>&nbsp;</td></tr>
			<tr><td>&nbsp;</td></tr>
			<tr><td colspan="20"><?php echo "# " . $rowMovimiento->id_movimiento . " - " . $rowMovimiento->taller; ?></td></tr>
			<tr>
			<td><?php echo "Entrada: " . $rowMovimiento->f_ent; ?></td>
			<td><?php echo "Salida: " . $rowMovimiento->f_sal; ?></td>
			<td><?php echo "Km: " . number_format($rowMovimiento->kilo, 0, ",", "."); ?></td>
			<td align="right"><?php echo "Total: " . number_format($rowMovimiento->total, 2, ",", "."); ?></td>
			</tr>
			<tr><td>&nbsp;</td></tr>
			<tr><td colspan="20">
			<table border="1" rules="all" cellpadding="1" cellspacing="0" width="100%" align="center">
			<tr><th>Tipo reparación</th><th align="right">Costo</th><th align="right">Cant.</th><th align="right">Total</th></tr>
			<?php
			//$sql = "SELECT * FROM reparacion WHERE id_movimiento=" . $rowMovimiento->id_movimiento;
			$sql = "SELECT reparacion.*, tipo_reparacion.descrip AS tipo_reparacion FROM reparacion INNER JOIN tipo_reparacion USING(id_tipo_reparacion) WHERE id_movimiento=" . $rowMovimiento->id_movimiento;
			$rsReparacion = $mysqli->query($sql);
			
			while ($rowReparacion = $rsReparacion->fetch_object()) {
				?>
				<tr>
				<td><?php echo $rowReparacion->tipo_reparacion; ?></td>
				<td align="right"><?php echo number_format($rowReparacion->costo, 2, ",", "."); ?></td>
				<td align="right"><?php echo $rowReparacion->cantidad; ?></td>
				<td align="right"><?php echo number_format($rowReparacion->total, 2, ",", "."); ?></td>
				</tr>
				<?php
			}
			?>
			</table>
			<?php
		}
		
		?>
		
		<tr><td>&nbsp;</td></tr>
		<tr><td>&nbsp;</td></tr>
		
		<?php
		
	}

	?>

	<tr><td colspan="20"><hr/></td></tr>
	</td></tr>
	</table>
	</body>
	</html>
	<?php
	
break;
}
	
	
case "salida_vehiculo" : {

	$sql = "SELECT * FROM entsal INNER JOIN vehiculo USING(id_vehiculo) WHERE id_entsal=" . $_REQUEST['id_entsal'];
	$rsEntsal = $mysqli->query($sql);
	$rowEntsal = $rsEntsal->fetch_object();
	
	$sql = "SELECT";
	$sql.= "  CONCAT(_organismos_areas.organismo_area, ' (', CASE WHEN _organismos_areas.organismo_area_tipo_id='E' THEN _departamentos.departamento ELSE _organismos.organismo END, ')') AS label";
	$sql.= " FROM (_organismos_areas INNER JOIN _organismos USING(organismo_id)) LEFT JOIN _departamentos ON _organismos_areas.organismo_areas_id_departamento=_departamentos.codigo_indec";
	$sql.= " WHERE _organismos_areas.organismo_area_id='" . $rowEntsal->organismo_area_id . "'";
	
	$rsDependencia = $mysqli->query($sql);
	if ($rsDependencia->num_rows > 0) {
		$rowDependencia = $rsDependencia->fetch_object();
		$rowEntsal->dependencia = $rowDependencia->label;
	} else {
		$rowEntsal->dependencia = "";
	}
	
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Conformidad</title>
	</head>
	<body>
	<input type="submit" value="Imprimir" onClick="window.print();"/>
	<table border="0" cellpadding="0" cellspacing="0" width="800" align="center">
	<tr><td align="center" colspan="6"><big><b>Parque Automotor</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>Ministerio de Salud</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>FORMULARIO DE CONFORMIDAD</b></big></td></tr>
	<tr><td align="center" colspan="6"><big><?php echo date("Y-m-d H:i:s"); ?></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td><b>Vehículo: <?php echo $rowEntsal->nro_patente . "  " . $rowEntsal->marca; ?></b></td><td>Salida: <?php echo $rowEntsal->f_sal; ?></td><td>Km: <?php echo $rowEntsal->kilo; ?></td></tr>
	<tr><td colspan="20">Dependencia: <?php echo $rowEntsal->dependencia; ?></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>Usuario: <?php echo $_SESSION['login']->usuario; ?></td><td>Responsable: <?php echo $rowEntsal->resp_sal; ?></td></tr>
	<tr><td>&nbsp;</td></tr>
	
	<?php
	
	
	//$sql = "SELECT movimiento.*, razones_sociales.razon_social AS taller FROM movimiento INNER JOIN razones_sociales USING(cod_razon_social) WHERE id_entsal=" . $rowEntsal->id_entsal . " ORDER BY f_ent DESC";
	
	
	$sql = "SELECT * FROM(";
	$sql.= "(SELECT movimiento.*, razones_sociales.razon_social AS taller FROM movimiento INNER JOIN razones_sociales USING(cod_razon_social))";
	$sql.= " UNION ALL";
	$sql.= "(SELECT movimiento.*, temporal_1.razon_social AS taller FROM movimiento INNER JOIN ";
		$sql.= "(";
		$sql.= "SELECT";
		$sql.= "  0 AS cod_razon_social";
		$sql.= ", 'Parque Automotor' AS razon_social";
		$sql.= ") AS temporal_1";
	$sql.= " USING(cod_razon_social))";
	$sql.= ") AS temporal_2";

	if (! isset($_REQUEST['id_movimiento'])) {
		$sql.= " WHERE id_entsal=" . $rowEntsal->id_entsal . " AND estado='S'";
	} else {
		$sql.= " WHERE id_movimiento=" . $_REQUEST['id_movimiento'];
	}
	
	$sql.= " ORDER BY f_ent DESC";
	
	
	$rsMovimiento = $mysqli->query($sql);
	
	while ($rowMovimiento = $rsMovimiento->fetch_object()) {
		?>
		<tr><td colspan="2"><?php echo "# " .  $rowMovimiento->id_movimiento . " - " . $rowMovimiento->taller; ?></td><td>Km: <?php echo $rowMovimiento->kilo; ?></td></tr>
		<tr><td colspan="20">
		<table border="1" rules="all" cellpadding="1" cellspacing="0" width="100%" align="center">
		<tr><th>Tipo reparación</th><th>Observaciones</th><th align="right">Costo</th><th align="right">Cant.</th><th align="right">Total</th></tr>
		<?php
		//$sql = "SELECT * FROM reparacion WHERE id_movimiento=" . $rowMovimiento->id_movimiento;
		$sql = "SELECT reparacion.*, tipo_reparacion.descrip AS tipo_reparacion FROM reparacion INNER JOIN tipo_reparacion USING(id_tipo_reparacion) WHERE id_movimiento=" . $rowMovimiento->id_movimiento;
		$rsReparacion = $mysqli->query($sql);
		
		while ($rowReparacion = $rsReparacion->fetch_object()) {
			?>
			<tr>
			<td><?php echo $rowReparacion->tipo_reparacion; ?></td>
			<td><?php echo $rowReparacion->observa; ?></td>
			<td align="right"><?php echo number_format($rowReparacion->costo, 2, ",", "."); ?></td>
			<td align="right"><?php echo $rowReparacion->cantidad; ?></td>
			<td align="right"><?php echo number_format((float) $rowReparacion->total, 2, ",", "."); ?></td>
			</tr>
			<?php
		}
		?>
		<tr>
		<td colspan="5" align="right"><?php echo number_format((float) $rowMovimiento->total, 2, ",", "."); ?></td>
		</tr>
		</table>
		<tr><td>&nbsp;</td></tr>
		<tr><td>&nbsp;</td></tr>
		<tr><td>&nbsp;</td></tr>
		<tr><td>&nbsp;</td></tr>
		<?php
	}
	?>

	<tr><td>&nbsp;</td></tr>
	<tr><td>_____________________________</td><td>_____________________________</td></tr>
	<tr><td>Firma usuario</td><td>Firma responsable dependencia</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>_____________________________</td></tr>
	<tr><td>Firma responsable traslado</td></tr>
	</td></tr>
	</table>
	</body>
	</html>
	<?php
	
break;
}


case "entrada_taller" : {

	$sql = "SELECT * FROM entsal INNER JOIN vehiculo USING(id_vehiculo) WHERE id_entsal=" . $_REQUEST['id_entsal'];
	$rsEntsal = $mysqli->query($sql);
	$rowEntsal = $rsEntsal->fetch_object();
	
	$sql = "SELECT";
	$sql.= "  CONCAT(_organismos_areas.organismo_area, ' (', CASE WHEN _organismos_areas.organismo_area_tipo_id='E' THEN _departamentos.departamento ELSE _organismos.organismo END, ')') AS label";
	$sql.= " FROM (_organismos_areas INNER JOIN _organismos USING(organismo_id)) LEFT JOIN _departamentos ON _organismos_areas.organismo_areas_id_departamento=_departamentos.codigo_indec";
	$sql.= " WHERE _organismos_areas.organismo_area_id='" . $rowEntsal->organismo_area_id . "'";
	
	$rsDependencia = $mysqli->query($sql);
	if ($rsDependencia->num_rows > 0) {
		$rowDependencia = $rsDependencia->fetch_object();
		$rowEntsal->dependencia = $rowDependencia->label;
	} else {
		$rowEntsal->dependencia = "";
	}
	
	//$sql = "SELECT movimiento.*, razones_sociales.razon_social AS taller FROM movimiento INNER JOIN razones_sociales USING(cod_razon_social) WHERE id_movimiento=" . $_REQUEST['id_movimiento'] . " ORDER BY f_ent DESC";
	
	
	$sql = "SELECT * FROM(";
	$sql.= "(SELECT movimiento.*, razones_sociales.razon_social AS taller FROM movimiento INNER JOIN razones_sociales USING(cod_razon_social))";
	$sql.= " UNION ALL";
	$sql.= "(SELECT movimiento.*, temporal_1.razon_social AS taller FROM movimiento INNER JOIN ";
		$sql.= "(";
		$sql.= "SELECT";
		$sql.= "  0 AS cod_razon_social";
		$sql.= ", 'Parque Automotor' AS razon_social";
		$sql.= ") AS temporal_1";
	$sql.= " USING(cod_razon_social))";
	$sql.= ") AS temporal_2";
	$sql.= " WHERE id_movimiento=" . $_REQUEST['id_movimiento'];
	$sql.= " ORDER BY f_ent DESC";
	
	
	$rsMovimiento = $mysqli->query($sql);
	$rowMovimiento = $rsMovimiento->fetch_object();
	
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Orden trabajo</title>
	</head>
	<body>
	<input type="submit" value="Imprimir" onClick="window.print();"/>
	<table border="0" cellpadding="0" cellspacing="0" width="800" align="center">
	<tr><td align="center" colspan="6"><big><b>Parque Automotor</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>Ministerio de Salud</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>ORDEN DE TRABAJO # <?php echo $_REQUEST['id_movimiento']; ?></b></big></td></tr>
	<tr><td align="center" colspan="6"><big><?php echo date("d/m/Y H:i:s"); ?></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td><b>Vehiculo: <?php echo $rowEntsal->nro_patente . "  " . $rowEntsal->marca; ?></b></td><td>Entrada: <?php $aux = new DateTime($rowMovimiento->f_ent); echo $aux->format("d/m/Y H:i:s"); ?></td></tr>
	<tr><td colspan="20">Dependencia: <?php echo $rowEntsal->dependencia; ?></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>Usuario: <?php echo $_SESSION['login']->usuario; ?></td></tr>
	<tr><td>&nbsp;</td></tr>
	
	<?php
	
		?>
		<tr><td colspan="20">Sres.</td></tr>
		<tr><td colspan="20"><?php echo $rowMovimiento->taller; ?></td></tr>
		<tr><td>&nbsp;</td></tr>
		<tr><td colspan="20"><b>Se solicita la ejecución del siguiente trabajo:</b></td></tr>
		<tr><td>&nbsp;</td></tr>
		<tr><td colspan="20"><?php echo nl2br($rowMovimiento->observa); ?></td></tr>
		<tr><td>&nbsp;</td></tr>
		<tr><td>&nbsp;</td></tr>
		<tr><td>&nbsp;</td></tr>
		<tr><td>&nbsp;</td></tr>
		<?php

	?>

	<tr><td>&nbsp;</td></tr>
	<tr><td>_____________________________</td><td>_____________________________</td></tr>
	<tr><td>Firma usuario</td><td>Firma jefe parque automotor</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>_____________________________</td></tr>
	<tr><td>Firma responsable traslado</td></tr>
	</td></tr>
	</table>
	</body>
	</html>
	<?php
	
break;
}



	
	
case "comprobante_entrega" : {
	
	$sql = "SELECT entrega_lugar.descrip AS lugar, entrega.descrip, entrega.fecha FROM entrega INNER JOIN entrega_lugar USING(id_entrega_lugar) WHERE id_entrega=" . $_REQUEST['id_entrega'];
	$rsEntrega = $mysqli->query($sql);
	$rowEntrega = $rsEntrega->fetch_object();

	$sql = "SELECT producto.descrip, stock.lote, stock.f_vencimiento, entrega_item.cantidad FROM ((entrega INNER JOIN entrega_item USING(id_entrega)) INNER JOIN stock USING(id_stock)) INNER JOIN producto ON stock.id_producto = producto.id_producto WHERE entrega.id_entrega=" . $_REQUEST['id_entrega'] . " ORDER BY descrip, f_vencimiento";
	$rsEntrega_item = $mysqli->query($sql);
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Comprobante de entrega</title>
	</head>
	<body>
	<table border="0" width="700" align="center">
	<tr><td align="center" colspan="2"><big>COMPROBANTE DE ENTREGA</big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>Destino: </td><td><?php echo $rowEntrega->lugar; ?></td></tr>
	<tr><td>Descripción: </td><td><?php echo $rowEntrega->descrip; ?></td></tr>
	<tr><td>Fecha: </td><td><?php echo $rowEntrega->fecha; ?></td></tr>
	<tr><td>&nbsp;</td></tr>
	
	<tr><td colspan="20">
	<table border="1" rules="all" width="100%" align="center">
	<tr><th>Producto</th><th>Lote</th><th>F.vencimiento</th><th align="right">Cantidad</th></tr>
	<?php
	while ($rowEntrega_item = $rsEntrega_item->fetch_object()) {
		?>
		<tr><td><?php echo $rowEntrega_item->descrip; ?></td><td><?php echo $rowEntrega_item->lote; ?></td><td><?php echo $rowEntrega_item->f_vencimiento; ?></td><td align="right"><?php echo $rowEntrega_item->cantidad; ?></td></tr>
		<?php
	}
	?>
	</table>
	</td></tr>
	</table>
	</body>
	</html>
	<?php
	
break;
}
	
	
case "consumo_producto" : {

	$sql = "SELECT producto.id_producto, producto.descrip, SUM(entrega_item.cantidad) AS cantidad FROM (entrega INNER JOIN entrega_item USING(id_entrega)) INNER JOIN producto USING(id_producto) WHERE entrega.fecha BETWEEN '" . $_REQUEST['desde'] . "' AND '" . $_REQUEST['hasta'] . "' GROUP BY id_producto ORDER BY descrip";
	$rs = $mysqli->query($sql);
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Listado Consumo x Producto</title>
	</head>
	<body>
	<table border="0" width="700" align="center">
	<tr><td align="center" colspan="6"><big><?php echo date('Y-m-d') ?> - LISTADO CONSUMO x PRODUCTO</big></td></tr>
	<tr><td align="center" colspan="6"><big>(período <?php echo substr($_REQUEST['desde'], 0, 10) . " / " . substr($_REQUEST['hasta'], 0, 10) ?>)</big></td></tr>
	<tr><td>&nbsp;</td></tr>
	
	<tr><td colspan="20">
	<table border="1" rules="all" width="100%" align="center">
	<tr><th>Producto</th><th align="right">Cantidad</th></tr>
	<?php
	while ($row = $rs->fetch_array()) {
		?>
		<tr><td><?php echo $row['descrip']; ?></td><td align="right"><?php echo $row['cantidad']; ?></td></tr>
		<?php
	}
	?>
	</table>
	</td></tr>
	</table>
	</body>
	</html>
	<?php
	
break;
}


case "stock" : {

	$sql = "SELECT producto.*, SUM(stock.stock) AS cantidad FROM producto LEFT JOIN stock USING(id_producto) GROUP BY id_producto ORDER BY descrip";
	$rs = $mysqli->query($sql);
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Listado de Stock</title>
	</head>
	<body>
	<table border="0" width="700" align="center">
	<tr><td align="center" colspan="6"><big><?php echo date('Y-m-d') ?> - LISTADO DE STOCK</big></td></tr>
	<tr><td>&nbsp;</td></tr>
	
	<tr><td colspan="20">
	<table border="1" rules="all" width="100%" align="center">
	<tr><th>Producto</th><th align="right">Pto.reposición</th><th align="right">Stock</th></tr>
	<?php
	while ($row = $rs->fetch_array()) {
		?>
		<tr><td><?php echo $row['descrip']; ?></td><td align="right"><?php echo $row['pto_reposicion']; ?></td><td align="right"><?php echo (($row['cantidad'] == null) ? 0: $row['cantidad']); ?></td></tr>
		<?php
	}
	?>
	</table>
	</td></tr>
	</table>
	</body>
	</html>
	<?php
	
break;
}


case "producto_falta" : {

	$sql = "SELECT producto.*, SUM(stock.stock) AS cantidad FROM producto LEFT JOIN stock USING(id_producto) GROUP BY id_producto HAVING cantidad <= pto_reposicion OR ISNULL(cantidad) ORDER BY descrip";
	$rs = $mysqli->query($sql);
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Listado Producto en Falta</title>
	</head>
	<body>
	<table border="0" width="700" align="center">
	<tr><td align="center" colspan="6"><big><?php echo date('Y-m-d') ?> - LISTADO PRODUCTO EN FALTA</big></td></tr>
	<tr><td>&nbsp;</td></tr>
	
	<tr><td colspan="20">
	<table border="1" rules="all" width="100%" align="center">
	<tr><th>Producto</th><th align="right">Pto.reposición</th><th align="right">Stock</th></tr>
	<?php
	while ($row = $rs->fetch_array()) {
		?>
		<tr><td><?php echo $row['descrip']; ?></td><td align="right"><?php echo $row['pto_reposicion']; ?></td><td align="right"><?php echo (($row['cantidad'] == null) ? 0: $row['cantidad']); ?></td></tr>
		<?php
	}
	?>
	</table>
	</td></tr>
	</table>
	</body>
	</html>
	<?php
	
break;
}

}

?>