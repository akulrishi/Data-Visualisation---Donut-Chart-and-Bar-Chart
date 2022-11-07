//Global variables
var vowelHashMap = new Map([["a", 0],["e", 0],["i", 0], ["o", 0], ["u", 0], ["y", 0]]);
var consonantHashMap = new Map([["b", 0],["c", 0],["d", 0],["f", 0],["g", 0],["h", 0],["j", 0],["k", 0],["l", 0],["m", 0],["n", 0],["p", 0],["q", 0],["r", 0],["s", 0],["t", 0],["v", 0],["w", 0],["x", 0],["z", 0]]);
var punctuationHashMap = new Map([["!", 0],[":", 0],[".", 0],[";", 0],[",", 0],["?", 0],["/", 0],["*", 0],["(", 0],[")", 0]]);
var counts = {'v': 0, 'c': 0, 'p':0}
var pieChartSvg;
var barChartSvg;
var pie, pieTip, finalPieChart;
var color = d3.scaleOrdinal(d3.schemeSet1)
var currentMap;
var barTip, barChart;
var xAxis, yAxis, xAxisScaled, yAxisScaled;

//Populate the maps with respective counts and call the pie chart generation function
function submitText(){
    d3.selectAll("svg>*").remove();
    var givenInput = document.getElementById("wordbox").value;
    const regexRemWhiteSpace = givenInput.replace(/\s/g,'');
    const stringlength = regexRemWhiteSpace.length;
    vowelHashMap.forEach((_,key)=>{vowelHashMap.set(key,0)});
    consonantHashMap.forEach((_,key)=>{consonantHashMap.set(key,0)});
    punctuationHashMap.forEach((_,key)=>{punctuationHashMap.set(key,0)});
    counts.v=0; counts.c=0; counts.p=0;

    for(let lett of regexRemWhiteSpace.toLowerCase()){
        if(vowelHashMap.has(lett)){
            if(vowelHashMap.has(lett)){
                let current_count = vowelHashMap.get(lett);
                vowelHashMap.set(lett, current_count+1);
            }
        } else if(consonantHashMap.has(lett)){
            if(consonantHashMap.has(lett)){
                let current_count = consonantHashMap.get(lett);
                consonantHashMap.set(lett, current_count+1);
            }
        } else{
            if(punctuationHashMap.has(lett)){
                let current_count = punctuationHashMap.get(lett);
                punctuationHashMap.set(lett, current_count+1);
            }
        }
    }
    createCurrentPieChart(stringlength);
}

function createCurrentPieChart(stringlength){
    const pieChartWidth = 550;
    const pieChartHeight = 410;
    const pieChartMargin = 30;
    pieChartSvg = d3.select("#pie_svg").append("g").attr('class', 'donut-container').attr("transform", "translate(" + pieChartWidth / 2 + "," + pieChartHeight / 2 + ")");
    var radius = Math.min(pieChartWidth, pieChartHeight) / 2 - pieChartMargin;
    var arc = d3.arc().innerRadius(100).outerRadius(radius - 10)
    vowelHashMap.forEach(value => { counts.v += value;});
    consonantHashMap.forEach(value => { counts.c += value;});
    punctuationHashMap.forEach(value => { counts.p += value;});

    pie = d3.pie().value(function(p) {return p[1]; });
    var data1 = pie(Object.entries(counts));
    pieTip = pieChartSvg.append("svg:text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("style","font-family:Saira Condensed")
    .attr("font-size","20")
    .attr("fill","#000000")
    .style("visibility", "hidden")

    finalPieChart = pieChartSvg.selectAll('arc').data(data1).enter().append('path')
    .on("mouseover", function(d, i) {
        d3.select(this).attr("stroke", "black").text(d[0]).style("cursor", "pointer").style("stroke-width", "3px")
        pieTip.text(i.data[0].toUpperCase() +" : " + Math.round((i.data[1]/stringlength*100))+"%");
        return pieTip.style("visibility", "visible");
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("stroke", "black").style("cursor", "default").style("stroke-width", "3px")
        return pieTip.style("visibility", "hidden");
      })
    .on('click', (d, i, n) => {
        createCurrentBarChart(i.data[0])
     })
    .attr('class','arc')
    .attr('d', arc)
    .attr('fill', function(d){ return(color(d.data[0])) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)
}


function createCurrentBarChart(inputType){
    d3.select("#bar_svg").selectAll("*").remove(); 
    const barChartHeight = 410;

    if(inputType=='v'){
        currentMap = vowelHashMap;
    } else if(inputType=='p'){
        currentMap = punctuationHashMap;
    }else{
        currentMap = consonantHashMap;
    }
    console.log(currentMap);

    barChartSvg = d3.select("#bar_svg").append("g").attr('class', 'bars-container')
    divTip = d3.select("body").append("div").attr("width", "55px").attr("class", "tooltip").style("border", "solid").style("border-width", "1px")
    .style("border-radius", "5px").style("opacity", 0).style("background-color", "white");
    xAxis = d3.scaleBand().domain(Array.from(currentMap.keys()).map(function(d) { return d; })).padding(0.3).range([50, 500]);
    yAxis = d3.scaleLinear().range([barChartHeight-30, 40])
    xAxisScaled = d3.axisBottom().scale(xAxis);

    barChartSvg.append("g").attr('transform', 'translate(0,' + (barChartHeight - 35) + ')').attr('stroke-width', 1.5).call(xAxisScaled);
    yAxisScaled = barChartSvg.append("g").attr("class", "myYaxis")
    yAxis.domain([0, Math.max(...currentMap.values())+5]);
    yAxisScaled.attr('stroke-width', 1.5).attr("transform", "translate(44, -6)").call(d3.axisLeft(yAxis));

    barChartSvg.selectAll("rect").data(currentMap).enter().append("rect")
    .on("mouseover", function(d, i) {
        document.getElementById("character-name").innerText = i[0] +" is " + i[1];
        divTip.html("Character:" + i[0] + "<br>" + "Count:" + i[1]).style("left", (d.pageX) + "px").style("top", (d.pageY - 35) + "px");
        divTip.style("opacity", .9);
        d3.select(this)
            .attr("fill", "#FF9633")
            .style("cursor", "pointer")
    }).on("mouseout", function(d) {
        divTip.style("opacity", 0)
        document.getElementById("character-name").innerText = "None";
        d3.select(this)
            .attr("fill", color(inputType))
            .style("cursor", "default")
    })
    .attr("y", function(d) { return yAxis(d[1]); }).attr("x", function(d) { return xAxis(d[0]); })
    .attr("height", function(d) { return barChartHeight - 30 - yAxis(d[1]); }).attr("width", xAxis.bandwidth())
    .attr("transform", "translate(0, -5)")
    .attr("style", "outline: thin solid black;") 
    .attr("fill", color(inputType))

    barChartSvg.append("text")
    .attr("x", -250)
    .attr("y", 15)
    .classed('rotation', true)
    .attr("font-weight", 600)
    .style("transform", "rotate(-90deg)")
    .text("Count");

    barChartSvg.append("text")
    .attr("x", 250)
    .attr("y", 390)
    .classed('rotation', true)
    .attr("font-weight", 600)
    .text(inputType);

}
