 
// arrow diagram js code

// get index of key from given array of json
function getIndexOf(arr, key){
    let index = -1;
    arr.forEach((e, i) => {
        for (k in e) {
            if (k == key) {
                index = i;
            }
        }
    });
    return index;
}

function reloadArrow(startYear, endYear, ds1, ds2){
    // ds1 is bar dataset. {start:[{d1:count},{d2:count}], end:[{d2:count},{d1:count}]}
    // ds2 is line dataset. [{start:rank, end:rank}, {start:rank, end:rank},]
    
    var svgWidth = 1200, svgHeight = 1300;
    var barHeight = 20, barWidth = 480, barPadding = 5, barStart = 100, rightBarStart = 700;

    $("#graph-container").children().remove();
    $("#graph-container").append(`<svg id="arrow-diagram"></svg>`);
    
    var arrowSvg = d3.select('#arrow-diagram')
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .style("border", "1px solid black");
    
    arrowSvg.selectAll("*")
        .remove();

    var generalTitle = arrowSvg
        .append("g")
        .append("text")
        .text("Comparison of disease count over the two given years")
        .attr("x", 270)
        .attr("y", barStart - 50)
        .attr("font-size", 30);

    var startYearTitle = arrowSvg
        .append("g")
        .append("text")
        .text(startYear)
        .attr("x", barWidth/2)
        .attr("y", barStart - 10)
        .attr("font-size", 20);

    var endYearTitle = arrowSvg
        .append("g")
        .append("text")
        .text(endYear)
        .attr("x", rightBarStart - 25 + barWidth/2)
        .attr("y", barStart - 10)
        .attr("font-size", 20);

    var leftBars = arrowSvg
        .append("g")
        .selectAll("rect")
        .data(ds1["start"])
        .enter()
        .append("rect")
        .attr("id", function(d,i){ 
            return "left" + i;
        })
        .attr("y", function(d, i) {
            return i * barHeight;
        })
        .attr("x", 25)
        .attr("height", barHeight)
        .attr("width", barWidth)
        .attr("class", "bar")
        .attr("transform", function(d,i){
            let transY = barPadding * i + barStart;
            return "translate(0 " + transY + ")";
        })
        .on("mouseover", function(d,i){
            for (k in d){
                mouseoverHighlight(k);
            }
        })
        .on("mouseout", function(d,i){
            for (k in d){
                mouseoutHighlight(k);
            }
        })
        .style("fill", "red")
        .style("opacity", 0.5)
        .append("svg:title")
        .text(function(d) { 
            for (k in d) { return "Number of Cases: " + d[k];}
        });


    var rightBars = arrowSvg
        .append("g")
        .selectAll("rect")
        .data(ds1["end"])
        .enter()
        .append("rect")
        .attr("id", function(d,i){ 
            return "right" + i;
        })
        .attr("y", function(d, i) {
            return i * barHeight;
        })
        .attr("x", rightBarStart)
        .attr("height", barHeight)
        .attr("width", barWidth)
        .attr("class", "bar")
        .attr("transform", function(d,i){
            let transY = barPadding * i + barStart;
            return "translate(0 " + transY + ")";
        })
        .style("fill", "red")
        .style("opacity", 0.5)
        .on("mouseover", function(d,i){
            for (k in d){
                mouseoverHighlight(k);
            }
        })
        .on("mouseout", function(d,i){
            for (k in d){
                mouseoutHighlight(k);
            }
        })
        .append("svg:title")
        .text(function(d) { 
            for (k in d) { return "Number of Cases: " + d[k];}
        });
        

    var leftText = arrowSvg
        .append("g")
        .selectAll("text")
        .data(ds1["start"])
        .enter()
        .append("text")
        .attr("id", function(d,i){ 
            return "leftT" + i;
        })
        .text(function(d, i) {
            for (k in d) {return i+1 + ". " + k;}
        })
        .attr("y", function(d, i) {
            return i * barHeight;
        })
        .attr("x", 40)
        .attr("transform", function(d,i){
            let transY = barPadding * i + barStart + barHeight*0.8;
            return "translate(0 " + transY + ")";
        })
        .on("mouseover", function(d,i){
            for (k in d){
                mouseoverHighlight(k);
            }
        })
        .on("mouseout", function(d,i){
            for (k in d){
                mouseoutHighlight(k);
            }
        });


    var rightText = arrowSvg
        .append("g")
        .selectAll("text")
        .data(ds1["end"])
        .enter()
        .append("text")
        .attr("id", function(d,i){ 
            return "rightT" + i;
        })
        .text(function(d, i) {
            for (k in d) {return i+1 + ". " + k;}
        })
        .attr("y", function(d, i) {
            return i * barHeight;
        })
        .attr("x", rightBarStart + 15)
        .attr("transform", function(d,i){
            let transY = barPadding * i + barStart + barHeight*0.8;
            return "translate(0 " + transY + ")";
        })
        .on("mouseover", function(d,i){
            for (k in d){
                mouseoverHighlight(k);
            }
        })
        .on("mouseout", function(d,i){
            for (k in d){
                mouseoutHighlight(k);
            }
        });


    var middleLines = arrowSvg
        .append("g")
        .selectAll("line")
        .data(ds2)
        .enter()
        .append("line")
        .attr("id", function(d,i){
            return "line" + (d["start"]-1);
        })
        .attr("x1", 25+barWidth)
        .attr("x2", rightBarStart)
        .attr("y1", function(d,i){
            return ((barHeight + barPadding) * (d["start"] - 1) + barStart + barHeight/2 )
        })
        .attr("y2", function(d,i){
            return ((barHeight + barPadding) * (d["end"] - 1) + barStart + barHeight/2 )
        })
        .attr("stroke-width", 2)
        .attr("stroke", "grey");

    function mouseoverHighlight(k){
        let lefti = getIndexOf(ds1['start'],k);
        let righti = getIndexOf(ds1['end'],k);
        d3.select("#left"+lefti)
            .attr("stroke", "black")
            .attr("stroke-width", 3);
        d3.select("#right" + righti)
            .attr("stroke", "black")
            .attr("stroke-width", 3);
        d3.select("#line"+ lefti)
            .attr("stroke", "red")
            .attr("stroke-width", 4);

    }
    
    function mouseoutHighlight(k){
        let lefti = getIndexOf(ds1['start'],k);
        let righti = getIndexOf(ds1['end'],k);
        d3.select("#left"+lefti)
            .attr("stroke", "none")
            .attr("stroke-width", 0);
        d3.select("#right" + righti)
            .attr("stroke", "none")
            .attr("stroke-width", 0);
        d3.select("#line"+lefti)
            .attr("stroke", "grey")
            .attr("stroke-width", 2);
    }
}

function get_arrow_diagram(startDate, endDate, hlevel, customData=null){
     let data = $.getJSON("./data/sort_by_date.json", function(json) {
        let arrowStart = [], arrowEnd = [];
        let startYear = moment(startDate).format("YYYY");
        let endYear = moment(endDate).format("YYYY");
        let rawStart = json[startYear];
        let rawEnd = json[endYear];

        if (hlevel == 0){
            arrowStart.push({
                "All diseases" : rawStart["total"]
            });
            arrowEnd.push({
                "All diseases" : rawEnd["total"]
            });
        } else if (hlevel == 1) {
            compiledStart = CompileDiseaseCategoryForArrow(rawStart, customData);
            compiledEnd = CompileDiseaseCategoryForArrow(rawEnd, customData);
            
            for ( k in compiledStart) {
                var node = {};
                node[k] = compiledStart[k];
                arrowStart.push(node);
            }
            for ( k in compiledEnd) { 
                var node = {};
                node[k] = compiledEnd[k];
                arrowEnd.push(node);
            }
        } else if (hlevel == 2) {
            compiledStart = CompileDiseaseNameForArrow(rawStart, customData);
            compiledEnd = CompileDiseaseNameForArrow(rawEnd, customData);
            
            for ( k in compiledStart) {
                var node = {};
                node[k] = compiledStart[k];
                arrowStart.push(node);
            }
            for ( k in compiledEnd) { 
                var node = {};
                node[k] = compiledEnd[k];
                arrowEnd.push(node);
            }
        }
        
        // sort by descending order
        arrowStart.sort(function(a,b) {
            for ( k in a) {
                var a1 = a[k];
            }
            for ( k in b) {
                var b1 = b[k];
            }
            return b1 - a1;
        });
        
        // sort by descending order
        arrowEnd.sort(function(a,b) {
            for ( k in a) {
                var a1 = a[k]; 
            } // k value of a and b will be different because the k value is disease name
            for ( k in b) {
                var b1 = b[k];
            }
            return b1 - a1;
        });

        let lineData = getLineData(arrowStart, arrowEnd);
        
        let ds1 = {"start":arrowStart, "end":arrowEnd};

        reloadArrow(startYear, endYear, ds1, lineData);

    });
}

function getLineData(arrowStart, arrowEnd){
    var lineData = [];
    arrowStart.forEach(function(element, index){
        let newNode = {};
        newNode["start"] = index + 1;
        var dname;
        for (k in element){
            dname = k;
        }
        newNode["end"] = getIndexOf(arrowEnd, dname) + 1;
        
        if(newNode["end"] > 0){ lineData.push(newNode); }
    })
    return lineData;
}

function CompileDiseaseCategoryForArrow(jsonData, customData){
    compiled = {};
    for ( month in jsonData ){
        if( month == "total") { continue; }
        for ( name in jsonData[month]){

            if( name == "total") { continue; }

            if(customData != null && !customData.includes(name)) {
                continue; 
            }
            
            if (name in compiled){
                compiled[name] += jsonData[month][name]['total']
            } else {
                compiled[name] = jsonData[month][name]['total']
            }
        }
    }
    return compiled;
}

function CompileDiseaseNameForArrow(jsonData, customData){
    compiled = {};
    for ( month in jsonData ){
        if( month == "total") { continue; }
        for ( category in jsonData[month]){
            if( category == "total") { continue; }
            for (name in jsonData[month][category]){
                if (name == "total") { continue; }
                if(customData != null && !customData.includes(name)) {
                    continue; 
                }
                if (name in compiled){
                    compiled[name] += jsonData[month][category][name];
                } else {
                    compiled[name] = jsonData[month][category][name];
                }
            }
        }
    }
    
    return compiled;
}
