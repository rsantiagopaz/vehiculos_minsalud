<?php
include("config.php");
include("control_de_acceso.php");
if (in_array('017014', $SYSsistema_perfiles_usuario))
{
$codvehiculo= $_REQUEST["codvehiculo"];
$patente = $_POST["patente"];
$nro_inventario= $_POST["nro_inventario"];

if ($SYSusuario==admin)
{
	if ($codvehiculo != "")
	{ $result=mysql_query("SELECT * FROM vehiculos 
				LEFT JOIN tipo_vehiculo
				ON vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO
				LEFT JOIN dependencias
				ON vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA
				LEFT JOIN estados_de_vehiculos
				ON vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO
				WHERE '$codvehiculo' = vehiculos.COD_VEHICULO 
				AND vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO 
				AND vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA 
                AND vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO");
	}
	elseif ($nro_inventario != "")
	{ $result=mysql_query("SELECT * FROM vehiculos 
				LEFT JOIN tipo_vehiculo
				ON vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO
				LEFT JOIN dependencias
				ON vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA
				LEFT JOIN estados_de_vehiculos
				ON vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO
				WHERE  '$nro_inventario' = vehiculos.NRO_INVENTARIO 
				AND vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO 
				AND vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA 
                AND vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO");
	}
	else
	{$result=mysql_query("SELECT * FROM vehiculos 
				LEFT JOIN tipo_vehiculo
				ON vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO
				LEFT JOIN dependencias
				ON vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA
				LEFT JOIN estados_de_vehiculos
				ON vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO
				WHERE  '$patente' = vehiculos.NRO_PAT 
				AND vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO 
				AND vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA 
                AND vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO");
	}
}
else
{
if ($SYSdependencia == 0)
{
	if ($codvehiculo != "")
	{$result=mysql_query("SELECT * FROM vehiculos 
				LEFT JOIN tipo_vehiculo
				ON vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO
				LEFT JOIN dependencias
				ON vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA
				LEFT JOIN estados_de_vehiculos
				ON vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO
				WHERE '$codvehiculo' = vehiculos.COD_VEHICULO 
				AND vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO 
				AND vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA 
                AND vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO AND vehiculos.COD_PARQUE='$SYSparque'");}
	elseif ($nro_inventario != "")
	{$result=mysql_query("SELECT * FROM vehiculos 
				LEFT JOIN tipo_vehiculo
				ON vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO
				LEFT JOIN dependencias
				ON vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA
				LEFT JOIN estados_de_vehiculos
				ON vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO
				WHERE  '$nro_inventario' = vehiculos.NRO_INVENTARIO 
				AND vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO 
				AND vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA 
                AND vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO AND vehiculos.COD_PARQUE = '$SYSparque'");}
	else
	{$result=mysql_query("SELECT * FROM vehiculos 
				LEFT JOIN tipo_vehiculo
				ON vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO
				LEFT JOIN dependencias
				ON vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA
				LEFT JOIN estados_de_vehiculos
				ON vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO
				WHERE  '$patente' = vehiculos.NRO_PAT 
				AND vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO 
				AND vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA 
                AND vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO AND vehiculos.COD_PARQUE = '$SYSparque'");}
}
else
{
	if ($codvehiculo != "")
	{$result=mysql_query("SELECT * FROM vehiculos 
				LEFT JOIN tipo_vehiculo
				ON vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO
				LEFT JOIN dependencias
				ON vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA
				LEFT JOIN estados_de_vehiculos
				ON vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO
				WHERE '$codvehiculo' = vehiculos.COD_VEHICULO 
				AND vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO 
				AND vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA 
                AND vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO AND vehiculos.COD_PARQUE='$SYSparque' AND vehiculos.COD_DEPENDENCIA='$SYSdependencia'");
    }
	elseif ($nro_inventario != "")
	{$result=mysql_query("SELECT * FROM vehiculos 
				LEFT JOIN tipo_vehiculo
				ON vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO
				LEFT JOIN dependencias
				ON vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA
				LEFT JOIN estados_de_vehiculos
				ON vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO
				WHERE  '$nro_inventario' = vehiculos.NRO_INVENTARIO 
				AND vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO 
				AND vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA 
                AND vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO AND vehiculos.COD_PARQUE = '$SYSparque' AND vehiculos.COD_DEPENDENCIA='$SYSdependencia'");
	}
	else
	{$result=mysql_query("SELECT * FROM vehiculos 
				LEFT JOIN tipo_vehiculo
				ON vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO
				LEFT JOIN dependencias
				ON vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA
				LEFT JOIN estados_de_vehiculos
				ON vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO
				WHERE  '$patente' = vehiculos.NRO_PAT 
				AND vehiculos.COD_TIPO_VEHICULO = tipo_vehiculo.COD_TIPO_VEHICULO 
				AND vehiculos.COD_DEPENDENCIA = dependencias.COD_DEPENDENCIA 
                AND vehiculos.COD_ESTADO = estados_de_vehiculos.COD_EST_VEHICULO AND vehiculos.COD_PARQUE = '$SYSparque' AND vehiculos.COD_DEPENDENCIA='$SYSdependencia'");
	}
}
}			
if (mysql_errno()>0)
{
print  '<br><br>Error: '.mysql_errno().": ".mysql_error()."BR><br>";
exit;
}
else
{
	$total=mysql_numrows($result);
	if ($total == 1)
		{
		$patente = mysql_result($result,0,NRO_PAT);
		$modelo  = mysql_result($result,0,MODELO);
		$marca  = mysql_result($result,0,MARCA);
		$acumulado  = mysql_result($result,0,ACUMULADO);
		$dependencia = mysql_result($result,0,DENOM_DEPENDENCIA);
		$tipovehiculo = mysql_result($result,0,DENOM_TIPO_VEHICULO);
		$estado = mysql_result($result,0,DESCRIP_EST_VEHICULO);
		$codvehiculo = mysql_result($result,0,COD_VEHICULO);

	include("imprimir_historial_formulario1.php"); 
	}
		else
		{
		 if ($SYSusuario==admin)
		{
		$mensaje="VEHICULO INEXISTENTE";
		 include('mens_error.php');
		 echo "<META HTTP-EQUIV='Refresh' CONTENT='2; URL=informe_vehiculo.php'>";
		}
		else
		{
		if ($SYSdependencia == 0)
		{
		$mensaje="VEHICULO INEXISTENTE EN ESTE PARQUE";
		}
		else
		{
		$mensaje="VEHICULO INEXISTENTE EN ESTA DEPENDENCIA";
		}
		 include('mens_error.php');
		 echo "<META HTTP-EQUIV='Refresh' CONTENT='2; URL=informe_vehiculo.php'>";
		}
		}
}
}
else
{
$mensaje="UD. NO TIENE PERMISO PARA REALIZAR ESTA OPERACION";
include('mens_error.php');
echo "<META HTTP-EQUIV='Refresh' CONTENT='2; URL=informe_vehiculo.php'>";
} ?>
