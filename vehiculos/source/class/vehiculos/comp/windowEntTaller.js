qx.Class.define("vehiculos.comp.windowEntTaller",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (vehiculo, rowDataEntSal)
	{
	this.base(arguments);
	
	this.set({
		caption: "Entrada a taller",
		width: 400,
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
			this.setCaption("Entrada a taller, " + vehiculo.nro_patente + "  " + vehiculo.marca);
			cboTaller.focus();
		}, null, this, null, 50);
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var form = new qx.ui.form.Form();
	
	var cboTaller = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarTaller"});
	cboTaller.setRequired(true);
	var lstTaller = cboTaller.getChildControl("list");

	form.add(cboTaller, "Taller", function(value) {
		if (lstTaller.isSelectionEmpty()) throw new qx.core.ValidationError("Validation Error", "Debe seleccionar taller");
	}, "cod_razon_social", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 11}});
	
	var txtObserva = new qx.ui.form.TextArea("");
	txtObserva.setRequired(true);
	txtObserva.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form.add(txtObserva, "Observaciones", null, "observa", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 11, rowSpan: 15}});
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 20, 20, 1);
	//var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.id_vehiculo = vehiculo.id_vehiculo;
			p.id_entsal = rowDataEntSal.id_entsal;
			p.cod_razon_social = lstTaller.getModelSelection().getItem(0);
			p.observa = txtObserva.getValue();
			p.entsal_estado = rowDataEntSal.estado;
			
			var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				btnCancelar.execute();
				
				this.fireDataEvent("aceptado", data.result);
			}, this);
			rpc.addListener("failed", function(e){
				btnCancelar.execute();
				
				this.fireDataEvent("estado");
			}, this);
			rpc.callAsyncListeners(true, "entrada_taller", p);

		} else {
			form.getValidationManager().getInvalidFormItems()[0].focus();
		}
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