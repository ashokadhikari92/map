/**
 * Created by silentflutes on 10/6/2015.
 */
var width = 750;
var height = 500;
//format
var formatAsPercentage = d3.format("%"),
    formatAsPercentage1Dec = d3.format(".1%"),
    formatAsInteger = d3.format(","),
    fsec = d3.time.format("%S s"),
    fmin = d3.time.format("%M m"),
    fhou = d3.time.format("%H h"),
    fwee = d3.time.format("%a"),
    fdat = d3.time.format("%d d"),
    fmon = d3.time.format("%b")
    ;
d3.json("data/nepal-districts.geojson", createMap);

function createMap(nepal) {
    console.log(nepal);
    var rateByDeath = d3.map();

    var title=d3.select("#map").append("h4")
        .attr("align","center")
        .attr("height","5px")
        .attr("class","maptitle")
        .attr("style", "border: 1px solid red;")
        .html("Nepal : Earthquake 2015 ");

    var canvas = d3.select("#map")
            .append("svg")
            .attr("width", width)
            .attr("height", height+50)
            .attr("style", "border: 1px solid red;");

    var colorBar = d3.scale.category20();
    var group = canvas.selectAll("g")
            .data(nepal.features)
            .enter()
            .append("g");
    var projection = d3.geo.mercator()
            .scale(5000)
            .center([85.315593872070313, 28.665876770019531]);
    var geoPath = d3.geo.path().projection(projection);


   /* colorMap(nepal);
    //console.log(nepal);
    function colorMap(nepal) {
       // console.log(nepal);
        d3.csv("data/Data_map.csv",colorNepal);
        function colorNepal(data) {
                var deaths = data.filter(function (data) {
                    //console.log(nepal.features);
                    return data.Subdivision == "Death" && data.District.toLowerCase() == nepal.properties.DISTRICT.toLowerCase();
                }).map(function (data) {
                    return data.no;
                });
                console.log("deaths "+ deaths);
                return deaths;
            }
    }
    */
    var quantize = d3.scale.quantize()
        .domain([0, 9])// 9 is max no of hit
        .range(d3.range(9).map(function(i) {
            if(i==0) return "white";
            else return "q" + i + "-9"; }));

    var district = group.append("path")
            .attr("d", geoPath)
           // .attr("class",function (d){return quantize(rateById.get(d.District));})
            .attr("class",function(d){return quantize(d.no)})
            //.attr("fill",function(d,i){return color(i);})
            .attr("stroke", "#ccc")
            .attr("stroke-width", "2px")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout)
            .on("click", mouseclick);

    var color_domain =     [50, 150,  250, 350,450, 550,750, 850, 950, 1050]
    var ext_color_domain = [0, 50, 150, 250,350,450,550, 750, 850, 950]
    var legend_labels = ["0", "1", "2", "3", "4", "5","6", "7", "8", "9"]
    var color = d3.scale.threshold()
        .domain(color_domain)
        .range(["rgb(255,255,255)", "rgb(255,230,230)", "rgb(255,150,150)", "rgb(255,100,100)", "rgb(230,100,100)",
            "rgb(235,90,90)","rgb(240,80,80)","rgb(245,60,60)","rgb(250,50,50)","rgb(255,0,0)"]);

    var legend= canvas.selectAll("g.legend")
        .data(ext_color_domain)
        .enter().append("g")
        .attr("class", "legend");

    var ls_w = 20, ls_h = 20;

    legend.append("rect")
        .attr("x", 20)
        .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d, i) { return color(d); })
        .style("opacity", 0.8);

    legend.append("text")
        .attr("x", 50)
        .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
        .text(function(d, i){ return legend_labels[i]; });

    //mouse event handler
    var bodyNode = d3.select('body').node();
    var absoluteMousePos = d3.mouse(bodyNode);
    var toolTipDiv;
    function mouseclick(nepal) {
        console.log(nepal);
        d3.csv("data/Data_map.csv", updateBar);
        function setupBarChartBasics() {
            var margin = {top: 150, right: 5, bottom: 10, left: 150},
                width = 500 - margin.left - margin.right,
                height = 250 - margin.top - margin.bottom,
                colorBar = d3.scale.category20(),
                barPadding = 2
                ;
            return {
                margin: margin,
                width: width,
                height: height,
                colorBar: colorBar,
                barPadding: barPadding
            }
                ;

        }

        function updateBar(data) {

            var deaths = data.filter(function (data) {
                return data.Subdivision == "Death" && data.District.toLowerCase() == nepal.properties.DISTRICT.toLowerCase();

            }).map(function (data) {
                return data.no;
            }).reduce(function (a, b) {
                return parseInt(a) + parseInt(b);
            }, 0);

            var injured =
                data.filter(function (data) {
                    return data.Subdivision == "Injured" && data.District.toLowerCase() == nepal.properties.DISTRICT.toLowerCase();
                }).map(function (data) {
                    return data.no;
                }).reduce(function (a, b) {
                    return parseInt(a) + parseInt(b);
                }, 0);

            var govtfull = data.filter(function (data) {
                return data.Subdivision == "Govt. Houses Fully Damaged" && data.District.toLowerCase() == nepal.properties.DISTRICT.toLowerCase();
            }).map(function (data) {
                return data.no;
            }).reduce(function (a, b) {
                return parseInt(a) + parseInt(b);
            }, 0);
            console.log("govt full "+govtfull);

            var govtpartial = data.filter(function (data) {
                return data.Subdivision == "Govt. Houses Partially Damaged" && data.District.toLocaleLowerCase() == nepal.properties.DISTRICT.toLowerCase();
            }).map(function (data) {
                return data.no;
            }).reduce(function (a, b) {
                return parseInt(a) + parseInt(b);
            }, 0);
            console.log("govt partial "+govtpartial);

            var prifull = data.filter(function (data) {
                return data.Subdivision == "Private Houses Fully Damaged" && data.District.toLowerCase() == nepal.properties.DISTRICT.toLowerCase();
            }).map(function (data) {
                return data.no;
            }).reduce(function (a, b) {
                return parseInt(a) + parseInt(b);
            }, 0);
            console.log("pri full "+prifull);

            var pripartial = data.filter(function (data) {
                return data.Subdivision == "Private Houses Partially Damaged" && data.District.toLowerCase() == nepal.properties.DISTRICT.toLowerCase();
            }).map(function (data) {
                return data.no;
            }).reduce(function (a, b) {
                return parseInt(a) + parseInt(b);
            }, 0);
            console.log("pri full "+prifull);

            var sum = [];
            var otherValue= 0,thisValue=0;
            var basics = setupBarChartBasics();
            var margin = basics.margin,
                width = basics.width,
                height = basics.height,
                colorBar = basics.colorBar,
                barPadding = basics.barPadding
                ;

            updateBarChart("#barChartHC", "#plotbarChartHC", colorBar);
            updateBarChart("#barChartID", "#plotbarChartID", colorBar);

            function updateBarChart(divId, barChartId, colorBar) {
                if (divId.localeCompare("#barChartHC") == 0) {
                    //clear sum array first
                    // sum.length=0;
                    title = "Human Casualties";
                    divison = "Human Causalities";
                    subDivision = ["Death", "Injured"];
                    //
                    sum[0] = deaths;
                    sum[1] = injured;
                    //console.log(sum);
                }
                if (divId.localeCompare("#barChartID") == 0) {
                    subDivision = ["Fully Damaged", "Partially Damaged"];
                    if (document.getElementById("selectMode").value.localeCompare("Goverment")==0) {

                        title = "Goverment Infrastructure Damage";
                        division = "Goverment Infrastructural Damage";

                        //  getSum(districtArray, divison, subDivision);
                        sum[0] = govtfull;
                        sum[1] = govtpartial;
                        thisValue=govtfull+" "+govtpartial;
                        otherValue=prifull+" "+pripartial;
                        //console.log(sum);
                    }
                    if (document.getElementById("selectMode").value.localeCompare("Private")==0) {
                        title = "Private Infrastructure Damage";
                        division = "Private Infrastructural Damage";
                        sum[0] = prifull;
                        sum[1] = pripartial;
                        thisValue=prifull+" "+pripartial;
                        otherValue=govtfull+" "+govtpartial;
                        //console.log(sum);
                    }
                }

                // console.log(districtArray);


                var xScale = d3.scale.linear()
                        .domain([0, sum.length])
                        .range([0, width])
                    ;

                var yScale = d3.scale.linear()
                        .domain([0, d3.max(sum)])
                        .range([height, 0])
                    ;

                var svg = d3.select(divId + " svg")
                    ;

                var plot = svg
                        .datum(sum)
                    ;

                //data seq death injured fully partially

                //just need to select element no more appending
                plot.selectAll("rect")
                    .data(sum)
                    .transition()
                    .duration(750)
                    .attr("x", function (sum, i) {
                        return xScale(i);
                    })
                    .attr("width", width / (sum.length + 3) - barPadding)
                    .attr("y", function (sum) {
                        return yScale(sum);
                    })
                    //.attr("y",function(sum){return sum;})
                    .attr("height", function (d) {
                        return height - yScale(d);
                    })
                    // .attr("height",function(d){return height;})
                    .attr("fill", colorBar)
                    .attr("otherValue",otherValue)
                    .attr("thisValue",thisValue)
                ;

                //add y labels to plot
                plot.selectAll("text.yAxis")
                    .data(sum)
                    .transition()
                    .duration(750)
                    .text(function (d) {
                        if (formatAsInteger(d3.round(d))==0)
                            return " ";
                        else return formatAsInteger(d3.round(d));
                    })
                    .attr("text-anchor", "middle")
                    //set x position to the left edge of each bar plus half the har width
                    .attr("x", function (d, i) {
                        return (i * (width / sum.length))
                            + ((width / (sum.length + 3) - barPadding) / 2);
                    })
                    .attr("y", function (d) {
                        return yScale(d) - 6;
                    })
                    .attr("class", "yAxis")
                ;

                //for x axis the data is diff
                //title
                var districtName= nepal.properties.DISTRICT.charAt(0).toUpperCase()+nepal.properties.DISTRICT.slice(1).toLowerCase();
                console.log(districtName);
                svg.selectAll("text.title")
                    .attr("x", (width + margin.left + margin.right) / 2+20)
                    .attr("y", 55)
                    .transition()
                    .duration(900)
                    .attr("class", "title")
                    .attr("text-anchor", "middle")
                    .text(title+" in "+districtName)
                ;
                //x axis label are same as created no need to update
            }
        }
    };

    function mouseover(nepal) {
        var absoluteMousePos = d3.mouse(bodyNode);
        toolTipDiv = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
        ;

        toolTipDiv.transition()
            .duration(500)
            .style("opacity", 1);

        toolTipDiv
            .style('left', (absoluteMousePos[0] + 10) + 'px')
            .style('top', (absoluteMousePos[0] - 10) + 'px')
            .style('position', 'absolute')
            .style('z-index', 1001)

            //.text(d3.event.pageX + ", " + selectedDistrict.properties.DISTRICT +","+ d3.event.pageY)
            .text(nepal.properties.DISTRICT + ", Hits: " + nepal.no);
    }
    function mousemove(nepal) {

        var absoluteMousePos = d3.mouse(bodyNode);

        toolTipDiv
            //.text(d3.event.pageX + ", " + nepal.properties.DISTRICT +","+ d3.event.pageY)
            .text(nepal.properties.DISTRICT + ", Hits: " + nepal.no)
            .style("left", (absoluteMousePos[0] + 10) + 'px')
            .style("top", (absoluteMousePos[1] - 10) + 'px')
            .style("opacity", 1);
    }
    function mouseout() {
        toolTipDiv.remove();
    }
}

d3.csv("data/Data_map.csv", createBar);
function setupBarChartBasics() {
    var margin = {top: 150, right: 5, bottom: 10, left: 150},
        width = 500 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom,
        colorBar = d3.scale.category20(),
        barPadding = 2
        ;
    return {
        margin: margin,
        width: width,
        height: height,
        colorBar: colorBar,
        barPadding: barPadding
    }
        ;
}
function createBar(data) {


    var deaths = data.filter(function (data) {
        return data.Subdivision == "Death";
    }).map(function (data) {
        return data.no;
    }).reduce(function (a, b) {
        return parseInt(a) + parseInt(b);
    }, 0);


    var injured = data.filter(function (data) {
        return data.Subdivision == "Injured";
    }).map(function (data) {
        return data.no;
    }).reduce(function (a, b) {
        return parseInt(a) + parseInt(b);
    }, 0);
    var govtfull = data.filter(function (data) {
        return data.Subdivision == "Govt. Houses Fully Damaged";
    }).map(function (data) {
        return data.no;
    }).reduce(function (a, b) {
        return parseInt(a) + parseInt(b);
    }, 0);
    console.log("gov full "+govtfull);
    var govtpartial = data.filter(function (data) {
        return data.Subdivision == "Govt. Houses Partially Damaged";
    }).map(function (data) {
        return data.no;
    }).reduce(function (a, b) {
        return parseInt(a) + parseInt(b);
    }, 0);
    console.log("gov partial "+govtpartial);
    var prifull = data.filter(function (data) {
        return data.Subdivision == "Private Houses Fully Damaged";
    }).map(function (data) {
        return data.no;
    }).reduce(function (a, b) {
        return parseInt(a) + parseInt(b);
    }, 0);
    console.log("pri full "+prifull);
    var pripartial = data.filter(function (data) {
        return data.Subdivision == "Private Houses Partially Damaged";
    }).map(function (data) {
        return data.no;
    }).reduce(function (a, b) {
        return parseInt(a) + parseInt(b);
    }, 0);
    console.log("pri partial "+pripartial);
    var sum = [];
    createBarChart("#barChartHC", "#plotbarChartHC");
    createBarChart("#barChartID", "#plotbarChartID");

    var otherValue= 0,thisValue=0;
    function createBarChart(divId, barChartId) {

        if (divId.localeCompare("#barChartHC") == 0) {
            //clear sum array first
            // sum.length=0;
            title = " Overall Human Casualties";
            divison = "Overall Human Causalities";
            subDivision = ["Death", "Injured"];
            //
            sum[0] = deaths;
            sum[1] = injured;
            console.log(sum);
        }
        if (divId.localeCompare("#barChartID") == 0) {

            subDivision = ["Fully Damaged", "Partially Damaged"];

            if (document.getElementById("selectMode").value.localeCompare("Goverment")==0) {
                title = "Overall Goverment Infrastructure Damage";
                division = "Overall Goverment Infrastructural Damage";

                //  getSum(districtArray, divison, subDivision);
                sum[0] = govtfull;
                sum[1] = govtpartial;
                thisValue=govtfull+" "+govtpartial;
                otherValue=prifull+" "+pripartial;
                console.log(sum);
            }
            if (document.getElementById("selectMode").value.localeCompare("Private")==0) {
                title = "Overall Private Infrastructure Damage";
                division = "Overall Private Infrastructural Damage";
                sum[0] = prifull;
                sum[1] = pripartial;
                thisValue=prifull+" "+pripartial;
                otherValue=govtfull+" "+govtpartial;
                console.log(sum);
            }
        }

        // console.log(districtArray);
        var basics = setupBarChartBasics();
        var margin = basics.margin,
            width = basics.width,
            height = basics.height,
            colorBar = basics.colorBar,
            barPadding = basics.barPadding
            ;

        var xScale = d3.scale.linear()
                .domain([0, sum.length])
                .range([0, width])
            ;

        var yScale = d3.scale.linear()
                .domain([0, d3.max(sum)])
                .range([height, 0])
            ;

        var svg = d3.select(divId)
                .append("svg")
                .attr("width", width + margin.left + margin.right+100)
                .attr("height", height + margin.top + margin.bottom+20)
                .attr("id", barChartId)
                .attr("style", "border: 1px solid red;")
        //.attr("style","")
            ;

        var plot = svg
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            ;

        //data seq death injured fully partially

        //draw bargraph
        plot.selectAll("rect")
            .data(sum)
            .enter()
            .append("rect")
            .attr("x", function (sum, i) {
                return xScale(i);
            })
            .attr("width", width / (sum.length + 3) - barPadding)
            .attr("y", function (sum) {
                return yScale(sum);
            })
            //.attr("y",function(sum){return sum;})
            .attr("height", function (d) {
                return height - yScale(d) ;
            })
            // .attr("height",function(d){return height;})
            .attr("fill", "orange")
            .attr("otherValue",otherValue)
            .attr("thisValue",thisValue)
        ;
        //add y labels to plot
        plot.selectAll("text")
            .data(sum)
            .enter()
            .append("text")
            .text(function (d) {
                return formatAsInteger(d3.round(d));
            })
            .attr("text-anchor", "middle")
            //set x position to the left edge of each bar plus half the har width
            .attr("x", function (d, i) {
                return (i * (width / sum.length))
                    + ((width / (sum.length + 3) - barPadding) / 2);
            })
            .attr("y", function (d) {
                return yScale(d) - 6;
            })
            .attr("class", "yAxis")

        ;

        //for x axis the data is diff
        //title
        svg.append("text")
            .attr("x", (width + margin.left + margin.right) / 2+20)
            .attr("y", 55)
            .attr("class", "title")
            .attr("text-anchor", "middle")
            .text(title)
        ;

        //x axis label differs, add x labels to chart
        var xLabels = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + (margin.top + height) + ")")
            ;

        xLabels.selectAll("text.xAxis")
            .data(subDivision)
            .enter()
            .append("text")
            .text(function (d) {
                return d;
            })
            .attr("text-anchor", "middle")

            //set x position to the left edge of each bar plus half the bar width
            .attr("x", function (d, i) {
                return (i * (width / subDivision.length)) + ((width / (subDivision.length+3) - barPadding) / 2)
            })
            .attr("y", 15)
            .attr("class", "xAxis")

        ;



    }

}



function updateBarOnSelect(){
    var myselect = document.getElementById("selectMode");
     var selected=myselect.options[myselect.selectedIndex].value;

    //interchange of the value
    var thisValue=document.getElementsByTagName('rect')[3].getAttribute("otherValue");
    var otherValue=document.getElementsByTagName('rect')[3].getAttribute("thisValue");
    var sum=thisValue.split(" ");

    function setupBarChartBasics() {
        var margin = {top: 150, right: 5, bottom: 20, left: 50},
            width = 500 - margin.left - margin.right,
            height = 250 - margin.top - margin.bottom,
            colorBar = d3.scale.category20(),
            barPadding = 2
            ;
        return {
            margin: margin,
            width: width,
            height: height,
            colorBar: colorBar,
            barPadding: barPadding
        }
            ;
    }

    function updateBar() {

        var otherValue;
        var basics = setupBarChartBasics();
        var margin = basics.margin,
            width = basics.width,
            height = basics.height,
            colorBar = basics.colorBar,
            barPadding = basics.barPadding;
        subDivision = ["Fully Damaged", "Partially Damaged"];
                if (document.getElementById("selectMode").value.localeCompare("Goverment")==0) {

                    title = "Goverment Infrastructure Damage";
                }
                if (document.getElementById("selectMode").value.localeCompare("Private")==0) {

                    title = "Private Infrastructure Damage";
                }
            }
            var xScale = d3.scale.linear()
                    .domain([0, sum.length])
                    .range([0, width]);
            var yScale = d3.scale.linear()
                    .domain([0, d3.max(sum)])
                    .range([height, 0]);
            var svg = d3.select(divId + " svg");
            var plot = svg.datum(sum);

            //data seq death injured fully partially

            //just need to select element no more appending
            plot.selectAll("rect")
                .data(sum)
                .transition()
                .duration(750)
                .attr("x", function (sum, i) {
                    return xScale(i);
                })
                .attr("width", width / (sum.length + 3) - barPadding)
                .attr("y", function (sum) {
                    return yScale(sum);
                })
                //.attr("y",function(sum){return sum;})
                .attr("height", function (d) {
                    return height - yScale(d);
                })
                // .attr("height",function(d){return height;})
                .attr("fill", colorBar)
                .attr("otherValue",otherValue)
            ;

            //add y labels to plot
            plot.selectAll("text.yAxis")
                .data(sum)
                .transition()
                .duration(750)
                .text(function (d) {
                    if (formatAsInteger(d3.round(d))==0)
                        return " ";
                    else return formatAsInteger(d3.round(d));
                })
                .attr("text-anchor", "middle")
                //set x position to the left edge of each bar plus half the har width
                .attr("x", function (d, i) {
                    return (i * (width / sum.length))
                        + ((width / (sum.length + 3) - barPadding) / 2);
                })
                .attr("y", function (d) {
                    return yScale(d) - 6;
                })
                .attr("class", "yAxis")
            ;

            //for x axis the data is diff
            //title
            svg.selectAll("text.title")
                .attr("x", (width + margin.left + margin.right) / 2+20)
                .attr("y", 15)
                .attr("class", "title")
                .attr("text-anchor", "middle")
                .text(nepal.properties.DISTRICT + " " + title)
            ;
            //x axis label are same as created no need to update

}


