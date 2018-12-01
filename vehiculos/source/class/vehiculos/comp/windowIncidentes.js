qx.Class.define("vehiculos.comp.windowIncidentes",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Incidentes",
		width: 600,
		height: 500,
		showMinimize: false
		//showMaximize: false,
		//allowMaximize: false,
		//resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		lstChofer.fireDataEvent("changeSelection", []);
		cboChofer.focus();
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	//var dateFormat = qx.util.format.DateFormat.getDateInstance();
	var dateFormat = new qx.util.format.DateFormat("dd/MM/yyyy");
	
	
	
	
	var cboChofer = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Chofer", methodName: "autocompletarChoferCompleto"});
	cboChofer.setWidth(250);
	var lstChofer = cboChofer.getChildControl("list");
	lstChofer.addListener("changeSelection", function(e){
		var composite, label, txt;
		
		grid.removeAll();
		
		if (lstChofer.isSelectionEmpty()) {
			btnNuevo.setEnabled(false);
		} else {
			btnNuevo.setEnabled(true);
			
			var p = {};
			p.id_chofer = lstChofer.getModelSelection().getItem(0);

			var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Chofer");
			rpc.addListener("completed", function(e){
				var data = e.getData();

				for (var x in data.result) {
					txt = new qx.ui.form.TextArea(data.result[x].descrip);
					txt.setReadOnly(true);
					txt.setDecorator("main");
					txt.setBackgroundColor("#ffffc0");
					
					txt.setContextMenu(menu);
					txt.setUserData("datos", data.result[x]);
					txt.addListener("contextmenu", function(e){
						btnModificar.setEnabled(true);
						btnModificar.setUserData("datos", this.getUserData("datos"));
					});
					
					grid.add(txt, {row: parseInt(x), column: 1});
					
					composite = new qx.ui.container.Composite(new qx.ui.layout.VBox());
					composite.setContextMenu(menu);
					composite.setUserData("datos", data.result[x]);
					composite.addListener("contextmenu", function(e){
						btnModificar.setEnabled(true);
						btnModificar.setUserData("datos", this.getUserData("datos"));
					});
					grid.add(composite, {row: parseInt(x), column: 0});

					
					label = new qx.ui.basic.Label(dateFormat.format(data.result[x].fecha));
					label.setRich(true);
					composite.add(label, {height: "33%"});
					
					label = new qx.ui.basic.Label(data.result[x].tipo_incidente_descrip);
					label.setRich(true);
					composite.add(label, {height: "33%"});
					
					label = new qx.ui.basic.Label(data.result[x].id_usuario);
					label.setRich(true);
					composite.add(label, {height: "33%"});
				}
			}, this);
			rpc.callAsyncListeners(true, "leer_incidentes", p);
			
		}
	}, this);
	
	this.add(new qx.ui.basic.Label("Chofer:"), {left: 0, top: 3});
	this.add(cboChofer, {left: 84, top: 0});
	cboChofer.setTabIndex(1);
	
	var lblLinea = new qx.ui.basic.Label("<hr>");
	lblLinea.setRich(true);
	lblLinea.setWidth(3000);
	this.add(lblLinea, {left: 0, top: 22, right: 0});
	
	
	var gbx = new qx.ui.groupbox.GroupBox();
	gbx.setLayout(new qx.ui.layout.Grow());
	gbx.addListener("contextmenu", function(e){
		btnModificar.setEnabled(false);
	});
	this.add(gbx, {left: 0, top: 45, right: 0, bottom: 0});
	
	var layout = new qx.ui.layout.Grid(10, 10);
	layout.setColumnFlex(1, 1);
	var grid = new qx.ui.container.Composite(layout);
	var scroll = new qx.ui.container.Scroll(grid);
	gbx.add(scroll);
	
	//var txt = new qx.ui.form.TextArea();
	//txt.setReadOnly(true);
	//txt.setDecorator("main");
	//txt.setBackgroundColor("#ffffc0");
	
	//gbx.add(txt);
	

	/*
	aux = new qx.ui.form.TextArea();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	*/
	
	
	// Menu
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	
	var btnNuevo = new qx.ui.menu.Button("Nuevo incidente...");
	btnNuevo.addListener("execute", function(e){
		var win = new vehiculos.comp.windowIncidente(lstChofer.getModelSelection().getItem(0));
		win.addListener("aceptado", function(e){
			lstChofer.fireDataEvent("changeSelection", lstChofer.getSelection());
		});
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	menu.add(btnNuevo);
	
	var btnModificar = new qx.ui.menu.Button("Modificar incidente...");
	btnModificar.addListener("execute", function(e){
		var win = new vehiculos.comp.windowIncidente(lstChofer.getModelSelection().getItem(0), btnModificar.getUserData("datos"));
		win.addListener("aceptado", function(e){
			lstChofer.fireDataEvent("changeSelection", lstChofer.getSelection());
		});
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	menu.addSeparator();
	menu.add(btnModificar);
	
	menu.memorizar();
	
	gbx.setContextMenu(menu);
	
	
	
	
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});