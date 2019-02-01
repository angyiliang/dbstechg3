

// public facing function to start  plotting temperature graphs
function get_temperature(startDate, endDate, hlevel, showMonth, customData=null){

    var start = moment(startDate);
    var end = moment(endDate);

    $.getJSON("./data/temperature.json", function(json) {
        
        compare_disease_temperature(start, end, hlevel, json, showMonth, customData);
        
    });
}

function compare_disease_temperature(startDate, endDate, hlevel, temperature, showMonth, customData){
    
    var start = moment(startDate);
    var end = moment(endDate);
    var compiledData;
    var compiledTemperature = CompileTemperature(temperature, start, end, showMonth);
    
    let data = $.getJSON("./data/sort_by_date.json", function(json) {
        
        if( hlevel == 0){
            compiledData = CompileAllDiseasesForTemperature(json, start, end, showMonth, customData);
        } else if (hlevel == 1){
            compiledData = CompileDiseaseCategoryForTemperature(json, start, end, showMonth, customData);
        } else if (hlevel == 2){
            compiledData = CompileDiseaseNameForTemperature(json, start, end, showMonth, customData);
        }

        reload_temperature_graph(start, end, compiledData, compiledTemperature, showMonth);
    });
}

function getColorFromIndex(index){
    colors = [
        "#66b598", "#ce7d78", "#ea9e70", "#a48a9e", "#648177" ,"#0d5ac1" ,
        "#f205e6" ,"#1c0365" ,"#14a9ad" ,"#4ca2f9" ,"#a4e43f" ,"#d298e2" ,"#6119d0",
        "#d2737d" ,"#c0a43c" ,"#f2510e" ,"#651be6" ,"#79806e" ,"#61da5e" ,"#cd2f00" ,
        "#9348af" ,"#01ac53" ,"#c5a4fb" ,"#996635","#b11573" ,"#4bb473" ,"#75d89e" ,
        "#2f3f94" ,"#2f7b99" ,"#da967d" ,"#34891f" ,"#b0d87b" ,"#ca4751" ,"#7e50a8" ,
        "#c4d647" ,"#e0eeb8" ,"#11dec1" ,"#289812" ,"#566ca0" ,"#66dbe1" ,"#2f1179" ,
        "#935b6d" ,"#916988" ,"#513d98" ,"#aead3a", "#9e6d71", "#4b5bdc", "#0cd36d",
        "#250662", "#cb5bea", "#228916", "#ac3e1b", "#df514a", "#539397", "#880977",];

    return hexToRgbA(colors[index]);
}

function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.8)';
    }
}

function reload_temperature_graph(startDate, endDate, compiledData, compiledTemperature, showMonth){
    
    var diseaseData = compiledData["diseaseData"]
    var start = moment(startDate);
    var end = moment(endDate);
    var highest = compiledData["highest"];

    var option = {
        scales: {
            yAxes: [{
                ticks :{
                    suggestedMin: 0
                }
            }]
        }
    };


    var selectedMonths = [];
    // Get the context of the canvas element we want to select
    $("#graph-container").children().remove();
    $("#graph-container").append(`<div id="temperature-container" style="width: 75%">
    <canvas id="temperature-canvas"></canvas>
</div>

<div id="disease-container" style="width: 75%">
    <canvas id="disease-canvas"></canvas>
</div>`);


    var disease_ctx = document.getElementById("disease-canvas").getContext("2d");
    var temperature_ctx = document.getElementById("temperature-canvas").getContext("2d");

    // set chart settings
    Chart.defaults.global.elements.line.fill = false;
    
    if(showMonth){ // show by months
        // generate x labels and highlights
        while (end > start || start.format('M') === end.format('M')) {
            // collate all selected months for graph plotting
            selectedMonths.push(start.format('MMM/YY'));
            start.add(1,'month');
        }
    } else { // show only years
        while(end > start || start.format('Y') === end.format('Y')){
            // collate all selected months for graph plotting
            selectedMonths.push(start.format('YYYY'));
            start.add(1,'year');
        }
    }

    var compiledData = []
    var temperatureGraphData = []
    
    temperatureGraphData.push({
        label: "Temperature",
        data: compiledTemperature,
        backgroundColor: "rgba(102,181,152,0.4)",
        borderColor:"rgba(102,181,152,0.4)"
    });

    for ( disease in diseaseData){
        let newData = {
            label: disease,
            data: diseaseData[disease],
            type: 'line',
            backgroundColor:getColorFromIndex(compiledData.length + 1),
            borderColor:getColorFromIndex(compiledData.length + 1)
        }
        compiledData.push(newData);
    }

    var diseaseChart = new Chart(disease_ctx, {
        type: 'line',
        data: {
          datasets: compiledData,
          labels: selectedMonths
        },
        options: option
    });

    var temperatureChart = new Chart(temperature_ctx, {
        type: 'line',
        data: {
          datasets: temperatureGraphData,
          labels: selectedMonths
        }
    });

}

function CompileTemperature(jsonData, start, end){
    var compiled = [];

    var years = [];
    var months = [];

    for (var i = 2012; i <= 2017; i++) {years.push(i);}
    for (var i = 0; i < 12; i++) {months.push(i);}

    years.forEach(function(year){
        if ( moment().year(year).isBetween(start,end,"year",'[]')){
            months.forEach(function(month){
                if ( moment().month(month).year(year).isBetween(start,end,"month",'[]')){

                    compiled.push(jsonData[year][month]);

                }
            });
        }
    });
    return compiled;
    
}

function CompileAllDiseasesForTemperature(jsonData, start, end, showMonth, customData){
    var compiled = {};
    var years = [];
    var months = [];
    var highest = 0;

    for (var i = 2012; i <= 2017; i++) {years.push(i);}
    for (var i = 1; i <= 12; i++) {months.push(i);}

    if( showMonth ){
        years.forEach(function(year){
            if ( moment().year(year).isBetween(start,end,"year",'[]')){
                months.forEach(function(month){
                    if ( moment().month(month).year(year).isBetween(start,end,"month",'[]')){
                        if(compiled['All Diseases'] == null ){
                            compiled['All Diseases'] = []
                        }
                        compiled['All Diseases'].push(jsonData[year][month]["total"]);
    
                        // setting the highest value
                        if ( highest < jsonData[year][month]["total"]){
                            highest = jsonData[year][month]["total"];
                        }
                        
                    }
                });
            }
        });
    } else { // show only the years
        years.forEach(function(year){
            if ( moment().year(year).isBetween(start,end,"year",'[]')){
                if(compiled['All Diseases'] == null ){
                    compiled['All Diseases'] = []
                }
                compiled['All Diseases'].push(jsonData[year]["total"]);

                // setting the highest value
                if ( highest < jsonData[year]["total"]){
                    highest = jsonData[year]["total"];
                }
            }
        });
    }
    return {"diseaseData":compiled, "highest":highest};
}

function CompileDiseaseCategoryForTemperature(jsonData, start, end, showMonth, customData){
    var compiled = {};
    var years = [];
    var months = [];
    var highest = 0;

    for (var i = 2012; i <= 2017; i++) {years.push(i);}
    for (var i = 1; i <= 12; i++) {months.push(i);}

    if( showMonth ){
        years.forEach(function(year){
            if ( moment().year(year).isBetween(start,end,"year",'[]')){
                months.forEach(function(month){
                    if ( moment().month(month).year(year).isBetween(start,end,"month",'[]')){
                        for ( category in jsonData[year][month]){
                            if(category == 'total'){ continue; }
                            
                            if(customData != null && !customData.includes(category)) {
                                continue; 
                            }

                            if(compiled[category] == null ){
                                compiled[category] = []
                            }
                            compiled[category].push(jsonData[year][month][category]["total"]);      
    
                            // setting the highest value
                            if ( highest < jsonData[year][month][category]["total"]){
                                highest = jsonData[year][month][category]["total"];
                            }
                        }
                    }
                });
            }
        });
    } else { // show category by year
        var compileAllCategoryByYear = {};
        var allCategoryNames = [];
        years.forEach(function(year){
            if ( moment().year(year).isBetween(start,end,"year",'[]')){
                compileAllCategoryByYear[year] = {};
                months.forEach(function(month){
                    if ( moment().month(month).year(year).isBetween(start,end,"month",'[]')){
                        for ( category in jsonData[year][month]){
                            if(category == 'total'){ continue; }

                            if(customData != null && !customData.includes(category)) {
                                continue; 
                            }

                            if(!allCategoryNames.includes(category)) {
                                allCategoryNames.push(category)
                            }
    
                            if(compileAllCategoryByYear[year][category] == null ){
                                compileAllCategoryByYear[year][category] = 0
                            }
                            compileAllCategoryByYear[year][category] += (jsonData[year][month][category]["total"]);      
                        }
                    }
                });
            }
        });
        allCategoryNames.forEach(function(category){
            for ( year in compileAllCategoryByYear){
                if(compiled[category] == null ){
                    compiled[category] = [];
                }
                compiled[category].push(compileAllCategoryByYear[year][category]);      

                // setting the highest value
                if ( highest < compileAllCategoryByYear[year][category]){
                    highest = compileAllCategoryByYear[year][category];
                }
            }
        });
    }
    
    return {"diseaseData":compiled, "highest":highest};
}

function CompileDiseaseNameForTemperature(jsonData, start, end, showMonth, customData){
    var compiled = {};
    var years = [];
    var months = [];
    var highest = 0;

    for (var i = 2012; i <= 2017; i++) {years.push(i);}
    for (var i = 1; i <= 12; i++) {months.push(i);}

    
    if(showMonth){
        years.forEach(function(year){
            if ( moment().year(year).isBetween(start,end,"year",'[]')){
                months.forEach(function(month){
                    if ( moment().month(month).year(year).isBetween(start,end,"month",'[]')){
                        for ( category in jsonData[year][month]){
                            if(category == 'total'){ continue; }
                            for( disease in jsonData[year][month][category]){
                                if ( disease == "total") { continue; }

                                if(customData != null && !customData.includes(disease)) {
                                    continue; 
                                }
                                
                                if(compiled[disease] == null ){
                                    compiled[disease] = []
                                }
                                compiled[disease].push(jsonData[year][month][category][disease]);

                                // setting the highest value
                                if ( highest < jsonData[year][month][category][disease]){
                                    highest = jsonData[year][month][category][disease];
                                }
                            } 
                        }
                    }
                });
            }
        });
    } else { // show disease names by year
        var compileAllDiseaseByYear = {};
        var allDiseaseNames = [];
        years.forEach(function(year){
            if ( moment().year(year).isBetween(start,end,"year",'[]')){
                compileAllDiseaseByYear[year] = {};
                months.forEach(function(month){
                    if ( moment().month(month).year(year).isBetween(start,end,"month",'[]')){
                        for ( category in jsonData[year][month]){
                            if(category == 'total'){ continue; }
                            for( disease in jsonData[year][month][category]){
                                if ( disease == "total") { continue; }

                                if(customData != null && !customData.includes(disease)) {
                                    continue; 
                                }

                                if(!allDiseaseNames.includes(disease)) {
                                    allDiseaseNames.push(disease)
                                }
                                
                                if(compileAllDiseaseByYear[year][disease] == null ){
                                    compileAllDiseaseByYear[year][disease] = 0
                                }

                                compileAllDiseaseByYear[year][disease] += (jsonData[year][month][category][disease]);

                            } 
                        }
                    }
                });
            }
        });

        allDiseaseNames.forEach(function(disease){
            for ( year in compileAllDiseaseByYear){
                if(compiled[disease] == null ){
                    compiled[disease] = [];
                }
                compiled[disease].push(compileAllDiseaseByYear[year][disease]);      

                // setting the highest value
                if ( highest < compileAllDiseaseByYear[year][disease]){
                    highest = compileAllDiseaseByYear[year][disease];
                }
            }
        });
    }
    return {"diseaseData":compiled, "highest":highest};
}
