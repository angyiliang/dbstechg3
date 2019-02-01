
function get_holiday_calendar(startDate, endDate, hlevel, showMonth, customData=null){

    var start = moment(startDate).format("Y");
    var showMonth = true;
    var end = moment(endDate).format("Y");
    var compiledData;
    let data = $.getJSON("./data/sort_by_date.json", function(json) {
        
        if( hlevel == 0){
            compiledData = CompileAllDiseasesForCalendar(json, start, end, showMonth, customData);
        } else if (hlevel == 1){
            compiledData = CompileDiseaseCategoryForCalendar(json, start, end, showMonth, customData)
        } else if (hlevel == 2){
            compiledData = CompileDiseaseNameForCalendar(json, start, end, showMonth, customData);
        }

        reload_holiday_calendar(start, end, compiledData, showMonth, customData);

    });
}

function getNumberOfColors(count){
    if(count == 0){
        count = 1;
    }
    colors = [
        "#66b598", "#ce7d78", "#ea9e70", "#a48a9e", "#648177" ,"#0d5ac1" ,
        "#f205e6" ,"#1c0365" ,"#14a9ad" ,"#4ca2f9" ,"#a4e43f" ,"#d298e2" ,"#6119d0",
        "#d2737d" ,"#c0a43c" ,"#f2510e" ,"#651be6" ,"#79806e" ,"#61da5e" ,"#cd2f00" ,
        "#9348af" ,"#01ac53" ,"#c5a4fb" ,"#996635","#b11573" ,"#4bb473" ,"#75d89e" ,
        "#2f3f94" ,"#2f7b99" ,"#da967d" ,"#34891f" ,"#b0d87b" ,"#ca4751" ,"#7e50a8" ,
        "#c4d647" ,"#e0eeb8" ,"#11dec1" ,"#289812" ,"#566ca0" ,"#66dbe1" ,"#2f1179" ,
        "#935b6d" ,"#916988" ,"#513d98" ,"#aead3a", "#9e6d71", "#4b5bdc", "#0cd36d",
        "#250662", "#cb5bea", "#228916", "#ac3e1b", "#df514a", "#539397", "#880977"];
    rgbaCompiled = []
    colors.slice(1,count+1).forEach( hex => {
        rgbaCompiled.push(hexToRgbA(hex));
    });
    return rgbaCompiled;
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

function reload_holiday_calendar(startDate, endDate, compiledData, showMonth, customData){
    
    // monthData format: [1,2,3,4,5]
    // startData format: [ { month1Data }, { month2Data }, { month3Data l}, ...]
    var startData = compiledData["start"]
    var endData = compiledData["end"]
    var start = startDate;
    var end = endDate;
    var highest = compiledData["highest"];
    var option = {
        maintainAspectRatio: false,
        legend: {
            display: false
        }, 
        scales: {
            yAxes: [{
                ticks :{
                    suggestedMax: highest,
                    suggestedMin: 0
                }
            }],
            xAxes: [{
                ticks: {
                    display: false //this will remove only the label
                }
            }]
        }
    };
    var legendsOption = {
        scales: {
            yAxes: [{
                ticks :{
                    suggestedMax: 0,
                    suggestedMin: 0,
                    display: false,
                    maxTicksLimit: 1
                }
            }],
            xAxes: [{
                ticks: {
                    display: false //this will remove only the label
                }
            }]
        }
    }
    
    var holidayMonths = [3,6,9,12];

    // Get the context of the canvas element we want to select
    $("#graph-container").children().remove();
    $("#graph-container").append(`
        <style>
            table, th, td {
                border: 1px solid black;
            }
            table{
                table-layout: fixed;
                width:75%;
            }
            .chart-container{
                height:15vh;
            }
        </style>
        <table width="70%">
            <tr>
                <td colspan=3 align='center'><font size="+20">${start}</font></td>
            </tr>
            <tr>
                <td align='center'>January<div class='chart-container'><canvas id="start1"></canvas></div></td>
                <td align='center'>February<div class='chart-container'><canvas id="start2"></canvas></div></td>
                <td align='center' style="background-color:rgba(102,181,152,0.2)">March<div class='chart-container'><canvas id="start3"></canvas></div></td>
                </tr>
                <tr>
                <td align='center'>April<div class='chart-container'><canvas id="start4"></canvas></div></td>
                <td align='center'>May<div class='chart-container'><canvas id="start5"></canvas></div></td>
                <td align='center' style="background-color:rgba(102,181,152,0.2)">June<div class='chart-container'><canvas id="start6"></canvas></div></td>
                </tr>
                <tr>
                <td align='center'>July<div class='chart-container'><canvas id="start7"></canvas></div></td>
                <td align='center'>August<div class='chart-container'><canvas id="start8"></canvas></div></td>
                <td align='center' style="background-color:rgba(102,181,152,0.2)">September<div class='chart-container'><canvas id="start9"></canvas></div></td>
                </tr>
                <tr>
                <td align='center'>October<div class='chart-container'><canvas id="start10"></canvas></div></td>
                <td align='center'>November<div class='chart-container'><canvas id="start11"></canvas></div></td>
                <td align='center' style="background-color:rgba(102,181,152,0.2)">December<div class='chart-container'><canvas id="start12"></canvas></div></td>
            </tr>
            <tr>
                <td colspan=3 align='center'><font size="+20">${end}</font></td>
            </tr>
            <tr>
                <td align='center'>January<div class='chart-container'><canvas id="end1"></canvas></div></td>
                <td align='center'>February<div class='chart-container'><canvas id="end2"></canvas></div></td>
                <td align='center' style="background-color:rgba(102,181,152,0.2)">March<div class='chart-container'><canvas id="end3"></canvas></div></td>
                </tr>
                <tr>
                <td align='center'>April<div class='chart-container'><canvas id="end4"></canvas></div></td>
                <td align='center'>May<div class='chart-container'><canvas id="end5"></canvas></div></td>
                <td align='center' style="background-color:rgba(102,181,152,0.2)">June<div class='chart-container'><canvas id="end6"></canvas></div></td>
                </tr>
                <tr>
                <td align='center'>July<div class='chart-container'><canvas id="end7"></canvas></div></td>
                <td align='center'>August<div class='chart-container'><canvas id="end8"></canvas></div></td>
                <td align='center' style="background-color:rgba(102,181,152,0.2)">September<div class='chart-container'><canvas id="end9"></canvas></div></td>
                </tr>
                <tr>
                <td align='center'>October<div class='chart-container'><canvas id="end10"></canvas></div></td>
                <td align='center'>November<div class='chart-container'><canvas id="end11"></canvas></div></td>
                <td align='center' style="background-color:rgba(102,181,152,0.2)">December<div class='chart-container'><canvas id="end12"></canvas></div></td>
            </tr>
        </table>`
    );
    

    // set chart settings
    Chart.defaults.global.elements.line.fill = false;

    // var compiledData = []

    // var legendctx = document.getElementById("legends").getContext("2d");
    // var legendChart = new Chart(legendctx, {
    //     type: 'bar',
    //     data: {
    //         datasets: [{
    //             data: getArrayOfZeros(customData.length),
    //             backgroundColor: getNumberOfColors(customData.length),
    //         }],
    //         labels: customData
    //     },
    //     options:legendsOption
    // });

    for (var i = 1; i <= 12; i++) {
        
        var startctx = document.getElementById("start" + i).getContext("2d");
        var endctx = document.getElementById("end" + i).getContext("2d");


        let startChart = new Chart(startctx, {
            type: 'bar',
            data: {
                datasets: [{
                    data: compiledData['start'][i],
                    backgroundColor: getNumberOfColors(customData.length),
                }],
                labels: customData
            },
            options:option
        });
        let endChart = new Chart(endctx, {
            type: 'bar',
            data: {
                datasets: [{
                    data: compiledData['end'][i],
                    backgroundColor: getNumberOfColors(customData.length),
                }],
                labels: customData
            },
            options:option
        });        
        startctx.height = 200;
        endctx.height = 200;
    }
}

function getArrayOfZeros(count){
    zeros = [];
    for(var i=0; i<count; i++){
        zeros.push(1);
    }
    return zeros;
}

function CompileAllDiseasesForCalendar(jsonData, start, end, showMonth, customData){
    var compiled = {};
    var startData = {};
    var endData = {};
    var months = [];
    var highest = 0;

    
    // monthData format: [12,32,43,12]
    // startData format: [ { month1Data }, { month2Data }, { month3Data l}, ...]
    // compiled: {start: startData, end: endData}
    for (var i = 1; i <= 12; i++) {months.push(i);}

    months.forEach(function(month){
        if (startData[month] == null){
            startData[month] = [];
        } 
        if (endData[month] == null) {
            endData[month] = [];
        }
        startData[month].push(jsonData[start][month]["total"]);
        endData[month].push(jsonData[end][month]["total"]);
        
        // setting the highest value
        if ( highest < jsonData[start][month]["total"]){
            highest = jsonData[start][month]["total"];
        }
        // setting the highest value
        if ( highest < jsonData[end][month]["total"]){
            highest = jsonData[end][month]["total"];
        }
    });

    compiled['start'] = startData;
    compiled['end'] = endData;
    compiled['highest'] = highest;
    
    return compiled;
}

function CompileDiseaseCategoryForCalendar(jsonData, start, end, showMonth, customData){
    var compiled = {};
    var startData = {};
    var endData = {};   
    var months = [];
    var highest = 0;

    for (var i = 1; i <= 12; i++) {months.push(i);}
    

    // monthData format: [12,32,43,12]
    // startData format: [ { month1Data }, { month2Data }, { month3Data l}, ...]
    // compiled: {start: startData, end: endData}

    
    months.forEach(function(month){
        if (startData[month] == null){
            startData[month] = [];
        } 
        if (endData[month] == null) {
            endData[month] = [];
        }

        customData.forEach(function(category){
            startData[month].push(jsonData[start][month][category]["total"]);
            endData[month].push(jsonData[end][month][category]["total"]);

            // setting the highest value
            if ( highest < jsonData[start][month][category]["total"]){
                highest = jsonData[start][month][category]["total"];
            }
            // setting the highest value
            if ( highest < jsonData[end][month][category]["total"]){
                highest = jsonData[end][month][category]["total"];
            }
        });

    });
        

    compiled['start'] = startData;
    compiled['end'] = endData;
    compiled['highest'] = highest;
    
    return compiled;
}

function CompileDiseaseNameForCalendar(jsonData, start, end, showMonth, customData){
    var compiled = {};
    var startData = {};
    var endData = {};
    var months = [];
    var highest = 0;

    for (var i = 1; i <= 12; i++) {months.push(i);}
    

    // monthData format: [12,32,43,12]
    // startData format: [ { month1Data }, { month2Data }, { month3Data}, ...]
    // compiled: {start: startData, end: endData}
    
    months.forEach(function(month){
        if (startData[month] == null){
            startData[month] = [];
        } 
        if (endData[month] == null) {
            endData[month] = [];
        }

        customData.forEach(function(disease){
            currentCount = startData[month].length;

            for (category in jsonData[start][month]){
                if(jsonData[start][month][category][disease] != null){
                    startData[month].push(jsonData[start][month][category][disease]);
                    // setting the highest value
                    if ( highest < jsonData[start][month][category][disease]){
                        highest = jsonData[start][month][category][disease];
                    }
                }
            }

            for (category in jsonData[end][month]){
                if(jsonData[start][month][category][disease] != null){
                    endData[month].push(jsonData[end][month][category][disease]);
                    // setting the highest value
                    if ( highest < jsonData[end][month][category][disease]){
                        highest = jsonData[end][month][category][disease];
                    }
                }
            }

            if(currentCount == startData[month].length) {
                startData[month].push(0);
            }
            if(currentCount == endData[month].length) {
                endData[month].push(0);
            }
        });
    });

    compiled['start'] = startData;
    compiled['end'] = endData;
    compiled['highest'] = highest;
    return compiled;
}