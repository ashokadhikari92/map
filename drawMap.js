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


//base map completed now
//relatung
//start of choropleth drawing










