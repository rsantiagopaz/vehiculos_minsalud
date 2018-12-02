qx.Class.define("vehiculos.comp.windowVehiculo",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Nuevo vehículo",
		width: 440,
		height: 450,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		lstVehiculo.fireDataEvent("changeSelection", []);
		cboVehiculo.focus();
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	
	var cboVehiculo = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Vehiculo", methodName: "autocompletarVehiculoCompleto"});
	cboVehiculo.setWidth(175);
	var lstVehiculo = cboVehiculo.getChildControl("list");
	lstVehiculo.addListener("changeSelection", function(e){
		var datos, modelForm;
		
		txtNro_patente.setValid(true);

		if (lstVehiculo.isSelectionEmpty()) {
			this.setCaption("Nuevo vehículo");
			
			datos = {nro_patente: "", marca: "", id_tipo_vehiculo: null, modelo: "", nro_motor: "", nro_chasis: "", observa: "", cboDependencia: "", organismo_area_id: null, id_vehiculo: "0"};
			
			cboDependencia.removeAll();
			cboDependencia.setValue("");
		} else {
			this.setCaption("Modificar vehículo");
			datos = lstVehiculo.getSelection()[0].getUserData("datos");
			datos.vehiculo.cboDependencia = "";
			
			if (datos.cboDependencia == null) {
				cboDependencia.removeAll();
				cboDependencia.setValue("");
			} else {
				cboDependencia.add(new qx.ui.form.ListItem(datos.cboDependencia.label, null, datos.cboDependencia.model));
			}
			
			datos = datos.vehiculo;
		}
		
		modelForm = qx.data.marshal.Json.createModel(datos, true);
		controllerFormInfoVehiculo.setModel(modelForm);
	}, this);
	
	this.add(new qx.ui.basic.Label("Buscar:"), {left: 0, top: 3});
	this.add(cboVehiculo, {left: 84, top: 0});
	cboVehiculo.setTabIndex(1);
	
	var lblLinea = new qx.ui.basic.Label("<hr>");
	lblLinea.setRich(true);
	lblLinea.setWidth(500);
	this.add(lblLinea, {left: 0, top: 22, right: 0});
	
	
	
	
	
	
	var formInfoVehiculo = new qx.ui.form.Form();
	
	var txtNro_patente = new qx.ui.form.TextField();
	txtNro_patente.setRequired(true);
	txtNro_patente.addListener("blur", function(e){
		var value = this.getValue();
		this.setValue((value == null) ? "" : value.trim().toUpperCase());
	});
	formInfoVehiculo.add(txtNro_patente, "Nro.patente", null, "nro_patente", null, {tabIndex: 3, item: {row: 1, column: 1, colSpan: 4}});
	
	var aux = new qx.ui.form.TextField();
	aux.addListener("blur", function(e){
		var value = this.getValue();
		this.setValue((value == null) ? "" : value.trim());
	});
	formInfoVehiculo.add(aux, "Marca", null, "marca", null, {item: {row: 2, column: 1, colSpan: 8}});
	

	aux = new qx.ui.form.SelectBox();
	var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
	try {
		var resultado = rpc.callSync("autocompletarTipo_vehiculo", {texto: ""});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	for (var x in resultado) {
		aux.add(new qx.ui.form.ListItem(resultado[x].label, null, resultado[x].model));
	}
	
	formInfoVehiculo.add(aux, "Tipo", null, "id_tipo_vehiculo", null, {item: {row: 3, column: 1, colSpan: 8}});

	
	aux = new qx.ui.form.TextField();
	aux.addListener("blur", function(e){
		var value = this.getValue();
		this.setValue((value == null) ? "" : value.trim());
	});
	formInfoVehiculo.add(aux, "Modelo (año)", null, "modelo", null, {item: {row: 4, column: 1, colSpan: 2}});
	
	aux = new qx.ui.form.TextField();
	aux.addListener("blur", function(e){
		var value = this.getValue();
		this.setValue((value == null) ? "" : value.trim());
	});
	formInfoVehiculo.add(aux, "Nro.motor", null, "nro_motor", null, {item: {row: 5, column: 1, colSpan: 6}});
	
	aux = new qx.ui.form.TextField();
	aux.addListener("blur", function(e){
		var value = this.getValue();
		this.setValue((value == null) ? "" : value.trim());
	});
	formInfoVehiculo.add(aux, "Nro.chasis", null, "nro_chasis", null, {item: {row: 6, column: 1, colSpan: 6}});
	
	aux = new qx.ui.form.TextArea();
	aux.addListener("blur", function(e){
		var value = this.getValue();
		this.setValue((value == null) ? "" : value.trim());
	});
	formInfoVehiculo.add(aux, "Observaciones", null, "observa", null, {item: {row: 7, column: 1, colSpan: 8}});
	
	var cboDependencia = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Vehiculo", methodName: "autocompletarDependencia"});
	cboDependencia.setRequired(true);
	formInfoVehiculo.add(cboDependencia, "Dependencia", function(value) {
		if (lstDependencia.isSelectionEmpty()) throw new qx.core.ValidationError("Validation Error", "Debe seleccionar dependencia");
	}, "cboDependencia", null, {item: {row: 8, column: 1, colSpan: 13}});
	var lstDependencia = cboDependencia.getChildControl("list");
	formInfoVehiculo.add(lstDependencia, "", null, "organismo_area_id");

	

	var controllerFormInfoVehiculo = new qx.data.controller.Form(null, formInfoVehiculo);
	//modelForm = controllerFormInfoVehiculo.createModel(true);
	
	var formViewVehiculo = new componente.comp.ui.ramon.abstractrenderer.Grid(formInfoVehiculo, 30, 30);
	//var formViewVehiculo = new qx.ui.form.renderer.Single(formInfoVehiculo);
	this.add(formViewVehiculo, {left: 0, top: 45});
	
	

	
	
	
	var btnAceptar = new qx.ui.form.Button("Grabar");
	btnAceptar.addListener("execute", function(e){
		if (formInfoVehiculo.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerFormInfoVehiculo.getModel());

			var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
			
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				application.popupGrabado.placeToWidget(this, true);
				application.popupGrabado.show();

				if (p.model.id_vehiculo == "0") {
					lstVehiculo.fireDataEvent("changeSelection", []);
					txtNro_patente.focus();
				} else {
					cboVehiculo.setValue("");
					lstVehiculo.removeAll();
					cboVehiculo.focus();
				}
			}, this);
			
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				if (data.message == "duplicado") {
					txtNro_patente.setInvalidMessage("Nro.patente duplicado");
					txtNro_patente.setValid(false);
					txtNro_patente.focus();
					
					var manager = qx.ui.tooltip.Manager.getInstance();
					manager.showToolTip(txtNro_patente);
				}
			}, this);
			
			rpc.callAsyncListeners(true, "alta_modifica_vehiculo", p);
			
			
			
			
			
		} else {
			formInfoVehiculo.getValidationManager().getInvalidFormItems()[0].focus();
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cerrar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "25%", bottom: 0});
	this.add(btnCancelar, {right: "25%", bottom: 0});
	
	btnAceptar.setTabIndex(20);
	btnCancelar.setTabIndex(21);
	
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});