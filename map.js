require ([
    "esri/map",

    "esri/layers/FeatureLayer",

    "esri/tasks/ServiceAreaTask",
    "esri/tasks/ServiceAreaParameters",
    "esri/tasks/ServiceAreaSolveResult",

    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",

    "esri/tasks/query",
    "esri/tasks/QueryTask",

    "esri/graphic",
    "esri/tasks/FeatureSet",

    "dojo/domReady!"
], 
    //cargar mapa Madrid
    function(Map,
        FeatureLayer,
        ServiceAreaTask, ServiceAreaParameters, ServiceAreaSolveResult,
        SimpleFillSymbol, SimpleLineSymbol, Color,
        Query, QueryTask,
        Graphic, FeatureSet){
        var map = new Map("divMap", {
            basemap: "topo",
            center: [-3.702, 40.418],
            zoom: 12
        })

        //cargar capa centros de salud
        var urlCentrosSalud = "https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/CENTROS_SALUD_SGA/FeatureServer/0?token=zwLuDJmMLkdH5cpiKf1vPXOqif4M0Bl4VgW_CU_iMsk8C5KhP7_dIKF0Cstm-HhjywEg0fEJJyBRzMvSImg_EP1yKBeB43Tw2CaM6aKEyT2tsgt1QY3U6T0YhzVhVFCq0KqUEbjyZgn9afbov-7NU8EiklXpQdt9wASbguS6F8KiENQH4VJehAfHUFhQNDDpaQwoHVnnR8tVg6hLO9w3WnOE6jG3BiOcGyvaSYedO1XJUc3oQkEZkmdWOKFl1Urh"

        var centrosSalud = new FeatureLayer(urlCentrosSalud);

        //añadir al mapa
        map.addLayer(centrosSalud);

        var queryTask = new QueryTask(urlCentrosSalud);

        var query = new Query();
        query.outFields = ['*'];
        query.where = "1 = 1";
        query.returnGeometry = true;
        centrosSalud.selectFeatures(query);

        queryTask.execute(query);

        centrosSalud.on('selection-complete', serviceArea);        
        
        function serviceArea() {

            var features = [];

            //definición de parámetros ServiceAreaTask
            var parametros = new ServiceAreaParameters();
            console.log("parametros", parametros);

            parametros.defaultBreaks = [1, 2, 3];

            var facilities = new FeatureSet();
            facilities.features = features;
            parametros.facilities = facilities;

            parametros.impedanceAttribute = "TiempoPie";

            //service area task
            var serviceAreaTask = new ServiceAreaTask("https://formacion.esri.es/server/rest/services/RedMadrid/NAServer/Service%20Area");

            serviceAreaTask.solve(parametros, function (resultado) {
                var simbPoligono = new new SimpleFillSymbol(
                    "solid",
                    new SimpleLineSymbol("solid", new Color([232, 104, 80]), 2),
                    new Color([232, 104, 80, 0.25])
                );

                arrayUtils.forEach(resultado.serviceAreaPolygons, function (final) {
                    final.setSymbol(simbPoligono);
                    map.graphics.add(final);
                })
            })            

    }
        
    });
