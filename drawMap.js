/**
 * Created by silentflutes on 10/6/2015.
 */

//size of canvas
var width = 750;
var height = 500;

//formatting number as per required
var formatAsInteger = d3.format(",");

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
    };
}


d3.json("data/nepal-districts.geojson", createMap);

function createMap(nepal) {
    //console.log(nepal);
    var title = d3.select("#map").append("h4")
        .attr("align", "center")
        .attr("height", "5px")
        .attr("class", "maptitle")
        //.attr("style", "border: 1px solid red;")
        .html("Nepal : Earthquake 2015 ");

    var canvas = d3.select("#map")
            .append("svg")
            .attr("width", width)
            .attr("height", height + 50)
    // .attr("style", "border: 1px solid red;")
        ;

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

    //function setting class name based on hit no and css colours district based on class name
    var quantizeHitIntoColor = d3.scale.quantize()
        // 9 is max no of hit
        .domain([0, 9])
        .range(d3.range(9).map(function (i) {
            if (i <= 9 && i >= 7) return "red";
            else if (i <= 6 && i >= 4) return "pink";
            else if (i <= 3 && i >= 1) return "yellow";
            else return "green";
        }));

    //plotting map
    var plotDistricts = group.append("path")
        .attr("d", geoPath)
        // .attr("class",function (d){return quantizeHitIntoColor(rateById.get(d.District));})
        .attr("class", function (d) {
            return quantizeHitIntoColor(d.no)
        })
        //.attr("fill",function(d,i){return color(i);})
        .attr("stroke", "#ccc")
        .attr("stroke-width", "2px")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout)
        .on("click", mouseclick);

    var color_domain = [150, 350, 1500];
    var ext_color_domain = [0, 150, 350, 1500];
    var legend_labels = ["0", "1-3", "4-6", "7-9"];
    var color = d3.scale.threshold()
        .domain(color_domain)
        //reverse order as of displayed
        .range(["#CCFF99", "#ffba00", "#ff7d73", "#ff1300"]);

    //rgb color codes
    /*  rgb(255,255,255)", "rgb(255,230,230)", "rgb(255,150,150)", "rgb(255,100,100)", "rgb(230,100,100)",
     "rgb(235,90,90)","rgb(240,80,80)","rgb(245,60,60)","rgb(250,50,50)","rgb(255,0,0)*/


    var legendTitle = canvas.selectAll("g.legendTitle")
            .data(["No of Hits"])
            .enter().append("g")
            .attr("class", "legendTitle")
        ;

    legendTitle.append("text")
        .attr("x", 20)
        .attr("y", height - 105)
        .text(function (d) {
            return d;
        });

    var legend = canvas.selectAll("g.legend")
        .data(ext_color_domain)
        .enter().append("g")
        .attr("class", "legend");

    var legendWidth = 20, legendHeight = 20;

    legend.append("rect")
        .attr("x", 20)
        .attr("y", function (d, i) {
            return height - (i * legendHeight) - 2 * legendHeight;
        })
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", function (d) {
            return color(d);
        })
        .style("opacity", 0.8)
    ;

    legend.append("text")
        .attr("x", 50)
        .attr("y", function (d, i) {
            return height - (i * legendHeight) - legendHeight - 4;
        })
        .text(function (d, i) {
            return legend_labels[i];
        });

    //mouse event handler
    var bodyNode = d3.select('body').node();
    var toolTipDiv;

    function mouseclick(nepal) {
        var districtName = nepal.properties.DISTRICT.charAt(0).toUpperCase()+ nepal.properties.DISTRICT.slice(1).toLowerCase();
        d3.csv("data/Data_map.csv", updateBar);
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
            console.log("govt full " + govtfull);

            var govtpartial = data.filter(function (data) {
                return data.Subdivision == "Govt. Houses Partially Damaged" && data.District.toLocaleLowerCase() == nepal.properties.DISTRICT.toLowerCase();
            }).map(function (data) {
                return data.no;
            }).reduce(function (a, b) {
                return parseInt(a) + parseInt(b);
            }, 0);
            console.log("govt partial " + govtpartial);

            var prifull = data.filter(function (data) {
                return data.Subdivision == "Private Houses Fully Damaged" && data.District.toLowerCase() == nepal.properties.DISTRICT.toLowerCase();
            }).map(function (data) {
                return data.no;
            }).reduce(function (a, b) {
                return parseInt(a) + parseInt(b);
            }, 0);
            console.log("pri full " + prifull);

            var pripartial = data.filter(function (data) {
                return data.Subdivision == "Private Houses Partially Damaged" && data.District.toLowerCase() == nepal.properties.DISTRICT.toLowerCase();
            }).map(function (data) {
                return data.no;
            }).reduce(function (a, b) {
                return parseInt(a) + parseInt(b);
            }, 0);
            console.log("pri full " + prifull);

            var sum = [];
            var otherValue = 0, thisValue = 0;
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
                    if (document.getElementById("selectMode").value.localeCompare("Goverment") == 0) {

                        title = "Goverment Infrastructure Damage";
                        division = "Goverment Infrastructural Damage";

                        //  getSum(districtArray, divison, subDivision);
                        sum[0] = govtfull;
                        sum[1] = govtpartial;
                        //for swapping values when select option changed
                        thisValue = govtfull + " " + govtpartial;
                        otherValue = prifull + " " + pripartial;
                        //console.log(sum);
                    }
                    if (document.getElementById("selectMode").value.localeCompare("Private") == 0) {
                        title = "Private Infrastructure Damage";
                        division = "Private Infrastructural Damage";
                        sum[0] = prifull;
                        sum[1] = pripartial;
                        thisValue = prifull + " " + pripartial;
                        otherValue = govtfull + " " + govtpartial;
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

                //for x axis the data is diff
                //title
                //data seq death injured fully partially

                //just need to select element no more appending
                plot.selectAll("rect")
                    .data(sum)
                    .transition()
                    .duration(750)
                    //x and y are point from where plotting begins
                    .attr("x", function (d, i) {
                        return xScale(i);
                    })
                    .attr("width", width / (sum.length + 3) - barPadding)
                    .attr("y", function (d) {
                        //happens  if input is 0
                        if (yScale(d) == height) return height;//bring y point to y=0
                        else return yScale(d);
                    })
                    //.attr("y",function(sum){return sum;})
                    .attr("height", function (d) {
                        if (yScale(d) == height) return 0;
                        else return height - (yScale(d) % height)
                            ;
                    })
                    // .attr("height",function(d){return height;})
                    .attr("fill", colorBar)
                    .attr("otherValue", otherValue)
                    .attr("thisValue", thisValue)
                    .attr("district", districtName)
                ;

                //add y labels to plot
                plot.selectAll("text.yAxis")
                    .data(sum)
                    .transition()
                    .duration(750)
                    .text(function (d) {
                        if (formatAsInteger(d3.round(d)) == 0)return " ";
                        else return formatAsInteger(d3.round(d));
                    })
                    .attr("text-anchor", "middle")
                    //set x position to the left edge of each bar plus half the har width
                    .attr("x", function (d, i) {
                        return (i * (width / sum.length)) + ((width / (sum.length + 3) - barPadding) / 2);
                    })
                    .attr("y", function (d) {
                        if (yScale(d) == height) return height - 6;
                        else return yScale(d) - 6;
                    })
                    .attr("class", "yAxis")
                ;
                console.log(districtName);
                svg.selectAll("text.title")
                    .attr("x", (width + margin.left + margin.right) / 2 + 20)
                    .attr("y", 55)
                    .transition()
                    .duration(750)
                    .attr("class", "title")
                    .attr("text-anchor", "middle")
                    .text(title + " in " + districtName)
                ;
                //x axis label are same as created so no need to be update
            }
        }
    };

    function mouseover(nepal) {
        var districtName = nepal.properties.DISTRICT.charAt(0).toUpperCase()+ nepal.properties.DISTRICT.slice(1).toLowerCase();
        var absoluteMousePos = d3.mouse(bodyNode);
        toolTipDiv = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
        ;

        toolTipDiv
            .style("opacity", 1)
            .style('left', (absoluteMousePos[0]) + 'px')
            .style('top', (absoluteMousePos[1]) + 'px')
            .style('z-index',1001)
            //.text(d3.event.pageX + ", " + selectedDistrict.properties.DISTRICT +","+ d3.event.pageY)
            .text(districtName + ", Hits: " + nepal.no);
    }

    function mousemove(nepal) {
        var districtName = nepal.properties.DISTRICT.charAt(0).toUpperCase()+ nepal.properties.DISTRICT.slice(1).toLowerCase();
        var absoluteMousePos = d3.mouse(bodyNode);

        toolTipDiv
            //.text(d3.event.pageX + ", " + nepal.properties.DISTRICT +","+ d3.event.pageY)
            .text(districtName + ", Hits: " + nepal.no)
            .style("left", (absoluteMousePos[0]) + 'px')
            .style("top", (absoluteMousePos[1]) + 'px')
            .style("opacity", 1)
            //jitter is due to displacement of one div by another
            .style("float","left")
        ;

    }

    function mouseout() {
        toolTipDiv.remove();
    }
}

d3.csv("data/Data_map.csv", createBar);

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
    //console.log("gov full "+govtfull);
    var govtpartial = data.filter(function (data) {
        return data.Subdivision == "Govt. Houses Partially Damaged";
    }).map(function (data) {
        return data.no;
    }).reduce(function (a, b) {
        return parseInt(a) + parseInt(b);
    }, 0);
    //console.log("gov partial "+govtpartial);
    var prifull = data.filter(function (data) {
        return data.Subdivision == "Private Houses Fully Damaged";
    }).map(function (data) {
        return data.no;
    }).reduce(function (a, b) {
        return parseInt(a) + parseInt(b);
    }, 0);
    //console.log("pri full "+prifull);
    var pripartial = data.filter(function (data) {
        return data.Subdivision == "Private Houses Partially Damaged";
    }).map(function (data) {
        return data.no;
    }).reduce(function (a, b) {
        return parseInt(a) + parseInt(b);
    }, 0);
    //console.log("pri partial "+pripartial);
    var sum = [];
    createBarChart("#barChartHC", "#plotbarChartHC");
    createBarChart("#barChartID", "#plotbarChartID");

    var otherValue = 0, thisValue = 0;
    var className;

    function createBarChart(divId, barChartId) {

        if (divId.localeCompare("#barChartHC") == 0) {
            //clear sum array first
            // sum.length=0;
            title = "Overall Human Casualties";
            divison = "Overall Human Causalities";
            subDivision = ["Death", "Injured"];
            className = "HC";
            //
            sum[0] = deaths;
            sum[1] = injured;
            //console.log(sum);
        }
        if (divId.localeCompare("#barChartID") == 0) {
            className = "ID"
            subDivision = ["Fully Damaged", "Partially Damaged"];

            if (document.getElementById("selectMode").value.localeCompare("Goverment") == 0) {
                title = "Overall Goverment Infrastructure Damage";
                division = "Overall Goverment Infrastructural Damage";

                //  getSum(districtArray, divison, subDivision);
                sum[0] = govtfull;
                sum[1] = govtpartial;
                thisValue = govtfull + " " + govtpartial;
                otherValue = prifull + " " + pripartial;
                //console.log(sum);
            }
            if (document.getElementById("selectMode").value.localeCompare("Private") == 0) {
                title = "Overall Private Infrastructure Damage";
                division = "Overall Private Infrastructural Damage";
                sum[0] = prifull;
                sum[1] = pripartial;
                thisValue = prifull + " " + pripartial;
                otherValue = govtfull + " " + govtpartial;
                //console.log(sum);
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
                .attr("width", width + margin.left + margin.right + 100)
                .attr("height", height + margin.top + margin.bottom + 20)
                .attr("id", barChartId)
        // .attr("style", "border: 1px solid red;")
        //.attr("style","")
            ;

        var plot = svg
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            ;


        //function setting class name based on hit no and css colours district based on class name

        /*var quantizeDeathIntoColor = d3.scale.quantize()
         // 9 is max no of hit
         .domain([0, deaths])
         .range(d3.range(deaths).map(function (i) {
         if (i>=0.75*deaths) return "red";
         else if (i>=0.50) return "pink";
         else if(i>=0.25) return "yellow";
         else return "green";
         }));
         */
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
                if (yScale(sum) == height) return height;
                else return yScale(sum);
            })
            //.attr("y",function(sum){return sum;})
            .attr("height", function (d) {
                if (yScale(d) == height) return height;
                return height - (yScale(d) % height);
                //);
            })
            // .attr("height",function(d){return height;})
            .attr("fill", colorBar)
            .attr("otherValue", otherValue)
            .attr("thisValue", thisValue)
            .attr("id", className)
            .attr("district", "Overall")
            //values saved series Death, Injured ,Gov full,Gov part, Pri full,Pri part
            .attr("overallValuesHC", deaths + "," + injured)
            .attr("overallGovermentValuesID", govtfull + "," + govtpartial)
            .attr("overallPrivateValuesID", prifull + "," + pripartial)
        ;


        //for x axis the data is diff
        //title
        svg.append("text")
            .attr("x", (width + margin.left + margin.right) / 2 + 20)
            .attr("y", 55)
            .attr("class", "title")
            .attr("text-anchor", "middle")
            .text(title)
        ;
        //x axis label differs, add x labels to chart
        var xLabels = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + (margin.top + height) + ")");
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
                return (i * (width / subDivision.length)) + ((width / (subDivision.length + 3) - barPadding) / 2)
            })
            .attr("y", 15)
            .attr("class", "xAxis");

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
            .attr("y", function (sum) {
                if (yScale(sum) == height)
                    return height - 6;
                else return yScale(sum) - 6;
            })
            .attr("class", "yAxis")

        ;


    }
}

function updateBarOnSelect() {
    var myselect = document.getElementById("selectMode");
    var selected = myselect.options[myselect.selectedIndex].value;


    //interchange of the value
    //first value in array is full other is partial Infrastructure damage
    var thisValue = document.getElementById("ID").getAttribute("otherValue").split(" ");
    var otherValue = document.getElementById("ID").getAttribute("thisValue").split(" ");
    var sum = [];
    sum[0] = parseInt(thisValue[0]);
    sum[1] = parseInt(thisValue[1]);


    var districtName = document.getElementById("ID").getAttribute("district");
    console.log("selection: " + selected + " " + "district: " + districtName + " this value:" + thisValue + " other value:" + otherValue);
    console.log(sum);



    var basics = setupBarChartBasics();
    var margin = basics.margin,
        width = basics.width,
        height = basics.height,
        colorBar = basics.colorBar,
        barPadding = basics.barPadding;
    subDivision = ["Fully Damaged", "Partially Damaged"];
    if (document.getElementById("selectMode").value.localeCompare("Goverment") == 0) {
        if (districtName == "Overall") title = districtName + " Goverment Infrastructure Damage";
        else title = "Goverment Infrastructure Damage in " + districtName;
    }
    if (document.getElementById("selectMode").value.localeCompare("Private") == 0) {
        if (districtName == "Overall") title = districtName + " Private Infrastructure Damage";
        else title = "Private Infrastructure Damage in " + districtName;
    }

    var xScale = d3.scale.linear()
        .domain([0, sum.length])
        .range([0, width]);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(sum)])
        .range([height, 0]);


    var svg = d3.select("#barChartID svg");
    //svg.exit().remove();

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
            //happens  if input is 0
            if (yScale(sum) == height) return height;//bring y point to y=0
            else return yScale(sum);
        })
        //.attr("y",function(sum){return sum;})
        .attr("height", function (d) {
            if (yScale(d) == height) return 0;
            else return height - (yScale(d) % height);
            //);
        })
        // .attr("height",function(d){return height;})
        .attr("fill", colorBar)
        .attr("otherValue", otherValue[0] + " " + otherValue[1])
        .attr("thisValue", thisValue[0] + " " + thisValue[1])
    ;

    //add y labels to plot
    plot.selectAll("text.yAxis")
        .data(sum)
        .transition()
        .duration(750)
        .text(function (d) {
            if (formatAsInteger(d3.round(d)) == 0)
                return " ";
            else return formatAsInteger(d3.round(d));
        })
        .attr("text-anchor", "middle")
        //set x position to the left edge of each bar plus half the har width
        .attr("x", function (d, i) {
            return (i * (width / sum.length))
                + ((width / (sum.length + 3) - barPadding) / 2);
        })
        .attr("y", function (sum) {
            if (yScale(sum) == height)
                return height - 6;
            else return yScale(sum) - 6;
        })
        .attr("class", "yAxis")
    ;

    //for x axis the data is diff
    //title
    console.log(districtName);
    svg.selectAll("text.title")
        .attr("x", (width + margin.left + margin.right) / 2 + 20)
        .attr("y", 55)
        .transition()
        .duration(900)
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .text(title)
    ;
    //x axis label are same as created no need to update
}



