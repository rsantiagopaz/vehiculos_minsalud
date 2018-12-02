/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "vehiculos"
 *
 * @asset(vehiculos/*)
 * @asset(qx/icon/Tango/48/status/dialog-information.png)
 */
qx.Class.define("vehiculos.Application",
{
  extend : qx.application.Standalone,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */







      // Document is the application root
      var doc = this.getRoot();
	
      doc.set({blockerColor: '#bfbfbf', blockerOpacity: 0.4});
      
      this.perfil = "063001";
    
      
      var win = new vehiculos.comp.windowLogin();
      win.setModal(true);
      win.addListenerOnce("appear", function(e){
        win.center();
      });
      win.addListener("aceptado", function(e){
        var data = e.getData();
        
        this.login = data;
        //alert(qx.lang.Json.stringify(data, null, 2));
        
        this._InitAPP();
      }, this)
      //doc.add(win);
      //win.center();
      win.open();
      
        },
        
      _InitAPP : function ()
      {
        
          // Document is the application root
      var doc = this.getRoot();
      doc.set({blockerColor: '#bfbfbf', blockerOpacity: 0.4});
      
      
	var loading = this.loading = new componente.comp.ui.ramon.image.Loading("vehiculos/loading66.gif");
	
	vehiculos.comp.rpc.Rpc.LOADING = loading;
	
	
	
	
	var popupGrabado = this.popupGrabado = new qx.ui.popup.Popup(new qx.ui.layout.Basic());
	popupGrabado.setPadding(10, 10, 10, 10);
	popupGrabado.setPosition("bottom-center");
	popupGrabado.setOffsetTop(-110);
	popupGrabado.add(new qx.ui.basic.Atom("Grabado correctamente", "qx/icon/Tango/48/status/dialog-information.png"), {left: 0, top: 0});
	popupGrabado.addListener("appear", function(e){
		window.setTimeout(function(e){
			popupGrabado.hide();
		}, 2000);
	});
      
      
      
      var p = {};
      p.organismo_area_id = this.login.organismo_area_id;
      
      var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
      try {
        var resultado = rpc.callSync("leer_parque", p);
      } catch (ex) {
        alert("Sync exception: " + ex);
      }
      
      //alert(qx.lang.Json.stringify(resultado, null, 2));
      
      
      
      var numberformatMontoEs = this.numberformatMontoEs = new qx.util.format.NumberFormat("es");
      numberformatMontoEs.setGroupingUsed(true);
      numberformatMontoEs.setMaximumFractionDigits(2);
      numberformatMontoEs.setMinimumFractionDigits(2);
      
      var numberformatMontoEn = this.numberformatMontoEn = new qx.util.format.NumberFormat("en");
      numberformatMontoEn.setGroupingUsed(false);
      numberformatMontoEn.setMaximumFractionDigits(2);
      numberformatMontoEn.setMinimumFractionDigits(2);
      
      var numberformatEntero = this.numberformatEntero = new qx.util.format.NumberFormat("en");
      numberformatEntero.setGroupingUsed(false);
      numberformatEntero.setMaximumFractionDigits(0);
      numberformatEntero.setMinimumFractionDigits(0);
      
      
      var contenedorMain = new qx.ui.container.Composite(new qx.ui.layout.Grow());
      var tabviewMain = this.tabviewMain = new qx.ui.tabview.TabView();
      
      //contenedorMain.add(tabviewMain);
      
      
      var mnuArchivo = new qx.ui.menu.Menu();
      var btnAcercaDe = new qx.ui.menu.Button("Acerca de...");
      btnAcercaDe.addListener("execute", function(){
        var win = new vehiculos.comp.windowAcercaDe();
        win.setModal(true);
        doc.add(win);
        win.center();
        win.open();
      });
      mnuArchivo.add(btnAcercaDe);
      
      
      var mnuEdicion = new qx.ui.menu.Menu();
      
      var btnNuevoVehiculo = new qx.ui.menu.Button("Vehículos...");
      btnNuevoVehiculo.addListener("execute", function(){
        var win = new vehiculos.comp.windowVehiculo();
        win.setModal(true);
        doc.add(win);
        win.center();
        win.open();
      });
      mnuEdicion.add(btnNuevoVehiculo);
      
      var btnNuevoChofer = new qx.ui.menu.Button("Choferes...");
      //btnNuevoChofer.setEnabled(false);
      btnNuevoChofer.addListener("execute", function(){
        var win = new vehiculos.comp.windowChofer();
        win.setModal(true);
        doc.add(win);
        win.center();
        win.open();
      });
      mnuEdicion.add(btnNuevoChofer);
      
      var btnIncidentes = new qx.ui.menu.Button("Incidentes...");
      //btnIncidentes.setEnabled(false);
      btnIncidentes.addListener("execute", function(){
        var win = new vehiculos.comp.windowIncidentes();
        win.setModal(true);
        doc.add(win);
        win.center();
        win.open();
      });
      mnuEdicion.add(btnIncidentes);
      
      var btnParamet = new qx.ui.menu.Button("Parámetros...");
      btnParamet.addListener("execute", function(){
        var win = new vehiculos.comp.windowParametro();
        win.setModal(true);
        doc.add(win);
        win.center();
        win.open();
      });
      mnuEdicion.addSeparator();
      mnuEdicion.add(btnParamet);
      
      var btnParque = new qx.ui.menu.Button("Parque...");
      btnParque.setEnabled(false);
      btnParque.addListener("execute", function(){
        var win = new vehiculos.comp.windowParque();
        win.setModal(true);
        doc.add(win);
        win.center();
        win.open();
      });
      mnuEdicion.add(btnParque);
      
    
      var mnuVer = new qx.ui.menu.Menu();
      
      var btnListado = new qx.ui.menu.Button("Listado...");
      btnListado.addListener("execute", function(){
        var win = new vehiculos.comp.windowListado();
        win.setModal(true);
        doc.add(win);
        win.center();
        win.open();
      });
      mnuVer.add(btnListado);
      
    
      
    
      var mnuSesion = new qx.ui.menu.Menu();
    
      var btnCerrar = new qx.ui.menu.Button("Cerrar");
      btnCerrar.addListener("execute", function(e){
        //var rpc = new qx.io.remote.Rpc("services/", "comp.turnos.login");
        //var result = rpc.callSync("Logout");
        location.reload(true);
      });
      mnuSesion.add(btnCerrar);
      
        
      var mnubtnArchivo = new qx.ui.toolbar.MenuButton('Archivo');
      var mnubtnEdicion = new qx.ui.toolbar.MenuButton('Edición');
      var mnubtnVer = new qx.ui.toolbar.MenuButton('Ver');
      var mnubtnSesion = new qx.ui.toolbar.MenuButton('Sesión');
    
      
      mnubtnArchivo.setMenu(mnuArchivo);
      mnubtnEdicion.setMenu(mnuEdicion);
      mnubtnVer.setMenu(mnuVer);
      mnubtnSesion.setMenu(mnuSesion);
        
      
      var toolbarMain = new qx.ui.toolbar.ToolBar();
      toolbarMain.add(mnubtnArchivo);
      toolbarMain.add(mnubtnEdicion);
      toolbarMain.add(mnubtnVer);
      toolbarMain.add(mnubtnSesion);
      toolbarMain.addSpacer();
      
      
      
      doc.add(toolbarMain, {left: 5, top: 0, right: "50%"});
      
      doc.add(new qx.ui.basic.Label("Org/Area: " + this.login.label), {left: "51%", top: 5});
      doc.add(new qx.ui.basic.Label("Usuario: " + this.login.usuario), {left: "51%", top: 25});
      
      
      var txtClipboard = this.txtClipboard = new qx.ui.form.TextArea("");
      txtClipboard.setFocusable(false);
      doc.add(txtClipboard, {left: 10, top: 80});
      
      
      //doc.add(contenedorMain, {left: 0, top: 33, right: 0, bottom: 0});
      doc.add(tabviewMain, {left: 0, top: 33, right: 0, bottom: 0});
      
      var pageGeneral = this.pageGeneral = new vehiculos.comp.pageGeneral();
      tabviewMain.add(pageGeneral);
      tabviewMain.setSelection([pageGeneral]);
      
      //var pageParticular = new vehiculos.comp.pageParticular();
      //tabviewMain.add(pageParticular);
      
      var pageMas = new qx.ui.tabview.Page("+");
      pageMas.addListener("appear", function(e){
        tabviewMain.setSelection([pageGeneral]);
      });
      var button = pageMas.getChildControl("button");
      button.addListener("execute", function(e){
        var pageParticular = new vehiculos.comp.pageParticular();
        tabviewMain.addAt(pageParticular, tabviewMain.getChildren().length - 1);
        tabviewMain.setSelection([pageParticular]);
      });	
      tabviewMain.add(pageMas);
      
      var timer = qx.util.TimerManager.getInstance();
      timer.start(pageGeneral.functionActualizarGral, 30000);
      
      
      }
      }
    });
    