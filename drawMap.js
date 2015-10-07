/**
 * Created by silentflutes on 10/6/2015.
 */

var width=960;
var height=700;

var canvas = d3.select("body")
    .append("svg")
    .attr("width",width)
    .attr("height",height)
    ;

d3.json("data/nepal-districts.geojson",createMap);

function createMap(nepal){

    var group =  canvas.selectAll("g")
        .data(nepal.features)
        .enter()
        .append("g")
    ;

    var aProjection =d3.geo.mercator()
        .translate([width/2,height/2])
        .scale(6600)
         .center([84.115593872070313, 28.665876770019531]) ;

    var geoPath=d3.geo.path().projection(aProjection);

   var district=group.append("path")
       .attr("d",geoPath)
       .attr("class","district")
       .attr("fill","#fff")
       .attr("stroke","#ccc")
       .attr("stroke-width","2px")
       .on("mouseover", mouseover)
       .on("mousemove", mousemove)
       .on("mouseout", mouseout);

    var bodyNode=d3.select('body').node();

    var absoluteMousePos=d3.mouse(bodyNode);

    var toolTipDiv;
    function mouseover(nepal) {
        var absoluteMousePos=d3.mouse(bodyNode);
        toolTipDiv = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
            ;

        toolTipDiv.transition()
            .duration(500)
            .style("opacity", 1);

        toolTipDiv
            .style('left', (absoluteMousePos[0] + 10)+'px')
            .style('top',(absoluteMousePos[0] - 10)+'px')
            .style('position','absolute')
            .style('z-index',1001)

            //.text(d3.event.pageX + ", " + nepal.properties.DISTRICT +","+ d3.event.pageY)
            .text(nepal.properties.DISTRICT);
    }

    function mousemove(nepal) {
        //var value =nepal.properties.DISTRICT;
        var absoluteMousePos = d3.mouse(bodyNode);
        toolTipDiv
            //.text(d3.event.pageX + ", " + nepal.properties.DISTRICT +","+ d3.event.pageY)
            .text(nepal.properties.DISTRICT)
            .style("left",(absoluteMousePos[0] + 10)+'px')
            .style("top", (absoluteMousePos[1] - 10)+'px')
            .style("opacity", 1);
    }

    function mouseout() {
        toolTipDiv.remove();
    }

};

var color=d3.scale.linear()
        .domain([0,60])
        .range(["red","blue"])
    ;

d3.csv("data/Data_map.csv",processAllDistrict)

var summedUpData=[];
function processAllDistrict(districtArray){
    var sumUpDeaths=0,sumUpInjured= 0,sumUpPartial= 0,sumUpFull=0;
    for(district in districtArray){
        if(districtArray[district].Subdivision=="Death")
            sumUpDeaths+=districtArray[district].no;
        if(districtArray[district].Subdivision=="Injured")
            sumUpInjured+=districtArray[district].no;
        if(districtArray[district].Subdivision=="Govt. Houses Fully Damaged")
            sumUpFull+=districtArray[district].no;
        if(districtArray[district].Subdivision=="Govt. Houses Partially Damaged")
            sumUpPartial+=districtArray[district].no;

    }
    summedUpData.push(sumUpDeaths);
    summedUpData.push(sumUpInjured);
    summedUpData.push(sumUpFull);
    summedUpData.push(sumUpPartial);
    drawBarChart(summedUpData);
}

function setupBarChartBasics(){
    var margin ={top:30,right:5,bottom:20,left:50},
        width=500-margin.left-margin.right,
        height=250-margin.top-margin.bottom,
        colorBar=d3.scale.category20(),
        barPadding=1
        ;

    return{
        margin:margin,
        width:width,
        height:height,
        colorBar:colorBar,
        barPadding:barPadding
    }
        ;
}
//creates both bar chart
function drawBarChart(districtData){
    var basics=setupBarChartBasics();
    var margin=basics.margin,
        width =basics.width,
        height=basics.height,
        colorBar=basics.colorBar,
        barPadding =basics.barPadding
        ;
}

var svg = d3.select("#barChartHC")
    .append("g")
    .attr("transform","translate("+margin.left+","+ margin.top+")")
;



function drawIDBarChart(){

}
//base map completed now
//relatung
//start of choropleth drawing










