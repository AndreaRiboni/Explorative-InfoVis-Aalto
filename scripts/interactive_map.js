am5.ready(function() {
    // Create root
    var root = am5.Root.new("chartdiv");

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    var chart = root.container.children.push(am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoMercator()
    }));

    // Create polygon series
    var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        valueField: "value",
        calculateAggregates: true
    }));

    polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}: {value}"
    });

    polygonSeries.set("heatRules", [{
        target: polygonSeries.mapPolygons.template,
        dataField: "value",
        min: am5.color(0xff621f),
        max: am5.color(0x661f00),
        key: "fill"
    }]);

    // Function to read the CSV file and convert it to countryData format
    function readCSVAndConvertToCountryData(csvFile) {
        Papa.parse(csvFile, {
            download: true,
            header: true,
            complete: function(results) {
                var countryData = results.data.map(function(row) {
                    return {
                        id: row["Country"],
                        value: parseFloat(row["Required Time Log"])
                    };
                });
                polygonSeries.data.setAll(countryData);
            }
        });

    // Function to handle click events on countries
    function handleCountryClick(ev) {
        var dataItem = ev.target.dataItem;
        var countryName = dataItem.dataContext.name;
        var countryValue = dataItem.dataContext.value;

        if (countryValue){
            console.log("Country: " + countryName + ", Value: " + countryValue);
            document.getElementById("value").innerHTML = countryValue;
            document.getElementById('value').click();
        }
    }

      // Add click event listener to the map polygons
      polygonSeries.mapPolygons.template.events.on("click", handleCountryClick);
    }

    // Load and process data
    readCSVAndConvertToCountryData('https://reebo.it/explorative/data/explorative_dataset.csv');

    // Make stuff animate on load
    chart.appear(1000, 100);
  });
