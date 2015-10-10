/**
 * Created by silentflutes on 10/6/2015.
 */

var width=750;
var height=580;

//format
var formatAsPercentage =d3.format("%"),
    formatAsPercentage1Dec=d3.format(".1%"),
    formatAsInteger=d3.format(","),
    fsec=d3.time.format("%S s"),
    fmin=d3.time.format("%M m"),
    fhou=d3.time.format("%H h"),
    fwee=d3.time.format("%a"),
    fdat=d3.time.format("%d d"),
    fmon=d3.time.format("%b")
    ;



d3.json("data/nepal-districts.geojson",createMap);

function createMap(nepal) {

    var canvas = d3.select("#map")
            .append("svg")
            .attr("width",width)
            .attr("height",height)
           // .attr("border",1 )
            //.attr("style", "outline: thin solid red;")
            .attr("style", "border: 1px solid red;")
            //.attr("style", "margin: 5px;")

        ;

    /*var borderPath = svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", h)
        .attr("width", w)
        .style("stroke", bordercolor)
        .style("fill", "none")
        .style("stroke-width", border);*/

    var colorBar = d3.scale.category20()
        ;

    var group = canvas.selectAll("g")
            .data(nepal.features)
            .enter()
            .append("g")
        ;

    var projection =d3.geo.mercator()
        //.scale((width/640)*100).translate([width/2, height/2]);
          // .center([width/2,height/2])
           .scale(5000)
          // .center([30.115593872070313, 18.665876770019531])
           .center([85.315593872070313, 28.665876770019531])
        ;

    var geoPath=d3.geo.path().projection(projection);

    var district=group.append("path")
            .attr("d",geoPath)
            .attr("class","district")
            .attr("fill","#fff")
            .attr("stroke","#ccc")
            .attr("stroke-width","2px")
           .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout)
            .on("click",mouseclick)
        ;

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

            //.text(d3.event.pageX + ", " + selectedDistrict.properties.DISTRICT +","+ d3.event.pageY)
            .text(nepal.properties.DISTRICT);
    }

    function mousemove(nepal) {

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

    function mouseclick(){
        // updateBarChart(selectedDistrict,colorBar(i),"Human Casualties","#barChartHC","plotbarChartHC");
        // updateBarChart(selectedDistrict,colorBar(i),"Infrastructure Damage","#barChartID","plotbarChartID");
    }

};

function setupBarChartBasics(){
    var margin ={top:150,right:5,bottom:20,left:50},
        width=500-margin.left-margin.right,
        height=250 - margin.top - margin.bottom,
        colorBar=d3.scale.category20(),
        barPadding=2
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


function createBarChart(divId,barChartId){
var districtArray=[];
function getDistrictData(data){
    for(var i=0;i<data.length;i++)
        districtArray.push(data[i]);
}

   d3.csv("data/Data_map.csv",getDistrictData);

    var basics=setupBarChartBasics();
    var margin=basics.margin,
        width =basics.width,
        height=basics.height,
        colorBar=basics.colorBar,
        barPadding =basics.barPadding
        ;


    var sum=[],divison,subDivision=[],title;

    /* Returns: 0:  exact match -1:  string_a < string_b 1:  string_b > string_b*/
    //compare string using localCompare
    if(divId.localeCompare("#barChartHC")==0){
        //clear sum array first
        // sum.length=0;
        title="HC";
        divison="Human Causalities";
        subDivision=["Death","Injured"];
        //getSum(districtArray, divison, subDivision);
    }
    if(divId.localeCompare("#barChartID")==0){
        title="ID";
        division = "Infrastructural Damage";
        if (document.getElementById("selectMode").value.localeCompare("Goverment")){

            subDivision = ["Fully Damaged", "Partially Damaged"];
            //  getSum(districtArray, divison, subDivision);
        }
        if(document.getElementById("selectMode").value.localeCompare("Private")){
            subDivision = ["Fully Damaged", "Partially Damaged"];
        }
    }

    var sumA=10,sumB=10;

        for(var row=0;row<districtArray.length;row++) {
            var number = parseInt(districtArray[row].no);
            if (districtArray[row].Division == divison && (districtArray[row].Subdivision == subDivision[0]) ) {
                var value = isNaN(number) ? 0 : number;
                if (value!=0)
                sumA += value;
            }
            if (districtArray[row].Division == divison && districtArray[row].Subdivision == subDivision[1]) {
                var value = isNaN(number) ? 0 :number;
                if(value!=0)
                sumB +=  value;
            }
        }

       // sum[0]=sumA;
       // sum[1]=sumB;
        sum=[45,55];

    //define text of x axis

    console.log(sum);

    var xScale=d3.scale.linear()
            .domain([0,sum.length])
            .range([0,width])
        ;

    var yScale=d3.scale.linear()
            .domain([0,d3.max(sum)])
            .range([height,0])
        ;

    var svg = d3.select(divId)
            .append("svg")
            .attr("width",width+margin.left+margin.right)
            .attr("height", height+margin.top + margin.bottom)
            .attr("id",barChartId)
            .attr("style", "border: 1px solid red;")
    //.attr("style","")
        ;

    var plot= svg
            .append("g")
            .attr("transform","translate("+margin.left+","+ margin.top+")")
        ;

    //data seq death injured fully partially

    //draw bargraph
    plot.selectAll("rect")
        .data(sum)
        .enter()
        .append("rect")
        .attr("x",function(sum,i){return xScale(i);})
        .attr("width",width/(sum.length+3)-barPadding)
        .attr("y",function(sum){return yScale(sum);})
        //.attr("y",function(sum){return sum;})
        .attr("height",function(d){return height - yScale(d);})
        // .attr("height",function(d){return height;})
        .attr("fill","lightgrey")

    ;

    //add y labels to plot
    plot.selectAll("text")
        .data(sum)
        .enter()
        .append("text")
        .text(function (d){return d;})
        .attr("text-anchor","middle")
        //set x position to the left edge of each bar plus half the har width
        .attr("x",function(d,i){ return (i*(width/sum.length))
            +((width/(sum.length+3)-barPadding)/2);})
        .attr("y",function(d){return d;})
        .attr("class","yAxis")
    ;

    //for x axis the data is diff
    //title
    svg.append("text")
        .attr("x",(width+margin.left+margin.right)/2)
        .attr("y",15)
        .attr("class","title")
        .attr("text-anchor","middle")
        .text(title)
    ;

    //x axis label differs, add x labels to chart
    var xLabels= svg.append("g")
            .attr("transform","translate(" + margin.left + ","+(margin.top+height)+")")
        ;

    xLabels.selectAll("text.xAxis")
        .data(subDivision)
        .enter()
        .append("text")
        .text(function(d){return d;})
        .attr("text-anchor","middle")

        //set x position to the left edge of each bar plus half the bar width
        .attr("x",function(d,i){return (i*(width/subDivision.length))+((width/(subDivision.length+3)-barPadding)/2)})
        .attr("y",15)
        .attr("class","xAxis")
    ;

  }

createBarChart("#barChartHC","#plotbarChartHC");
createBarChart("#barChartID","#plotbarChartID");