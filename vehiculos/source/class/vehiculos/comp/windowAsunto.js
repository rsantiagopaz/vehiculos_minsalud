qx.Class.define("vehiculos.comp.windowAsunto",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowDataMovimiento)
	{
	this.base(arguments);
	
	this.set({
		caption: "Asignar asunto",
		width: 330,
		height: 250,
		showMinimize: false,
		showMaximize: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());
	this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		var timer = qx.util.TimerManager.getInstance();
		timer.start(function() {
			txtAsunto.focus();
		}, null, this, null, 50);
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();
	var documento = null;
	
	var form = new qx.ui.form.Form();
	
	var txtAsunto = new qx.ui.form.TextField("");
	txtAsunto.setRequired(true);
	txtAsunto.setInvalidMessage("Asunto inválido");
	txtAsunto.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form.add(txtAsunto, "Asunto", null, "documentacion_id");
	
	var txtDocumento = new qx.ui.form.TextField("");
	txtDocumento.setReadOnly(true);
	form.add(txtDocumento, "Documento", null, "documento");
	
	var txtIniciador = new qx.ui.form.TextField("");
	txtIniciador.setReadOnly(true);
	form.add(txtIniciador, "Iniciador", null, "iniciador");
	
	var txtTexto = new qx.ui.form.TextArea("");
	txtTexto.setReadOnly(true);
	form.add(txtTexto, "Texto", null, "texto");
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	//var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 12, 25, 10);
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	var btnBuscar = new qx.ui.form.Button("Buscar");
	btnBuscar.addListener("execute", function(e){
		var p = {};
		p.documentacion_id = txtAsunto.getValue();
		
		var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
		rpc.addListener("completed", function(e){
			var data = e.getData();

			txtAsunto.setValid(true);
			
			txtDocumento.setValue(data.result.documento);
			txtIniciador.setValue(data.result.documentacion_tmp_iniciador);
			txtTexto.setValue(data.result.documentacion_asunto);
		}, this);
		rpc.addListener("failed", function(e){
			var data = e.getData();
			
			txtDocumento.setValue("");
			txtIniciador.setValue("");
			txtTexto.setValue("");
			
			if (data.message = "documentacion_id") {
				txtAsunto.setValid(false);
				txtAsunto.focus();
				
				sharedErrorTooltip.setLabel("Asunto inválido");
				sharedErrorTooltip.placeToWidget(txtAsunto);
				sharedErrorTooltip.show();
			}
		}, this);
		rpc.callAsyncListeners(true, "leer_asunto", p);
		
	});
	this.add(btnBuscar, {left: 250, top: 0});
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (txtDocumento.getValue() != "") {
			var p = {};
			p.id_movimiento = rowDataMovimiento.id_movimiento;
			p.documentacion_id = txtAsunto.getValue();
			
			var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
			rpc.addListener("completed", function(e){
				btnCancelar.execute();
				
				this.fireDataEvent("aceptado");
			}, this);
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				if (data.message = "documentacion_id") {
					txtAsunto.setValid(false);
					txtAsunto.focus();
					
					sharedErrorTooltip.setLabel("Asunto inválido");
					sharedErrorTooltip.placeToWidget(txtAsunto);
					sharedErrorTooltip.show();
				} else {
					btnCancelar.execute();
					
					this.fireDataEvent("estado");
				}
			}, this);
			rpc.callAsyncListeners(true, "asignar_asunto", p);

		} else {
			txtAsunto.focus();
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