qx.Class.define("vehiculos.comp.pageParticular",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Particular');
	this.setLayout(new qx.ui.layout.Grow());
	
	this.addListenerOnce("appear", function(e){
		var timer = qx.util.TimerManager.getInstance();
		timer.start(function() {
			cboVehiculo.focus();
		}, null, this, null, 50);
	});
	
	this.addListener("appear", function(e){
		this.setShowCloseButton(true);
	}, this);
	this.addListener("disappear", function(e){
		this.setShowCloseButton(false);
	}, this);
	
	
	
	var application = qx.core.Init.getApplication();
	
	var vehiculo;
	var rowDataEntSal;
	var rowDataMovimiento;
	var rowDataSal;
	var popupInfo = new vehiculos.comp.popupInfo();
	
	var buscar_id_movimiento;
	
	
	var functionActualizarVehiculo = function(id_vehiculo, id_entsal, id_movimiento){
		
		tableModelEntsal.setDataAsMapArray([], true);
		tableModelMovimiento.setDataAsMapArray([], true);
		tableModelSal.setDataAsMapArray([], true);
		
		controllerFormInfoVehiculo.resetModel();
		controllerFormInfoEntsal.resetModel();
		controllerFormInfoMovimiento.resetModel();
		controllerFormInfoSal.resetModel();
		
		btnInfoVehiculo.setEnabled(false);
		btnHistorial.setEnabled(false);
		btnAnularEnt.setEnabled(false);
		btnImprimirSal.setEnabled(false);
		btnEnt.setEnabled(false);
		btnSal.setEnabled(false);
		
		btnAsunto.setEnabled(false);
		btnAnularEntTaller.setEnabled(false);
		btnImprimirEntTaller.setEnabled(false);
		btnImpConformidad.setEnabled(false);
		btnEntTaller.setEnabled(false);
		btnSalTaller.setEnabled(false);
		
		
		if (id_vehiculo != null) {
			
			var timer = qx.util.TimerManager.getInstance();
			if (this.timerId != null) {
				timer.stop(this.timerId);
				this.timerId = null;
				
				if (this.rpc != null) {
					this.rpc.abort(this.opaqueCallRef);
					this.rpc = null;
				}
			}
			
			this.timerId = timer.start(function() {
				
				var p = {};
				p.id_vehiculo = id_vehiculo;
				
				this.rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
				this.rpc.addListener("completed", function(e){
					var data = e.getData();
					
					//alert(qx.lang.Json.stringify(data, null, 2));
					
					vehiculo = data.result;
					controllerFormInfoVehiculo.setModel(qx.data.marshal.Json.createModel(vehiculo));
					
					btnInfoVehiculo.setEnabled(true);
					btnHistorial.setEnabled(true);
					btnEnt.setEnabled(vehiculo.estado == "S");
					
					functionActualizarEntSal(id_entsal, id_movimiento);
					
				});
				
				this.rpc.addListener("failed", function(e){
					var data = e.getData();
					
					//alert(qx.lang.Json.stringify(data, null, 2));
				});
				
				this.opaqueCallRef = this.rpc.callAsyncListeners(false, "leer_vehiculo", p);
				
			}, null, this, null, 200);
		}
	};
	
	var functionActualizarEntSal = function(id_entsal, id_movimiento){
		
		tableModelEntsal.setDataAsMapArray([], true);
		tableModelMovimiento.setDataAsMapArray([], true);
		tableModelSal.setDataAsMapArray([], true);
		
		controllerFormInfoEntsal.resetModel();
		controllerFormInfoMovimiento.resetModel();
		controllerFormInfoSal.resetModel();
		
		buscar_id_movimiento = id_movimiento;
		
		
		var timer = qx.util.TimerManager.getInstance();
		if (this.timerId != null) {
			timer.stop(this.timerId);
			this.timerId = null;
			
			if (this.rpc != null) {
				this.rpc.abort(this.opaqueCallRef);
				this.rpc = null;
			}
		}
		
		this.timerId = timer.start(function() {
		
			var p = {};
			p.id_vehiculo = vehiculo.id_vehiculo;
			
			this.rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
			this.rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));

				tblEntsal.setFocusedCell();
				tableModelEntsal.setDataAsMapArray(data.result, true);
				
				if (id_entsal != null) {
					tblEntsal.buscar("id_entsal", id_entsal);
					tblEntsal.focus();
				}
			});
			
			this.rpc.addListener("failed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));

			});
			
			this.opaqueCallRef = this.rpc.callAsyncListeners(false, "leer_entsal", p);
			
			application.pageGeneral.functionActualizarGral();
		
		}, null, this, null, 200);
	};
	
	
	var functionActualizarMovimiento = function(id_movimiento){
		
		tableModelMovimiento.setDataAsMapArray([], true);
		tableModelSal.setDataAsMapArray([], true);
		
		controllerFormInfoMovimiento.resetModel();
		controllerFormInfoSal.resetModel();
		
		
		var timer = qx.util.TimerManager.getInstance();
		if (this.timerId != null) {
			timer.stop(this.timerId);
			this.timerId = null;
			
			if (this.rpc != null) {
				this.rpc.abort(this.opaqueCallRef);
				this.rpc = null;
			}
		}
		
		
		this.timerId = timer.start(function() {
			
			var p = {};
			p.id_entsal = rowDataEntSal.id_entsal;
			
			this.rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
			this.rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));

				var bandera = true;
				for (var x in data.result) {
					if (data.result[x].estado == "S" || data.result[x].estado == "D") {
						bandera = false;
						break;
					}
				}
				btnAnularEnt.setEnabled(bandera && (rowDataEntSal.estado == "E" || rowDataEntSal.estado == "T"));
				
				tblMovimiento.setFocusedCell();
				tableModelMovimiento.setDataAsMapArray(data.result, true);
					
				if (id_movimiento != null) {
					tblMovimiento.buscar("id_movimiento", id_movimiento);
					tblMovimiento.focus();
				}
			});
			
			this.opaqueCallRef = this.rpc.callAsyncListeners(false, "leer_movimiento", p);
			
			application.pageGeneral.functionActualizarGral();
		
		}, null, this, null, 200);
	};
	
	
	var functionActualizar = function(id_vehiculo, id_entsal, id_movimiento) {
		dialog.Dialog.alert("Los datos presentados inicialmente fueron modificados desde otra terminal.<br/><br/>Se cancela la operación, se actualizarán los datos en pantalla.<br/><br/>", function(){
			if (id_movimiento) {
				functionActualizarVehiculo(id_vehiculo, id_entsal, id_movimiento);
			} else if (id_entsal) {
				functionActualizarVehiculo(id_vehiculo, id_entsal);
			} else {
				functionActualizarVehiculo(id_vehiculo);
			}
		});
	}
	
	


	var desktop = new qx.ui.window.Desktop();
	this.add(desktop);
	
	var pane = new qx.ui.splitpane.Pane("horizontal");
	pane.setDecorator(null);
	var composite1 = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	var composite2 = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	composite1.setPaddingRight(3);
	composite2.setPaddingLeft(3);
	pane.add(composite1, 1);
	pane.add(composite2, 0);
	
	desktop.add(pane, {edge: 0});
	
	var blocker = new qx.ui.core.Blocker(pane);
	blocker.set({color: '#bfbfbf', opacity: 0.4});
	
	
	

	
	
	var gridEntsal = new qx.ui.layout.Grid(6, 6);
	gridEntsal.setRowAlign(0, "left", "middle");
	
	//gridEntsal.setColumnFlex(0, 1);
	gridEntsal.setColumnFlex(1, 1);
	//gridEntsal.setColumnFlex(2, 1);
	//gridEntsal.setColumnFlex(3, 1);
	gridEntsal.setColumnFlex(4, 1);
	//gridEntsal.setColumnFlex(5, 1);
	gridEntsal.setColumnFlex(6, 1);
	gridEntsal.setColumnFlex(7, 1);
	//gridEntsal.setColumnFlex(8, 1);
	gridEntsal.setColumnFlex(9, 1);
	//gridEntsal.setColumnFlex(10, 1);
	//gridEntsal.setColumnFlex(11, 1);
	
	gridEntsal.setRowFlex(1, 1);
	

	var gbxEntsal = new qx.ui.groupbox.GroupBox();
	gbxEntsal.setLayout(gridEntsal);
	composite1.add(gbxEntsal, {left: 0, top: 0, right: 0, bottom: "66.5%"});
	
	
	var cboVehiculo = this.cboVehiculo = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Vehiculo", methodName: "autocompletarVehiculo"});
	cboVehiculo.setWidth(175);
	var lstVehiculo = this.lstVehiculo = cboVehiculo.getChildControl("list");
	lstVehiculo.addListener("changeSelection", function(e){
		if (lstVehiculo.isSelectionEmpty()) {
			this.setLabel('Particular');
			functionActualizarVehiculo();
		} else {
			this.setLabel(lstVehiculo.getSelection()[0].getLabel());
			functionActualizarVehiculo(lstVehiculo.getModelSelection().getItem(0));
		}
	}, this);
	
	gbxEntsal.add(new qx.ui.basic.Label("Vehículo:"), {row: 0, column: 0});
	gbxEntsal.add(cboVehiculo, {row: 0, column: 1});
	
	
	var btnInfoVehiculo = new qx.ui.form.Button("Info...");
	btnInfoVehiculo.setEnabled(false);
	btnInfoVehiculo.addListener("execute", function(e){
		popupInfo.placeToWidget(btnInfoVehiculo);
		popupInfo.mostrar(formViewVehiculo);
	});
	gbxEntsal.add(btnInfoVehiculo, {row: 0, column: 2});
	
	
	var btnHistorial = new qx.ui.form.Button("Historial...");
	btnHistorial.setEnabled(false);
	btnHistorial.addListener("execute", function(e){
		window.open("services/class/comp/Impresion.php?rutina=historial&id_vehiculo=" + vehiculo.id_vehiculo);
	});
	gbxEntsal.add(btnHistorial, {row: 0, column: 3});
	
	
	
	
	
	
	var btnAnularEnt = new qx.ui.form.Button("Anular...");
	btnAnularEnt.setEnabled(false);
	btnAnularEnt.addListener("execute", function(e){
		(new dialog.Confirm({
		        "message"   : "Desea anular la entrada seleccionada y todos los movimientos relacionados?",
		        "callback"  : function(e){
		        					if (e) {
										var p = {};
										p.id_entsal = rowDataEntSal.id_entsal;
										p.entsal_estado = rowDataEntSal.estado;
										
										var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
										rpc.addListener("completed", function(e){
											functionActualizarVehiculo(vehiculo.id_vehiculo, rowDataEntSal.id_entsal);
										});
										rpc.addListener("failed", function(e){
											functionActualizar(vehiculo.id_vehiculo, rowDataEntSal.id_entsal);
										});
										rpc.callAsyncListeners(true, "anular_entrada_vehiculo", p);
		        					}
		        				},
		        "context"   : this,
		        "image"     : "icon/48/status/dialog-warning.png"
		})).show();
	});
	gbxEntsal.add(btnAnularEnt, {row: 0, column: 5});
	
	var btnImprimirSal = new qx.ui.form.Button("Conformidad...");
	btnImprimirSal.setEnabled(false);
	btnImprimirSal.addListener("execute", function(e){
		window.open("services/class/comp/Impresion.php?rutina=salida_vehiculo&id_entsal=" + rowDataEntSal.id_entsal);
	});
	gbxEntsal.add(btnImprimirSal, {row: 0, column: 8});
	
	var btnEnt = new qx.ui.form.Button("Entrada...");
	btnEnt.setEnabled(false);
	btnEnt.addListener("execute", function(e){
		var win = new vehiculos.comp.windowEnt(vehiculo);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarVehiculo(vehiculo.id_vehiculo, data);
		});
		win.addListener("estado", function(e){
			functionActualizar(vehiculo.id_vehiculo);
		});
		win.addListener("close", function(e){
			blocker.unblock();
		});
		desktop.add(win);
		blocker.block();
		win.center();
		win.open();
	});
	
	gbxEntsal.add(btnEnt, {row: 0, column: 10});
	
	var btnSal = new qx.ui.form.Button("Salida...");
	btnSal.setEnabled(false);
	btnSal.addListener("execute", function(e){
		var win = new vehiculos.comp.windowSal(vehiculo, rowDataEntSal);
		win.addListener("aceptado", function(e){
			functionActualizarVehiculo(vehiculo.id_vehiculo, rowDataEntSal.id_entsal);
			
			//window.open("services/class/comp/Impresion.php?rutina=salida_vehiculo&id_entsal=" + rowDataEntSal.id_entsal);
		});
		win.addListener("estado", function(e){
			functionActualizar(vehiculo.id_vehiculo, rowDataEntSal.id_entsal);
		});
		win.addListener("close", function(e){
			blocker.unblock();
		});
		desktop.add(win);
		blocker.block();
		win.center();
		win.open();
	}, this);
	
	gbxEntsal.add(btnSal, {row: 0, column: 11});
	

	
	
	//Tabla

	var tableModelEntsal = new qx.ui.table.model.Simple();
	tableModelEntsal.setColumns(["Entrada", "Salida", "Unidad presup.", "Km", "Total", "bandera_estado"], ["f_ent", "f_sal", "unipresu", "kilo", "total", "bandera_estado"]);
	tableModelEntsal.setColumnSortable(0, false);
	tableModelEntsal.setColumnSortable(1, false);
	tableModelEntsal.setColumnSortable(2, false);
	tableModelEntsal.setColumnSortable(3, false);
	tableModelEntsal.setColumnSortable(4, false);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblEntsal = new componente.comp.ui.ramon.table.Table(tableModelEntsal, custom);
	//tblTotales.toggleShowCellFocusIndicator();
	tblEntsal.setShowCellFocusIndicator(false);
	tblEntsal.toggleColumnVisibilityButtonVisible();
	tblEntsal.toggleStatusBarVisible();
	
	var tableColumnModelEntsal = tblEntsal.getTableColumnModel();
	tableColumnModelEntsal.setColumnVisible(5, false);
	
	
	var cellrendererDate = new qx.ui.table.cellrenderer.Date();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd HH:mm:ss"));
	tableColumnModelEntsal.setDataCellRenderer(0, cellrendererDate);
	
	var cellrendererDate = new qx.ui.table.cellrenderer.Date();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd HH:mm:ss"));
	cellrendererDate.addNumericCondition("==", -1, "center", "#FF0000", null, null, "bandera_estado");
	tableColumnModelEntsal.setDataCellRenderer(1, cellrendererDate);
	
	var cellrendererDynamic = new qx.ui.table.cellrenderer.Dynamic(function(cellInfo) {
		if (typeof cellInfo.value == "string") {
			var cellrendererString = new qx.ui.table.cellrenderer.String();
			cellrendererString.addNumericCondition("==", -1, "center", "#FF0000", null, null, "bandera_estado");
			return cellrendererString;
		} else {
			var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
			cellrendererNumber.setNumberFormat(application.numberformatMontoEs);
			return cellrendererNumber;
		}
	});
	tableColumnModelEntsal.setDataCellRenderer(4, cellrendererDynamic);
	
	var selectionModelEntsal = tblEntsal.getSelectionModel();
	selectionModelEntsal.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelEntsal.addListener("changeSelection", function(e){
		if (! selectionModelEntsal.isSelectionEmpty()) {
			rowDataEntSal = tableModelEntsal.getRowData(tblEntsal.getFocusedRow());
			
			functionActualizarMovimiento(buscar_id_movimiento);
			
			btnAnularEnt.setEnabled(false);
			btnImprimirSal.setEnabled(rowDataEntSal.estado == "S");
			btnSal.setEnabled(rowDataEntSal.estado == "E");
			
			btnAsunto.setEnabled(false);
			btnAnularEntTaller.setEnabled(false);
			btnImprimirEntTaller.setEnabled(false);
			btnImpConformidad.setEnabled(false);
			btnEntTaller.setEnabled(rowDataEntSal.estado != "S" && rowDataEntSal.estado != "A");
			btnSalTaller.setEnabled(false);
		
			controllerFormInfoEntsal.setModel(qx.data.marshal.Json.createModel(rowDataEntSal));

			//tableModelSal.setDataAsMapArray([], true);
			
			buscar_id_movimiento = null;
		}
	});
	
	gbxEntsal.add(tblEntsal, {row: 1, column: 0, colSpan: 12});
	
	

	
	

	
	var aux;
	
	var formInfoVehiculo = new qx.ui.form.Form();
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Nro.patente", null, "nro_patente");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Marca", null, "marca");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Tipo", null, "tipo");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Modelo", null, "modelo");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Nro.motor", null, "nro_motor");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Nro.chasis", null, "nro_chasis");
	
	aux = new qx.ui.form.TextArea();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Observaciones", null, "observa");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Dependencia", null, "dependencia");
	
	aux = new qx.ui.form.Spinner(0, 0, 1000000);
	aux.setEditable(false);
	aux.setFocusable(false);
	aux.setNumberFormat(application.numberformatMontoEs);
	aux.getChildControl("upbutton").setVisibility("excluded");
	aux.getChildControl("downbutton").setVisibility("excluded");
	aux.setSingleStep(0);
	aux.setPageStep(0);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Total", null, "total");
	
	var controllerFormInfoVehiculo = new qx.data.controller.Form(null, formInfoVehiculo);
	//modelForm = controllerFormInfoVehiculo.createModel(true);
	
	var formViewVehiculo = new qx.ui.form.renderer.Single(formInfoVehiculo);
	
	
	
	
	//var p = new qx.ui.form.VirtualComboBox();

	
	
	var formInfoEntsal = new qx.ui.form.Form();
	
	var txtObserva = new qx.ui.form.TextArea("");
	txtObserva.setReadOnly(true);
	txtObserva.setDecorator("main");
	txtObserva.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(txtObserva, "Observa.", null, "observa");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Usuario ent.", null, "id_usuario_ent");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Resp.ent.", null, "resp_ent");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Usuario sal.", null, "id_usuario_sal");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Resp.sal.", null, "resp_sal");
	
	var controllerFormInfoEntsal = new qx.data.controller.Form(null, formInfoEntsal);
	//modelForm = controllerFormInfoVehiculo.createModel(true);
	
	var formViewEntsal = new qx.ui.form.renderer.Single(formInfoEntsal);
	
	
	var gbxInfoEntsal = new qx.ui.groupbox.GroupBox();
	gbxInfoEntsal.setLayout(new qx.ui.layout.Grow());
	aux = new qx.ui.container.Scroll(formViewEntsal);
	aux.setScrollbarX("off");
	gbxInfoEntsal.add(aux);
	composite2.add(gbxInfoEntsal, {left: 0, top: 0, right: 0, bottom: "66.5%"});
	
	
	
	
	
	var formInfoMovimiento = new qx.ui.form.Form();
	
	aux = new qx.ui.form.TextArea();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoMovimiento.add(aux, "Observa.", null, "observa");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoMovimiento.add(aux, "Usuario ent.", null, "id_usuario_ent");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoMovimiento.add(aux, "Usuario sal.", null, "id_usuario_sal");
	
	var controllerFormInfoMovimiento = new qx.data.controller.Form(null, formInfoMovimiento);
	//modelForm = controllerFormInfoVehiculo.createModel(true);
	
	var formViewMovimiento = new qx.ui.form.renderer.Single(formInfoMovimiento);
	
	
	var gbxInfoMovimiento = new qx.ui.groupbox.GroupBox("");
	gbxInfoMovimiento.setLayout(new qx.ui.layout.Grow());
	aux = new qx.ui.container.Scroll(formViewMovimiento);
	aux.setScrollbarX("off");
	gbxInfoMovimiento.add(aux);
	composite2.add(gbxInfoMovimiento, {left: 0, top: "33.5%", right: 0, bottom: "33.5%"});
	
	
	
	
	
	var formInfoSal = new qx.ui.form.Form();
	
	aux = new qx.ui.form.TextArea();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoSal.add(aux, "Observa.", null, "observa");
	
	var controllerFormInfoSal = new qx.data.controller.Form(null, formInfoSal);
	//modelForm = controllerFormInfoVehiculo.createModel(true);
	
	var formViewSal = new qx.ui.form.renderer.Single(formInfoSal);
	
	
	var gbxInfoSal = new qx.ui.groupbox.GroupBox("");
	gbxInfoSal.setLayout(new qx.ui.layout.Canvas());
	gbxInfoSal.add(formViewSal, {right: 0});
	composite2.add(gbxInfoSal, {left: 0, top: "66.5%", right: 0, bottom: 0});
	
	
	
	
	
	
	var gridMovimiento = new qx.ui.layout.Grid(6, 6);
	
	//gridMovimiento.setColumnFlex(0, 1);
	//gridMovimiento.setColumnFlex(1, 1);
	gridMovimiento.setColumnFlex(2, 1);
	gridMovimiento.setColumnFlex(3, 1);
	gridMovimiento.setColumnFlex(4, 1);
	//gridMovimiento.setColumnFlex(5, 1);
	gridMovimiento.setColumnFlex(6, 1);
	//gridMovimiento.setColumnFlex(7, 1);
	//gridMovimiento.setColumnFlex(8, 1);
	gridMovimiento.setColumnFlex(9, 1);
	//gridMovimiento.setColumnFlex(10, 1);
	//gridMovimiento.setColumnFlex(11, 1);
	
	gridMovimiento.setRowFlex(1, 1);
	
	var gbxMovimiento = new qx.ui.groupbox.GroupBox("Movimientos");
	gbxMovimiento.setLayout(gridMovimiento);
	composite1.add(gbxMovimiento, {left: 0, top: "33.5%", right: 0, bottom: "33.5%"});
	
	
	//Tabla

	var tableModelMovimiento = new qx.ui.table.model.Simple();
	tableModelMovimiento.setColumns(["#", "Taller", "Entrada", "Salida", "Km", "Asunto", "Total", "bandera_estado"], ["id_movimiento", "taller", "f_ent", "f_sal", "kilo", "documentacion_id", "total", "bandera_estado"]);
	tableModelMovimiento.setColumnSortable(0, false);
	tableModelMovimiento.setColumnSortable(1, false);
	tableModelMovimiento.setColumnSortable(2, false);
	tableModelMovimiento.setColumnSortable(3, false);
	tableModelMovimiento.setColumnSortable(4, false);
	tableModelMovimiento.setColumnSortable(5, false);
	tableModelMovimiento.setColumnSortable(6, false);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblMovimiento = new componente.comp.ui.ramon.table.Table(tableModelMovimiento, custom);
	//tblTotales.toggleShowCellFocusIndicator();
	tblMovimiento.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	tblMovimiento.setShowCellFocusIndicator(false);
	tblMovimiento.toggleColumnVisibilityButtonVisible();
	tblMovimiento.toggleStatusBarVisible();
	
	var tableColumnModelMovimiento = tblMovimiento.getTableColumnModel();
	tableColumnModelMovimiento.setColumnVisible(7, false);
	
	var cellrendererDate = new qx.ui.table.cellrenderer.Date();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd HH:mm:ss"));
	tableColumnModelMovimiento.setDataCellRenderer(2, cellrendererDate);
	
	var cellrendererDate = new qx.ui.table.cellrenderer.Date();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd HH:mm:ss"));
	cellrendererDate.addNumericCondition("==", -1, "center", "#FF0000", null, null, "bandera_estado");
	tableColumnModelMovimiento.setDataCellRenderer(3, cellrendererDate);
	
	var cellrendererDynamic = new qx.ui.table.cellrenderer.Dynamic(function(cellInfo) {
		if (typeof cellInfo.value == "string") {
			var cellrendererString = new qx.ui.table.cellrenderer.String();
			cellrendererString.addNumericCondition("==", -1, "center", "#FF0000", null, null, "bandera_estado");
			return cellrendererString;
		} else {
			var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
			cellrendererNumber.setNumberFormat(application.numberformatMontoEs);
			return cellrendererNumber;
		}
	});
	tableColumnModelMovimiento.setDataCellRenderer(6, cellrendererDynamic);
	

	
	var resizeBehavior = tableColumnModelMovimiento.getBehavior();
	resizeBehavior.set(0, {width:"4%", minWidth:100});
	resizeBehavior.set(1, {width:"38%", minWidth:100});
	resizeBehavior.set(2, {width:"15%", minWidth:100});
	resizeBehavior.set(3, {width:"15%", minWidth:100});
	resizeBehavior.set(4, {width:"9%", minWidth:100});
	resizeBehavior.set(5, {width:"9%", minWidth:100});
	resizeBehavior.set(6, {width:"10%", minWidth:100});
	
	var selectionModelMovimiento = tblMovimiento.getSelectionModel();
	selectionModelMovimiento.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelMovimiento.addListener("changeSelection", function(e){
		if (! selectionModelMovimiento.isSelectionEmpty()) {
			
			rowDataMovimiento = tableModelMovimiento.getRowData(tblMovimiento.getFocusedRow());
			
			tableModelSal.setDataAsMapArray([], true);
			
			btnAsunto.setEnabled(rowDataMovimiento.estado == "S" && rowDataMovimiento.documentacion_id == null);
			btnAnularEntTaller.setEnabled(rowDataMovimiento.estado == "E");
			btnImprimirEntTaller.setEnabled(rowDataMovimiento.estado != "A");
			btnImpConformidad.setEnabled(rowDataEntSal.estado == "S" && rowDataMovimiento.estado == "S");
			btnSalTaller.setEnabled(rowDataMovimiento.estado != "A" && rowDataMovimiento.documentacion_id == null && rowDataEntSal.estado != "A");
			
			controllerFormInfoMovimiento.setModel(qx.data.marshal.Json.createModel(rowDataMovimiento));
			controllerFormInfoSal.resetModel();
			
			
			var timer = qx.util.TimerManager.getInstance();
			if (this.timerId != null) {
				timer.stop(this.timerId);
				this.timerId = null;
				
				if (this.rpc != null) {
					this.rpc.abort(this.opaqueCallRef);
					this.rpc = null;
				}
			}
			
			this.timerId = timer.start(function() {
			
				var p = {};
				p.id_movimiento = rowDataMovimiento.id_movimiento;
				
				this.rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
				this.rpc.addListener("completed", function(e){
					var data = e.getData();
					
					tblSal.setFocusedCell();
					tableModelSal.setDataAsMapArray(data.result, true);

				});
				
				this.opaqueCallRef = this.rpc.callAsyncListeners(false, "leer_reparacion", p);
			
			}, null, this, null, 200);
		}
	});
	
	gbxMovimiento.add(tblMovimiento, {row: 1, column: 0, colSpan: 12});
	
	
	
	var btnAsunto = new qx.ui.form.Button("Asunto...");
	btnAsunto.setEnabled(false);
	btnAsunto.addListener("execute", function(e){
		var win = new vehiculos.comp.windowAsunto(rowDataMovimiento);
		win.addListener("aceptado", function(e){
			functionActualizarMovimiento(rowDataMovimiento.id_movimiento);
		});
		win.addListener("estado", function(e){
			functionActualizar(vehiculo.id_vehiculo, rowDataEntSal.id_entsal, rowDataMovimiento.id_movimiento);
		});
		win.addListener("close", function(e){
			blocker.unblock();
		});
		desktop.add(win);
		blocker.block();
		win.center();
		win.open();
	});
	gbxMovimiento.add(btnAsunto, {row: 0, column: 0});
	
	var btnAnularEntTaller = new qx.ui.form.Button("Anular...");
	btnAnularEntTaller.setEnabled(false);
	btnAnularEntTaller.addListener("execute", function(e){
		(new dialog.Confirm({
		        "message"   : "Desea anular el movimiento seleccionado?",
		        "callback"  : function(e){
		        					if (e) {
										var p = {};
										p.id_movimiento = rowDataMovimiento.id_movimiento;
										p.movimiento_estado = rowDataMovimiento.estado;
										
										var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
										rpc.addListener("completed", function(e){
											functionActualizarVehiculo(vehiculo.id_vehiculo, rowDataEntSal.id_entsal, rowDataMovimiento.id_movimiento);
										});
										rpc.addListener("failed", function(e){
											functionActualizar(vehiculo.id_vehiculo, rowDataEntSal.id_entsal, rowDataMovimiento.id_movimiento);
										});
										rpc.callAsyncListeners(true, "anular_entrada_taller", p);
		        					}
		        				},
		        "context"   : this,
		        "image"     : "icon/48/status/dialog-warning.png"
		})).show();
	}, this);
	gbxMovimiento.add(btnAnularEntTaller, {row: 0, column: 5});
	
	var btnImprimirEntTaller = new qx.ui.form.Button("Orden trabajo...");
	btnImprimirEntTaller.setEnabled(false);
	btnImprimirEntTaller.addListener("execute", function(e){
		window.open("services/class/comp/Impresion.php?rutina=entrada_taller&id_entsal=" + rowDataEntSal.id_entsal + "&id_movimiento=" + rowDataMovimiento.id_movimiento);
	});
	gbxMovimiento.add(btnImprimirEntTaller, {row: 0, column: 7});
	
	var btnImpConformidad = new qx.ui.form.Button("Conformidad...");
	btnImpConformidad.setEnabled(false);
	btnImpConformidad.addListener("execute", function(e){
		window.open("services/class/comp/Impresion.php?rutina=salida_vehiculo&id_entsal=" + rowDataEntSal.id_entsal + "&id_movimiento=" + rowDataMovimiento.id_movimiento);
	});
	gbxMovimiento.add(btnImpConformidad, {row: 0, column: 8});
	
	var btnEntTaller = new qx.ui.form.Button("Entrada a taller...");
	btnEntTaller.setEnabled(false);
	btnEntTaller.addListener("execute", function(e){
		application.txtClipboard.setFocusable(true);
		application.txtClipboard.setValue(txtObserva.getValue());
		application.txtClipboard.focus();
		application.txtClipboard.selectAllText();
		document.execCommand("copy");
		application.txtClipboard.setFocusable(false);
		
		var win = new vehiculos.comp.windowEntTaller(vehiculo, rowDataEntSal);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarVehiculo(vehiculo.id_vehiculo, rowDataEntSal.id_entsal, data);
			
			window.setTimeout(function(){
				window.open("services/class/comp/Impresion.php?rutina=entrada_taller&id_entsal=" + rowDataEntSal.id_entsal + "&id_movimiento=" + data);
			}, 200)
		})
		win.addListener("estado", function(e){
			functionActualizar(vehiculo.id_vehiculo, rowDataEntSal.id_entsal);
		});
		win.addListener("close", function(e){
			blocker.unblock();
		});
		desktop.add(win);
		blocker.block();
		win.center();
		win.open();
	});
	
	gbxMovimiento.add(btnEntTaller, {row: 0, column: 10});

	var btnSalTaller = new qx.ui.form.Button("Salida de taller...");
	btnSalTaller.setEnabled(false);
	btnSalTaller.addListener("execute", function(e){
		var win = new vehiculos.comp.windowSalTaller(vehiculo, rowDataMovimiento);
		win.addListener("aceptado", function(e){
			functionActualizarVehiculo(vehiculo.id_vehiculo, rowDataEntSal.id_entsal, rowDataMovimiento.id_movimiento);
		});
		win.addListener("estado", function(e){
			functionActualizar(vehiculo.id_vehiculo, rowDataEntSal.id_entsal, rowDataMovimiento.id_movimiento);
		});
		win.addListener("close", function(e){
			blocker.unblock();
		});
		desktop.add(win);
		blocker.block();
		win.center();
		win.open();
	});
	
	gbxMovimiento.add(btnSalTaller, {row: 0, column: 11});
	
	
	
	var gbxSal = new qx.ui.groupbox.GroupBox(" Reparaciones ");
	gbxSal.setLayout(new qx.ui.layout.Canvas());
	composite1.add(gbxSal, {left: 0, top: "66.5%", right: 0, bottom: 0});
	
	
	
	

	
	//Tabla

	var tableModelSal = new qx.ui.table.model.Simple();
	tableModelSal.setColumns(["Reparación", "Costo", "Cantidad", "Total"], ["reparacion", "costo", "cantidad", "total"]);
	tableModelSal.setColumnSortable(0, false);
	tableModelSal.setColumnSortable(1, false);
	tableModelSal.setColumnSortable(2, false);
	tableModelSal.setColumnSortable(3, false);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblSal = new componente.comp.ui.ramon.table.Table(tableModelSal, custom);
	//tblTotales.toggleShowCellFocusIndicator();
	tblSal.setShowCellFocusIndicator(false);
	tblSal.toggleColumnVisibilityButtonVisible();
	tblSal.toggleStatusBarVisible();
	
	tblSal.addListener("cellTap", function(e){
		var value = tableModelSal.getValue(e.getColumn(), e.getRow());
		
		application.txtClipboard.setFocusable(true);
		application.txtClipboard.setValue(String(value));
		application.txtClipboard.focus();
		application.txtClipboard.selectAllText();
		document.execCommand("copy");
		application.txtClipboard.setFocusable(false);
		tblSal.focus();
	});
	
	var tableColumnModelSal = tblSal.getTableColumnModel();
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatMontoEs);
	tableColumnModelSal.setDataCellRenderer(1, cellrendererNumber);
	tableColumnModelSal.setDataCellRenderer(3, cellrendererNumber);
	
	var resizeBehavior = tableColumnModelSal.getBehavior();
	resizeBehavior.set(0, {width:"55%", minWidth:100});
	resizeBehavior.set(1, {width:"15%", minWidth:100});
	resizeBehavior.set(2, {width:"15%", minWidth:100});
	resizeBehavior.set(3, {width:"15%", minWidth:100});
	
	var selectionModelSal = tblSal.getSelectionModel();
	selectionModelSal.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelSal.addListener("changeSelection", function(e){
		if (! selectionModelSal.isSelectionEmpty()) {
			rowDataSal = tableModelSal.getRowData(tblSal.getFocusedRow());
			
			controllerFormInfoSal.setModel(qx.data.marshal.Json.createModel(rowDataSal));
		}
	});
	
	gbxSal.add(tblSal, {left: 0, top: 0, right: 0, bottom: 0});
	
		
	},
	members : 
	{

	}
});