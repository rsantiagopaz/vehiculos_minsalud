qx.Class.define("vehiculos.comp.windowSal",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (vehiculo, rowDataEntSal)
	{
	this.base(arguments);
	
	this.set({
		caption: "Salida",
		width: 320,
		height: 250,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		var timer = qx.util.TimerManager.getInstance();
		timer.start(function() {
			this.setCaption("Salida, " + vehiculo.nro_patente + "  " + vehiculo.marca);
			txtResp_sal.focus();
		}, null, this, null, 50);
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var form = new qx.ui.form.Form();
	
	var txtResp_sal = new qx.ui.form.TextField("");
	txtResp_sal.setMinWidth(200);
	form.add(txtResp_sal, "Responsable", null, "resp_sal");
	
	var cboUnipresu = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Vehiculo", methodName: "autocompletarUnipresu"});
	var lstUnipresu = cboUnipresu.getChildControl("list");
	lstUnipresu.addListener("changeSelection", function(e){
		/*
		if (lstUnipresu.isSelectionEmpty()) {
			this.setLabel('Particular');
			functionActualizarVehiculo();
		} else {
			this.setLabel(lstUnipresu.getSelection()[0].getLabel());
			functionActualizarVehiculo(lstUnipresu.getModelSelection().getItem(0));
		}
		*/
	}, this);
	form.add(cboUnipresu, "Unidad presup.", null, "cod_up", null, {grupo: 1, item: {row: 20, column: 1, colSpan: 11}});
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	//var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 12, 25, 10);
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	if (rowDataEntSal.cod_up != "0") {
		var p = {};
		p.texto = parseInt(rowDataEntSal.cod_up);
		
		var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			var item = new qx.ui.form.ListItem(data.result[0].label, null, data.result[0].model);
			cboUnipresu.add(item);
			lstUnipresu.setSelection([item]);
		});
		rpc.callAsyncListeners(true, "autocompletarUnipresu", p);
	}
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		var p = {};
		p.id_vehiculo = vehiculo.id_vehiculo;
		p.id_entsal = rowDataEntSal.id_entsal;
		p.resp_sal = txtResp_sal.getValue();
		p.cod_up = ((lstUnipresu.isSelectionEmpty()) ? 0 : lstUnipresu.getSelection()[0].getModel());
		p.entsal_estado = rowDataEntSal.estado;
		
		var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
		rpc.addListener("completed", function(e){
			btnCancelar.execute();
			
			this.fireDataEvent("aceptado");
		}, this);
		rpc.addListener("failed", function(e){
			btnCancelar.execute();
			
			this.fireDataEvent("estado");
		}, this);
		rpc.callAsyncListeners(true, "salida_vehiculo", p);

	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.close();
		
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "20%", bottom: 0});
	this.add(btnCancelar, {right: "20%", bottom: 0});
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event",
		"estado": "qx.event.type.Event"
	}
});