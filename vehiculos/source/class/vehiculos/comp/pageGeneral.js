qx.Class.define("vehiculos.comp.pageGeneral",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('General');
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		txtBuscar.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	var rowDataGral;
	
	
	var functionActualizarGral = this.functionActualizarGral = function(){
		var p = {};
		p.ver = radioGroup.getSelection()[0].getUserData("datos");
		//alert(qx.lang.Json.stringify(p, null, 2));

		var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
		rpc.mostrar = false;
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			tableModelGral.setDataAsMapArray(data.result.gral, true);
			tblGral.setAdditionalStatusBarText(data.result.statusBarText);
		});
		
		rpc.callAsyncListeners(true, "leer_gral", p);
	};
	
	var functionBuscar = function(keySequence){
		var value = txtBuscar.getValue().trim().toUpperCase();
		
		if (value.length >=2) {
			var desde;
			
			if (keySequence == null) {
				desde = 0;
				tblGral.setFocusedCell();
			} else if (! keySequence.isPrintable() && keySequence.getKeyIdentifier() == "Enter") {
				var focusedRow = tblGral.getFocusedRow();
				desde = (focusedRow == null) ? 0 : focusedRow + 1;				
			}
			
			var rowData;
			var rowCount = tableModelGral.getRowCount();
			
			for (var x = desde; x < rowCount; x++) {
				rowData = tableModelGral.getRowData(x);
				if (rowData["vehiculo"].includes(value)) {
					tblGral.setFocusedCell(0, x, true);
					
					break;
				}
			}
		} else {
			tblGral.setFocusedCell();
		}
	};
	
	

	var txtBuscar = new qx.ui.form.TextField("");
	txtBuscar.setWidth(150);
	txtBuscar.setLiveUpdate(true);
	txtBuscar.addListener("changeValue", function(e){
		functionBuscar();
	})
	txtBuscar.addListener("keypress", function(e){
		functionBuscar(e);
	})
	this.add(txtBuscar, {left: 40, top: 0});
	this.add(new qx.ui.basic.Label("Buscar:"), {left: 0, top: 3});
	
	
	
	
	
	var aux;
	
	var radioGroup = new qx.ui.form.RadioGroup();
	
	var mnuTaller = new qx.ui.menu.Menu();
	
	var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("autocompletarTaller", {texto: ""});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	for (var x = 0; x < resultado.length; x++) {
		aux = new qx.ui.menu.RadioButton(resultado[x].label);
		aux.setUserData("datos", resultado[x].model)
		mnuTaller.add(aux);
		radioGroup.add(aux);
	}
	
	var mnuVer = new qx.ui.menu.Menu();
	
	aux = new qx.ui.menu.RadioButton("Todos");
	aux.setUserData("datos", "Todos");
	aux.setValue(true);
	mnuVer.add(aux);
	radioGroup.add(aux);
	
	aux = new qx.ui.menu.RadioButton("Entrada");
	aux.setUserData("datos", "Entrada");
	mnuVer.add(aux);
	radioGroup.add(aux);
	
	aux = new qx.ui.menu.RadioButton("Taller", mnuTaller);
	aux.setUserData("datos", "Taller");
	mnuVer.add(aux);
	radioGroup.add(aux);
	
	aux = new qx.ui.menu.RadioButton("Asunto");
	aux.setUserData("datos", "Asunto");
	mnuVer.add(aux);
	radioGroup.add(aux);
	
	aux = new qx.ui.menu.RadioButton("Diferido");
	aux.setUserData("datos", "Diferido");
	mnuVer.add(aux);
	radioGroup.add(aux);
	
	radioGroup.addListener("changeSelection", function(e){
		var data = e.getData();
		mnbVer.setLabel(data[0].getLabel());
		
		functionActualizarGral();
	});
	
	
	
	var mnbVer = new qx.ui.form.MenuButton("Todos", "qx/decoration/Simple/arrows/down.gif", mnuVer);
	mnbVer.setWidth(400);
	this.add(mnbVer, {left: 250, top: 0});
	
	
	
	
	
	/*
	var slbVer_taller = new qx.ui.form.SelectBox();
	slbVer_taller.setWidth(300);
	slbVer_taller.add(new qx.ui.form.ListItem("Todos", null, "-1"));
	

	var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("autocompletarTaller", {texto: ""});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	for (var x = 0; x < resultado.length; x++) {
		slbVer_taller.add(new qx.ui.form.ListItem(resultado[x].label, null, resultado[x].model));
	}

	
	slbVer_taller.addListener("changeSelection", function(e){
		functionActualizarGral();
	});
	this.add(slbVer_taller, {left: 400, top: 0});
	*/

	
	
	/*
	var slbVer = new qx.ui.form.SelectBox();
	slbVer.add(new qx.ui.form.ListItem("Todos", null, "Todos"));
	slbVer.add(new qx.ui.form.ListItem("Entrada", null, "Entrada"));
	slbVer.add(new qx.ui.form.ListItem("Taller", null, "Taller"));
	slbVer.add(new qx.ui.form.ListItem("Asunto", null, "Asunto"));
	slbVer.add(new qx.ui.form.ListItem("Diferido", null, "Diferido"));
	slbVer.addListener("changeSelection", function(e){
		functionActualizarGral();
	});
	this.add(slbVer, {left: 400, top: 0});
	*/

	this.add(new qx.ui.basic.Label("Ver:"), {left: 220, top: 3});
	
	
	var btnImprimir = new qx.ui.form.Button("Imprimir...");
	btnImprimir.addListener("execute", function(e){
		window.open("services/class/comp/Impresion.php?rutina=general&ver=" + radioGroup.getSelection()[0].getUserData("datos"));
	});
	this.add(btnImprimir, {left: 750, top: 0});
	
	

	

	
	
	// Menu
	
	var commandVer = new qx.ui.command.Command("Enter");
	commandVer.setEnabled(false);
	commandVer.addListener("execute", function(e){
		tblGral.setEnabled(false);
		
		var p = {};
		p.texto = rowDataGral.nro_patente;
		
		var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
		rpc.addListener("completed", function(e){
			var data = e.getData();

			var pageParticular = new vehiculos.comp.pageParticular();
			application.tabviewMain.addAt(pageParticular, application.tabviewMain.getChildren().length - 1);
			application.tabviewMain.setSelection([pageParticular]);
			
			var listItem = new qx.ui.form.ListItem(data.result[0].label, null, data.result[0].model);
			listItem.setUserData("datos", data.result[0]);
			pageParticular.lstVehiculo.add(listItem);
			
			pageParticular.lstVehiculo.setSelection([listItem]);
			pageParticular.cboVehiculo.selectAllText();
			tblGral.setEnabled(true);
		});
		
		rpc.callAsyncListeners(true, "autocompletarVehiculo", p);
	});
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	
	var btnVer = new qx.ui.menu.Button("Ver", null, commandVer);
	menu.add(btnVer);
	menu.memorizar();
	
	

	
	//Tabla

	var tableModelGral = new qx.ui.table.model.Simple();
	tableModelGral.setColumns(["Vehículo", "Dependencia", "Entrada", "Salida", "Estado", "Asunto", "Diferido"], ["vehiculo", "dependencia", "f_ent", "f_sal", "estado", "asunto", "diferido"]);
	tableModelGral.setColumnSortable(0, false);
	tableModelGral.setColumnSortable(1, false);
	tableModelGral.setColumnSortable(2, false);
	tableModelGral.setColumnSortable(3, false);
	tableModelGral.setColumnSortable(4, false);
	tableModelGral.setColumnSortable(5, false);
	tableModelGral.setColumnSortable(6, false);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblGral = new componente.comp.ui.ramon.table.Table(tableModelGral, custom);
	//tblTotales.toggleShowCellFocusIndicator();
	tblGral.setShowCellFocusIndicator(false);
	tblGral.toggleColumnVisibilityButtonVisible();
	//tblGral.toggleStatusBarVisible();
	tblGral.setContextMenu(menu);
	tblGral.addListener("cellDbltap", function(e){
		commandVer.execute();
	})
	
	var tableColumnModelGral = tblGral.getTableColumnModel();
	
	var cellrendererDate = new qx.ui.table.cellrenderer.Date();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd HH:mm:ss"));
	tableColumnModelGral.setDataCellRenderer(2, cellrendererDate);
	tableColumnModelGral.setDataCellRenderer(3, cellrendererDate);
	
	var cellrendererReplace = new qx.ui.table.cellrenderer.Replace();
	cellrendererReplace.setReplaceMap({
		"E": "Entrada",
		"S": "Salida",
		"T": "Taller"
	});
	tableColumnModelGral.setDataCellRenderer(4, cellrendererReplace);
	
	var cellrendererReplace = new qx.ui.table.cellrenderer.Replace();
	cellrendererReplace.setReplaceMap({
		"true": "En trámite",
		"false": ""
	});
	tableColumnModelGral.setDataCellRenderer(5, cellrendererReplace);
	tableColumnModelGral.setDataCellRenderer(6, cellrendererReplace);
	
	
	var resizeBehavior = tableColumnModelGral.getBehavior();
	resizeBehavior.set(0, {width:"19%", minWidth:100});
	resizeBehavior.set(1, {width:"30%", minWidth:100});
	resizeBehavior.set(2, {width:"15%", minWidth:100});
	resizeBehavior.set(3, {width:"15%", minWidth:100});
	resizeBehavior.set(4, {width:"7%", minWidth:100});
	resizeBehavior.set(5, {width:"7%", minWidth:100});
	resizeBehavior.set(6, {width:"7%", minWidth:100});
	
	
	var selectionModelGral = tblGral.getSelectionModel();
	selectionModelGral.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelGral.addListener("changeSelection", function(e){
		var selectionEmpty = selectionModelGral.isSelectionEmpty();
		commandVer.setEnabled(! selectionEmpty);
		menu.memorizar([commandVer]);
		
		if (! selectionEmpty) rowDataGral = tableModelGral.getRowData(tblGral.getFocusedRow());
	});
	
	this.add(tblGral, {left: 0, top: 30, right: 0, bottom: 0});
	
	
	
	
	
	functionActualizarGral();

		
	},
	members : 
	{

	}
});