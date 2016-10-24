///////////////////////////For Experiment Begin/////////////////////////////

//global configuration, for debug
var debugLog = false;
var debugVis = false;
var conditionThreshold = 0; //fade: 0; nofade: 1; normal: 0.5

//for encoding
var hoverId;
var clickId;

//for data collection
var smData = {
    "hover": 0,
    "click": 0,
    "fadeDelay": 500,
    "clickFadeDelay":1000,
    "condition": "",
    "log": []   //visited data table (JSON Array)
};
var currentHover = null;

//for condition
// if (Math.random() >= conditionThreshold) {
//     smData.condition = "fade";
// } else {
    smData.condition = "nofade";
// }
console.log(smData.condition);

//add visit marks: fade=expVisited; nofade=visited
var visitMark = smData.condition == "fade" ? "expVisited" : "visited";


///////////////////////////For Experiment End/////////////////////////////

//one function call
//loadCO2Vis();


//visit
function hoverVisitFunc(ctr){
    var name = ctr.toLowerCase();


    //list
    d3.select(".list-el."+name).classed(visitMark, true)
    //map
    d3.select("#" + name).selectAll("path").classed(visitMark, true)
    //line
    d3.selectAll(".marks."+ctr).classed(visitMark, true)
    d3.selectAll(".line-chart."+name).classed(visitMark, true)

    currentHover.type = "hover-visit";
    console.log("hover visit!");
}

function yearVisitFunc(year){
    var nYear = Number(year);
    console.log(".y_button b" + year)
    d3.selectAll(".y_button.b" + year).classed(visitMark, true)
    
    console.log("click year visit!")
}

//APPEND COUNTRY TAGS
function add_label(ctr, flag, pos) {
    /*chart.append("rect")
     .attr("class","ctr-label")
     .attr("x",pos[0])
     .attr("y",pos[1]-20)
     .attr("width",200)
     .attr("height",18)
     .attr("fill","url(#gradient)")
     chart.append("image")
     .attr("class","ctr-label")
     .attr("x",pos[0]+5)
     .attr("y",pos[1]-17)
     .attr("width",18)
     .attr("height",12)
     .attr("xlink:href","flags/"+flag+".png")
     chart.append("text")
     .attr("class","ctr-label")
     .attr("x",pos[0]+30)
     .attr("y",pos[1]-7)
     .text(ctr);*/
     var layer = chart.append("g")
     .attr("class", "ctr-label layer");

     var bg_rect = layer.append("rect")
     .attr("class", "ctr-label")
            /*.attr("x",pos[0])
            .attr("y",pos[1]-20)*/
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 200)
            .attr("height", 18)
            //.attr("fill","url(#gradient)")
            .style("fill", "rgba(255,255,255,0.9)")

            layer.append("image")
            .attr("class", "ctr-label")
            /*.attr("x",pos[0]+5)
            .attr("y",pos[1]-17)*/
            .attr("x", 5)
            .attr("y", 3)
            .attr("width", 18)
            .attr("height", 12)
            .attr("xlink:href", "flags/" + flag + ".png")

            var ctr_name = layer.append("text")
            .attr("class", "ctr-label name")
            /*.attr("x",pos[0]+30)
            .attr("y",pos[1]-7)*/
            .attr("x", 30)
            .attr("y", 13)
            .text(ctr);


            var min = d3.select(".ctr-label.name").node().getBBox().width;

            bg_rect.attr("width", function () {
        //alert(d3.max(min_max_arr));
        return min + 40;
    })

            layer.append("line")
            .attr("class", "ctr-label")
            .attr("x1", 0)
            .attr("y1", 18)
            .attr("x2", min + 40)
            .attr("y2", 18)
            .style("fill", "none")
            .style("stroke", "#BBB")
            .style("stroke-width", 0.5)
            layer.append("line")
            .attr("class", "ctr-label")
            .attr("x1", function () {
                if (pos[0] <= svg_w * 9 / 10) {
                    return 0;
                } else {
                    return min + 40;
                }
            })
            .attr("y1", 0)
            .attr("x2", function () {
                if (pos[0] <= svg_w * 9 / 10) {
                    return 0;
                } else {
                    return min + 40;
                }
            })
            .attr("y2", 18)
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-width", 2)

            layer.attr("transform", function () {
                if (pos[0] <= svg_w * 9 / 10) {
                    return "translate(" + (pos[0]) + "," + (pos[1] - 9) + ")";
                } else {
            //alert(pos[0]-(d3.max(min_max_arr)+35))
            return "translate(" + (pos[0] - (min + 40)) + "," + (pos[1] - 9) + ")";
        }
    })
            .moveToFront();

        }
        function add_label_with_data(ctr, flag, posx, posy, data, el) {
            var layer = chart.append("g")
            .attr("class", "ctr-label layer");

            var px = parseFloat(posx);
            var py = parseFloat(posy);
            var pos = [px, py];

            var bg_rect = layer.append("rect")
            .attr("class", "ctr-label")
            /*.attr("x",pos[0])
            .attr("y",pos[1]-20)*/
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 200)
            .attr("height", 34)
            //.attr("fill","url(#gradient)")
            .style("fill", "rgba(255,255,255,0.9)")

            layer.append("image")
            .attr("class", "ctr-label")
            /*.attr("x",pos[0]+5)
            .attr("y",pos[1]-17)*/
            .attr("x", 5)
            .attr("y", 3)
            .attr("width", 18)
            .attr("height", 12)
            .attr("xlink:href", "flags/" + flag + ".png")

            var ctr_name = layer.append("text")
            .attr("class", "ctr-label name")
            /*.attr("x",pos[0]+30)
            .attr("y",pos[1]-7)*/
            .attr("x", 30)
            .attr("y", 13)
            .text(ctr);

            var ctr_val = layer.append("text")
            .attr("class", "ctr-label val")
            /*.attr("x",pos[0]+30)
            .attr("y",pos[1]+9)*/
            .attr("x", 30)
            .attr("y", 29)
            .style("font-size", 14)
            //.style("font-style","italic")
            .text(data + "M tonnes");

            var min = d3.select(".ctr-label.name").node().getBBox().width;
            var max = d3.select(".ctr-label.val").node().getBBox().width;

    //alert(min + ", " + max)
    var min_max_arr = [min, max];

    bg_rect.attr("width", function () {
        //alert(d3.max(min_max_arr));
        return d3.max(min_max_arr) + 40;
    })

    layer.append("line")
    .attr("class", "ctr-label")
    .attr("x1", 0)
    .attr("y1", 34)
    .attr("x2", d3.max(min_max_arr) + 40)
    .attr("y2", 34)
    .style("fill", "none")
    .style("stroke", "#BBB")
    .style("stroke-width", 0.5)
    layer.append("line")
    .attr("class", "ctr-label")
    .attr("x1", function () {
        if (pos[0] <= svg_w * 9 / 10) {
            return 0;
        } else {
            return d3.max(min_max_arr) + 40;
        }
    })
    .attr("y1", 0)
    .attr("x2", function () {
        if (pos[0] <= svg_w * 9 / 10) {
            return 0;
        } else {
            return d3.max(min_max_arr) + 40;
        }
    })
    .attr("y2", 34)
    .style("fill", "none")
    .style("stroke", "black")
    .style("stroke-width", 2)

    layer.attr("transform", function () {
        if (pos[0] <= svg_w * 9 / 10) {
            return "translate(" + (pos[0]) + "," + (pos[1] - 17) + ")";
        } else {
            //alert(pos[0]-(d3.max(min_max_arr)+35))
            return "translate(" + (pos[0] - (d3.max(min_max_arr) + 40)) + "," + (pos[1] - 17) + ")";
        }
    });


    el.moveToFront();
}
function add_label_map(ctr, flag, pos) {
    //alert(ctr)
    /*var label = map.append("g")
     .attr("class","ctr-label")
     .attr("transform","translate("+(pos[0]+10)+","+(pos[1]-5)+")");
     
     label.append("rect")
     .attr("class","ctr-label")
     .attr("width",200)
     .attr("height",18)
     .attr("fill","url(#gradient)")
     label.append("image")
     .attr("class","ctr-label")
     .attr("x",5)
     .attr("y",3)
     .attr("width",18)
     .attr("height",12)
     .attr("xlink:href","flags/"+flag+".png")
     
     label.append("text")
     .attr("class","ctr-label")
     .attr("x",30)
     .attr("y",13)
     .text(ctr);*/

    //label.on("mouseover",function(){ d3.event.stopPropagation(); });

    //label.moveToFront();
    var layer = map.append("g")
    .attr("class", "ctr-label layer");

    var bg_rect = layer.append("rect")
    .attr("class", "ctr-label")
            /*.attr("x",pos[0])
            .attr("y",pos[1]-20)*/
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 200)
            .attr("height", 18)
            //.attr("fill","url(#gradient)")
            .style("fill", "rgba(255,255,255,0.9)")

            layer.append("image")
            .attr("class", "ctr-label")
            /*.attr("x",pos[0]+5)
            .attr("y",pos[1]-17)*/
            .attr("x", 5)
            .attr("y", 3)
            .attr("width", 18)
            .attr("height", 12)
            .attr("xlink:href", "flags/" + flag + ".png")

            var ctr_name = layer.append("text")
            .attr("class", "ctr-label name")
            /*.attr("x",pos[0]+30)
            .attr("y",pos[1]-7)*/
            .attr("x", 30)
            .attr("y", 13)
            .text(ctr);


            var min = d3.select(".ctr-label.name").node().getBBox().width;

            bg_rect.attr("width", function () {
        //alert(d3.max(min_max_arr));
        return min + 40;
    })

            layer.append("line")
            .attr("class", "ctr-label")
            .attr("x1", 0)
            .attr("y1", 18)
            .attr("x2", min + 40)
            .attr("y2", 18)
            .style("fill", "none")
            .style("stroke", "#BBB")
            .style("stroke-width", 0.5)
            layer.append("line")
            .attr("class", "ctr-label")
            .attr("x1", function () {
                if (pos[0] <= svg_w * 3 / 4) {
                    return 0;
                } else {
                    return min + 40;
                }
            })
            .attr("y1", 0)
            .attr("x2", function () {
                if (pos[0] <= svg_w * 3 / 4) {
                    return 0;
                } else {
                    return min + 40;
                }
            })
            .attr("y2", 18)
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-width", 2)

            layer.attr("transform", function () {
                if (pos[0] <= svg_w * 3 / 4) {
                    return "translate(" + (pos[0]) + "," + (pos[1] + 20) + ")";
                } else {
            //alert(pos[0]-(d3.max(min_max_arr)+35))
            return "translate(" + (pos[0] - (min + 40)) + "," + (pos[1] + 20) + ")";
        }
    })
            .moveToFront();

        }


        function move_label_map(pos) {

            var min = d3.select(".ctr-label.name").node().getBBox().width;

            var label = d3.select("g.ctr-label")
            .attr("transform", function () {
                if (pos[0] <= svg_w * 3 / 4 && pos[1] <= svg_h * 2 / 3) {
                    return "translate(" + (pos[0]) + "," + (pos[1] + 18) + ")";
                } else if (pos[0] <= svg_w * 3 / 4 && pos[1] >= svg_h * 2 / 3) {
                    return "translate(" + (pos[0]) + "," + (pos[1] - 22) + ")";
                } else if (pos[0] >= svg_w * 3 / 4 && pos[1] <= svg_h * 2 / 3) {
                    return "translate(" + (pos[0] - (min + 40)) + "," + (pos[1] + 18) + ")";
                } else if (pos[0] >= svg_w * 3 / 4 && pos[1] >= svg_h * 2 / 3) {
                    return "translate(" + (pos[0] - (min + 40)) + "," + (pos[1] - 22) + ")";
                }
            });
            label.moveToFront();
        }
        ;
        function remove_label() {
            d3.selectAll(".ctr-label").remove();
        }



        var projection, svg, path, map
        , chart;


        function loadCO2Vis(){

            projection = d3.geo.mercator()
            .center([100, 60])
            .scale(650)
            .rotate([0, 0]);
//.rotate([0,0]);


svg = d3.select("#map").append("svg")
.attr("height", svg_h)
.attr("width", svg_w);

path = d3.geo.path()
.projection(projection);

svg.append("defs")
.append("filter")
.attr("id", "blur")
.append("feGaussianBlur")
.attr("in", "SourceGraphic")
.attr("stdDeviation", 2);

/*svg.append("rect")
 .attr("id","bg")
 .attr("width",602)
 .attr("height",578)
 .style("fill","lightsteelblue")*/
 map = svg.append("g")
 .attr("transform", "translate(20,-60)");


 svg.append("text")
 .attr("id", "year")
 .attr("x", svg_w - 150)
 .attr("y", svg_h - 30)
 .text("1971")

 svg.append("line")
 .attr("id", "underline")
 .attr("x1", svg_w - 150)
 .attr("x2", svg_w - 30)
 .attr("y1", svg_h - 15)
 .attr("y2", svg_h - 15)
 .style("stroke-width", 10)
 .style("stroke", "black")


 svg.append("text")
 .attr("id", "note")
 .attr("x", 40)
 .attr("y", svg_h - 15)
 .text("Note: data is not available for all world countries.")

/*d3.json("../../data/world_map.json", function(error, topology) {
 map.selectAll("path")
 .data(topojson.object(topology, topology.objects.countries)
 .geometries)
 .enter()
 .append("path")
 .attr("id",function(d){ return "country"+d.id })
 .attr("d", path)
 
 var bbox = d3.select("#country36").getBBox();
 
 alert(bbox.x + ", " + bbox.y)
 
 
});*/
var ctr_color = d3.scale.category20c();


d3.json("data/world-countries.json", function (collection) {

    feature = map.selectAll("path")
    .data(collection.features)
    .enter()
    .append("g")
    .attr("id", function (d) {
        var name = String(d.properties.name);
        var ctr = name.replace(/\ /g, '');
        var id = ctr.toLowerCase();
        return id;
    })
    .attr("name", function (d) {
        return String(d.properties.name)
    })
    .on("mouseover", function () {
        d3.select(this).moveToFront();
    })
    .append("svg:path")
    .attr("d", path)
            //.style("fill","linen")
            //.style("fill","lightsteelblue")
            /*.style("opacity",0.5)
             .style("stroke","#BBB")
             .style("stroke-width",1)
             .style("cursor","pointer")*/
             .attr("class", "map-ctr")
             .on("mouseover", function (d, i) {
                //var name = d3.select(this).attr("id");
                var id = String(d.properties.name);
                var ctr = id.replace(/\ /g, '');
                var name = ctr.toLowerCase();

                var index = (ctr_full_list.indexOf(ctr));


                if (ctr_list_copy.indexOf(ctr) !== -1) {
                    add_label_map(ctr_full_list[index], ctr_flags[index], d3.mouse(this));

                    d3.select(".list-el." + name)
                    .classed("highlight", true);

                    d3.select("#" + name).selectAll("path")
                    .classed("highlight-line", true);

                    d3.select("#" + name).moveToFront();

                    //if(d3.select(this).classed("active-highlight-map")==false){
                    /*d3.select("#"+name).selectAll("path")
                     .style("stroke","firebrick")
                     .style("stroke-width",2);
                     .classed("active-highlight-map",true);*/

                     d3.select(".line-chart." + name)
                            /*.style("stroke","firebrick")
                            .style("stroke-width",2);*/
                            .classed("highlight-line", true)
                            .moveToFront();

                            d3.selectAll(".marks." + ctr)
                            .classed("highlight-line", true)
                            .moveToFront();

                            d3.selectAll(".axis").moveToFront();
                    //}
                } else {
                    d3.select(this).style("cursor", "default");
                }


                var index = (ctr_list.indexOf(ctr));
                //alert(index)
                d3.event.stopPropagation();

                //visit
                if(ctr_list_copy.indexOf(ctr) !== -1){

                    hoverId = setTimeout(hoverVisitFunc, smData.fadeDelay, ctr);
                    
                }

                ///--------- BEGIN add log hover part 1/2----------///
                if(ctr_list_copy.indexOf(ctr) !== -1){
                    currentHover = {"type": "hover",
                    "target": "map",
                    "code": name,
                    "start": Date.now()}
                    if(debugLog) {
                        console.log("hover starts" + currentHover.code);
                    }
                    smData.hover++;
                }   
                ///--------- END add log hover part 1/2----------///


            })
             .on("mousemove", function (d, i) {
                var id = String(d.properties.name);
                var ctr = id.replace(/\ /g, '');
                var name = ctr.toLowerCase();

                //d3.event.stopPropagation();

                var index = (ctr_list.indexOf(ctr));

                if (ctr_list_copy.indexOf(ctr) !== -1) {
                    move_label_map(d3.mouse(this));
                }
            })
             .on("mouseout", function (d, i) {
                //var name = d3.select(this).attr("id");
                var id = String(d.properties.name);
                var ctr = id.replace(/\ /g, '');
                var name = ctr.toLowerCase();

                d3.select(".list-el." + name).classed("highlight", false);

                remove_label();

                if (ctr_list_copy.indexOf(ctr) !== -1) {

                    d3.select("#" + name).selectAll("path")
                            /*.style("stroke","#999")
                            .style("stroke-width",1);*/
                            .classed("highlight-line", false);

                    //if(d3.select(this).classed("active-highlight-map")==false){
                    //d3.select(this).classed("highlight",false);


                    d3.select(".line-chart." + name)
                    .classed("highlight-line", false);


                    d3.selectAll(".marks." + ctr)
                    .classed("highlight-line", false);

                    d3.selectAll(".active-highlight-map")
                    .moveToFront();
                    d3.selectAll(".active-highlight-line")
                    .moveToFront();

                    //}
                } else {
                    d3.select(this).style("cursor", "default");
                }

                //visit
                clearTimeout(hoverId);
                ///--------- BEGIN add log hover part 2/2----------///
                if(currentHover != null) {
                    currentHover.end = Date.now();
                    currentHover.duration = currentHover.end - currentHover.start;
                    smData.log.push(currentHover)
                    currentHover = null;
                    if(debugLog) {
                        console.log("hover ends: "+ smData.log[smData.log.length - 1].code + " with "+smData.log[smData.log.length - 1].duration);  
                    }
                }
                
                ///--------- END add log hover part 2/2----------///

            })
             .on("mouseup", function (d, i) {
                //var name = d3.select(this).attr("id");

                var id = String(d.properties.name);
                var ctr = id.replace(/\ /g, '');
                var name = ctr.toLowerCase();

                if (d3.select(this).classed("active-highlight-map") == false && ctr_list_copy.indexOf(ctr) !== -1) {
                    //d3.select(this).classed("active-highlight",true)
                    d3.select(".list-el." + name).classed("active-highlight", true);
                    d3.select("#" + name).selectAll("path")
                            /*.style("fill","indianred")
                             .style("stroke","firebrick")
                             .style("stroke-width",0.50);*/
                             .classed("active-highlight-map", true);

                             d3.select(".line-chart." + name)
                             .classed("active-highlight-line", true);

                             d3.selectAll(".marks." + ctr)
                             .classed("active-highlight-line", true);
                         } else {
                    //d3.select(this).classed("active-highlight",false)
                    d3.select(".list-el." + name).classed("active-highlight", false);
                    d3.select("#" + name).selectAll("path")
                            /*.style("fill",function(){
                             if(ctr_list_copy.indexOf(ctr) !== -1){ 
                             return "tan"
                             }else{
                             return "linen"
                             }
                             })
                             .style("stroke","#999")
                             .style("stroke-width",1);*/
                             .classed("active-highlight-map", false)
                             d3.select(".line-chart." + name)
                             .classed("active-highlight-line", false);

                             d3.selectAll(".marks." + ctr)
                             .classed("active-highlight-line", false);

                         }

                ///--------- BEGIN add log click ----------///
                smData.log.push({"type": "click",
                    "target": "map",
                    "code": name,
                    "start": Date.now(),
                    "postState": d3.select(this).classed("active-highlight-map")});
                if(debugLog) console.log(smData.log[smData.log.length - 1]);
                smData.click++;
                ///--------- END add log click ----------///
            });



             for (j = 0; j < ctr_list.length; j++) {
        //var ctr_color = d3.scale.linear()
        //.domain([0, ctr_list.length - 1])
        //.range(["lightblue", "lightgreen"]);

        //var countries_arr = d3.keys(dataco2)


        var id = ctr_list[j].toLowerCase();
        var the_color = ctr_color(j);
        var ctr = ctr_list[j];

        d3.select("#" + id).selectAll("path")
        .classed("ctr-data", true);


        var checklist = d3.select("#inner-col").select("table");

        var list = checklist.append("tr")
        .attr("class", id);

        list.append("td")
        .append("input")
        .attr("class", "checkbox")
        .attr("type", "checkbox")
        .attr("name", "country_sel")
        .attr("checked", true)
        .attr("value", ctr_list[j])
        .on("click", function () {
            var val = d3.select(this).attr("value");

                    ///--------- BEGIN add log click ----------///
                    smData.log.push({"type": "click",
                        "target": "checkbox",
                        "code": val,
                        "start": Date.now(),
                        "postState": searchStringInArray(val, ctr_list) == -1});
                    if(debugLog) console.log(smData.log[smData.log.length - 1]);
                    smData.click++;
                    ///--------- END add log click ----------///

                    return remove_from_list(val)
                })

        list.append("td").text(ctr_full_list[j])
                //.style("color",the_color)
                .attr("name", id)
                .attr("class", "list-el " + id)
                //.style("color","tan")
                .on("mouseover", function () {
                    var ctr = d3.select(this).text();
                    var name = d3.select(this).attr("name");
                    d3.select(this).classed("highlight", true);

                    //if(d3.select(this).classed("active-highlight")==false){
                        d3.select("#" + name).selectAll("path")
                            /*.style("stroke","firebrick")
                            .style("stroke-width",2);*/
                            .classed("highlight-line", true);

                            d3.select("#" + name).moveToFront();

                            d3.select(".line-chart." + name)
                            /*.style("stroke","firebrick")
                            .style("stroke-width",2);*/
                            .classed("highlight-line", true)
                            .moveToFront();

                            d3.selectAll(".marks." + ctr)
                            .classed("highlight-line", true)
                            .moveToFront();

                            d3.selectAll(".axis").moveToFront();
                    //}

                //visit
                hoverId = setTimeout(hoverVisitFunc, smData.fadeDelay, ctr);

                ///--------- BEGIN add log hover part 1/2----------///
                
                currentHover = {"type": "hover",
                "target": "list",
                "code": name,
                "start": Date.now()}
                if(debugLog) {
                    console.log("hover starts list " + currentHover.code);
                }
                smData.hover++;
                ///--------- END add log hover part 1/2----------///

            })
                .on("mouseout", function () {
                    var ctr = d3.select(this).text();
                    var name = d3.select(this).attr("name");
                    d3.select(this).classed("highlight", false);

                    //if(d3.select(this).classed("active-highlight")==false){
                        d3.select("#" + name).selectAll("path")
                            /*.style("stroke","#999")
                            .style("stroke-width",1);*/
                            .classed("highlight-line", false);

                            d3.select(".line-chart." + name)
                            /*.style("stroke","tan")
                            .style("stroke-width",1);*/
                            .classed("highlight-line", false);

                            d3.selectAll(".marks." + ctr)
                            .classed("highlight-line", false);

                            d3.selectAll(".active-highlight-map")
                            .moveToFront();
                            d3.selectAll(".active-highlight-line")
                            .moveToFront();
                    //}

                    //visit clear
                    clearTimeout(hoverId);
                    ///--------- BEGIN add log hover part 2/2----------///
                    if(currentHover != null) {
                        currentHover.end = Date.now();
                        currentHover.duration = currentHover.end - currentHover.start;
                        smData.log.push(currentHover)
                        currentHover = null;
                        if(debugLog) {
                            console.log("hover ends: "+ smData.log[smData.log.length - 1].code + " with "+smData.log[smData.log.length - 1].duration);  
                        }
                    }
                    ///--------- END add log hover part 2/2----------///
                })
                .on("mouseup", function () {
                    var ctr = d3.select(this).text();
                    var name = d3.select(this).attr("name");

                    if (d3.select(this).classed("active-highlight") == false) {
                        d3.select(this)
                        .classed("active-highlight", true);

                        d3.select(".line-chart." + name)
                        .classed("active-highlight-line", true);

                        d3.select("#" + name).selectAll("path")
                                /*.style("fill","indianred")
                                 .style("stroke","firebrick")
                                 .style("stroke-width",0.55);*/
                                 .classed("active-highlight-map", true);

                                 d3.selectAll(".marks." + ctr)
                                 .classed("active-highlight-line", true);
                             } else {
                                d3.select(this)
                                .classed("active-highlight", false);

                                d3.select(".line-chart." + name)
                                .classed("active-highlight-line", false);

                                d3.select("#" + name).selectAll("path")
                                /*.style("fill","tan")
                                 .style("stroke","#999")
                                 .style("stroke-width",1);*/
                                 .classed("active-highlight-map", false);

                                 d3.selectAll(".marks." + ctr)
                                 .classed("active-highlight-line", false);
                             }

                    ///--------- BEGIN add log click ----------///
                    smData.log.push({"type": "click",
                        "target": "list",
                        "code": name,
                        "start": Date.now(),
                        "postState": d3.select(this).classed("active-highlight")});
                    if(debugLog) console.log(smData.log[smData.log.length - 1]);
                    smData.click++;
                    ///--------- END add log click ----------///

                })
        //d3.select("tr."+id)
        //.style("background-color",the_color)


    }

    d3.selectAll(".ctr-data")
            //.style("fill",function(d,i){ return ctr_color(i) })
            /*.style("fill",function(d,i){ return "tan" })
             .style("stroke","#999")
             .style("opacity",1)*/
             .classed("map-ctr", false)
             .classed("map-ctr-data", true)
             

             if(smData.condition == "nofade"){
                d3.selectAll(".ctr-data")
                .classed("nofade",true);
            }


            draw_polution("1971");

        });

console.log("all_years: "+all_years)
for (h = 0; h < all_years.length; h++) {

    var y_button = all_years[h];
    //alert(y_button)

    d3.select("#buttons").append("button")
    .attr("class", "y_button b" + y_button)
    .text(y_button)


}

d3.selectAll(".y_button")
.on("mouseup", function (d, i) {
            ///--------- BEGIN add log click ----------///
            smData.log.push({"type": "click",
                "target": "year",
                "code": all_years[i],
                "start": Date.now(),
                "postState": ""});
            if(debugLog) console.log(smData.log[smData.log.length - 1]);
            smData.click++;
            ///--------- END add log click ----------///
            //visit
            clearTimeout(clickId);
            clickId = setTimeout(yearVisitFunc, smData.clickFadeDelay, all_years[i])

            draw_polution(all_years[i])
        })

d3.select(".b" + all_years[0]).classed("selected", true);



// STUFF FOR THE LINE CHART
chart = d3.select("#chart").append("svg")
.attr("height", svg_h / 2)
.attr("width", 815);


// WHITE TO ALPHA GRADIENT
var gradient = chart.append("defs")
.append("linearGradient")
.attr("id", "gradient")
.attr("x1", "0%")
.attr("y1", "0%")
.attr("x2", "100%")
.attr("y2", "0%");
gradient.append("stop")
.attr("offset", "25%")
.style("stop-color", "rgb(255,255,255)")
.style("stop-opacity", 0.9);
gradient.append("stop")
.attr("offset", "100%")
.style("stop-color", "rgb(255,255,255)")
.style("stop-opacity", 0);



var bgs = chart.selectAll(".bg-rect")
.data(all_years_int);

bgs.enter()
.append("rect")
.attr("class", "bg-rect")
.attr("width", function (d, i) {
    return 775 / (all_years.length - 1)
})
.attr("height", svg_h / 2 - 60)
.attr("x", function (d, i) {
    return 40 + (i * 775 / (all_years.length - 1))
})
.attr("y", 30)
.style("fill", function (d, i) {
    if (i % 2 == 0) {
        return "#DEDEDE";
    } else {
        return "#FFF"
    }
})
.style("opacity", 0.5);

//HINDSIGHT marks for years
var yearMarks = chart.selectAll(".year-mark")
.data(all_years_int);

var mks = yearMarks.enter()
.append("g")
.attr("class", function(d, i) {
    return "m" + all_years[i];
})
.classed("year-mark",true)
//.classed("invisible",true)
.attr("transform", function(d, i) {
    var xPos = 40 + (i * 775 / (all_years.length - 1));
    return "translate("+ xPos + ",25)";
});

mks.append("rect")
.attr("class","year-mark-rect")
.attr("width", function (d, i) {
    return 775 / all_years.length
})
.attr("height", 5)

mks.append("rect")
.attr("class","year-mark-rect")
.attr("width", function (d, i) {
    return 775 / all_years.length
})
.attr("height", 5)
.attr("y", svg_h / 2 - 55)

mks.append("rect")
.attr("class","year-mark-rect")
.attr("width", 2)
.attr("height", svg_h / 2 - 55)
.attr("y", 0)





var repere = chart.append("g")
.attr("class", "repere")
.attr("transform", "translate(40,25)")

repere.append("rect")
.attr("width", function (d, i) {
    return 775 / all_years.length
})
.attr("height", 5)
.style("fill", "indianred");

repere.append("rect")
.attr("width", function (d, i) {
    return 775 / all_years.length
})
.attr("height", 5)
.attr("y", svg_h / 2 - 55)
.style("fill", "indianred");

repere.append("rect")
.attr("width", 2)
.attr("height", svg_h / 2 - 55)
.attr("y", 0)
.style("fill", "indianred");

//HINDSIGHT
yearVisitFunc("1971")

arr = d3.values(dataco2);
var arr02 = new Array();


arr.forEach(function (d) {
    var temp_arr = new Array();
    temp_arr.length = 0;
    for (m = 0; m < all_years.length; m++) {
        temp_arr.push(d[all_years[m]].co2)
    }
    arr02.push(temp_arr);
})

var lines = chart.selectAll(".line-chart")
.data(ctr_list);

lines.enter()
.append("path")
.attr("class", function (d) {
    var id = d.toLowerCase();
    return "line-chart " + id
})
.attr("name", function (d) {
    var id = d.toLowerCase();
    return id
})
.attr("d", function (d, i) {
    return line(arr02[i])
})
.attr("transform", "translate(0,0)")
        //.style("stroke","tan")
        .style("fill", "none")
        .on("mouseover", function (d, i) {
            var name = d3.select(this).attr("name");
            d3.select(".list-el." + name).classed("highlight", true);
            d3.select(this).classed("highlight-line", true);

            var sel = d3.select(this);
            sel.moveToFront();
            d3.selectAll(".axis").moveToFront();

            //if(d3.select(this).classed("active-highlight")==false){
                d3.select("#" + name).selectAll("path")
                    /*.style("stroke","firebrick")
                    .style("stroke-width",2);*/
                    .classed("highlight-line", true)

                    d3.select("#" + name).moveToFront();


                    ctr = d;
                    d3.selectAll(".marks." + ctr)
                    .classed("highlight-line", true)
                    .moveToFront();
            /*d3.select("path."+name)
             .style("stroke","firebrick")
             .style("stroke-width",2);*/
            //}
            add_label(ctr_full_list[i], ctr_flags[i], d3.mouse(this));



            //visit
            hoverId = setTimeout(hoverVisitFunc, smData.fadeDelay, ctr);
            ///--------- BEGIN add log hover part 1/2----------///

            currentHover = {"type": "hover",
            "target": "line",
            "code": name,
            "start": Date.now()}
            if(debugLog) {
                console.log("hover starts line: " + currentHover.code);
            }
            smData.hover++;
            ///--------- END add log hover part 1/2----------///

            ///--------- BEGIN add log click ----------///
            smData.log.push({"type": "click",
                "target": "line",
                "code": name,
                "start": Date.now(),
                "postState": !d3.select(this).classed("active-highlight")});
            if(debugLog) console.log(smData.log[smData.log.length - 1]);
            smData.click++;
                ///--------- END add log click ----------///

            })
        .on("mouseout", function (d, i) {
            var name = d3.select(this).attr("name");
            d3.select(".list-el." + name).classed("highlight", false);
            d3.select(this).classed("highlight-line", false);

            remove_label();

            //if(d3.select(this).classed("active-highlight")==false){
                d3.select("#" + name).selectAll("path")
                    /*.style("stroke","#999")
                    .style("stroke-width",1);*/
                    .classed("highlight-line", false)

            /*d3.select("path."+name)
             .style("stroke","tan")
             .style("stroke-width",1)*/
            //}

            var ctr = d;
            d3.selectAll(".marks." + ctr)
            .classed("highlight-line", false);

            d3.selectAll(".active-highlight-map")
            .moveToFront();
            d3.selectAll(".active-highlight-line")
            .moveToFront();

            //visit
            clearTimeout(hoverId);
            ///--------- BEGIN add log hover part 2/2----------///
            if(currentHover != null) {
                currentHover.end = Date.now();
                currentHover.duration = currentHover.end - currentHover.start;
                smData.log.push(currentHover)
                currentHover = null;
                if(debugLog) {
                    console.log("hover ends: "+ smData.log[smData.log.length - 1].code + " with "+smData.log[smData.log.length - 1].duration);  
                }
            }

                ///--------- END add log hover part 2/2----------///

            })
        .on("mouseup", function () {
            var name = d3.select(this).attr("name");
            remove_label();

            if (d3.select(this).classed("active-highlight") == false) {
                d3.select(this).classed("active-highlight-line", true)
                d3.select(".list-el." + name).classed("active-highlight", true);
                d3.select("#" + name).selectAll("path")
                .classed("active-highlight-map", true)
                /*.style("fill","indianred")
                 .style("stroke","firebrick")
                 .style("stroke-width",0.55);*/
                 d3.selectAll(".marks." + ctr)
                 .classed("active-highlight-line", true);

             } else {
                d3.select(this).classed("active-highlight-line", false)
                d3.select(".list-el." + name).classed("active-highlight", false);
                d3.select("#" + name).selectAll("path")
                .classed("active-highlight-map", false)
                /*.style("fill","tan")
                 .style("stroke","#999")
                 .style("stroke-width",1);*/
                 d3.selectAll(".marks." + ctr)
                 .classed("active-highlight-line", false);
             }


         });


/*var x_line = d3.scale.linear()
 .domain([0,all_years_int.length-1])
 .range([40, 815]); 
 
 var y_line = d3.scale.linear()
 .domain([d3.max(range_co2),d3.min(range_co2)])
 .range([30,svg_h/2-30]);
 
 var line = d3.svg.line()
 .x(function(d,i){ return x_line(i); })
 .y(function(d){ return y_line(d); });*/



// APPEND AXES

var xAxis = d3.svg.axis()
.scale(x_tick_range)
.orient("bottom")
.ticks(20)
.tickFormat(d3.format(".0f"));

var yAxis = d3.svg.axis()
.scale(y_line)
.orient("left")
.ticks(5)
.tickFormat(d3.format(".0f"));


chart.append("g")
.attr("class", "axis xAx")
.attr("transform", function () {
    return "translate(40," + (svg_h / 2 - 30) + ")"
})
.call(xAxis);

chart.append("g")
.attr("class", "axis yAx")
.attr("transform", function () {
    return "translate(40," + 0 + ")"
})
.call(yAxis);

d3.selectAll(".domain")
.style("stroke-width", 1)
.style("stroke", "black")
.style("fill", "none")

d3.selectAll(".tick")
.select("line")
.style("stroke-width", 1)
.style("stroke", "black")
.style("fill", "none")


// APPEND INDEXES
chart.append("text")
.attr("x", 40)
.attr("y", 20)
.text("Million tonnes")

// APPEND CIRCLES
// for(var i=0; i<ctr_list.length; i++){

//alert(dataco2_arrs[2].vals.length)
dataco2_arrs.forEach(function (data, index) {

    //alert(data.vals.length)

    var marks = chart.selectAll(".marks." + data.ctr)
    .data(data.vals);


    marks.enter()
    .append("circle")
    .attr("class", "marks " + data.ctr)
    .attr("r", 3)
    .attr("cx", function (d, i) {
        return x_line(i)
    })
    .attr("cy", function (d, i) {
        return y_line(d.co2)
    })
    .on("mouseover", function (d, i) {
                //var name = d3.select(this).attr("name");
                var name = data.ctr.toLowerCase();
                var ctr = data.ctr;

                d3.select(".list-el." + name).classed("highlight", true);
                d3.select(this).classed("highlight-line", true);

                d3.select(".line-chart." + name)
                .classed("highlight-line", true)
                .moveToFront();

                d3.selectAll(".axis").moveToFront();

                d3.select("#" + name).selectAll("path")
                .classed("highlight-line", true)

                d3.select("#" + name).moveToFront();

                d3.selectAll(".marks." + ctr)
                .classed("highlight-line", true)
                .moveToFront();

                add_label_with_data(ctr_full_list[index], ctr_flags[index], d3.select(this).attr("cx"), d3.select(this).attr("cy"), d.co2, d3.select(this));

                //visit
                hoverId = setTimeout(hoverVisitFunc, smData.fadeDelay, ctr);
                ///--------- BEGIN add log hover part 1/2----------///

                currentHover = {"type": "hover",
                "target": "line",
                "code": name,
                "start": Date.now()}
                if(debugLog) {
                    console.log("hover starts" + currentHover.code);
                }
                smData.hover++;
                ///--------- END add log hover part 1/2----------///
            })
    .on("mouseout", function (d, i) {
                //var name = d3.select(this).attr("name");
                var name = data.ctr.toLowerCase();
                var ctr = data.ctr;

                d3.select(".list-el." + name).classed("highlight", false);
                //d3.select(this).classed("highlight-line",false);

                d3.select(".line-chart." + name)
                .classed("highlight-line", false);

                d3.select("#" + name).selectAll("path")
                .classed("highlight-line", false);

                d3.selectAll(".marks." + ctr)
                .classed("highlight-line", false);

                d3.selectAll(".active-highlight-map")
                .moveToFront();
                d3.selectAll(".active-highlight-line")
                .moveToFront();

                remove_label();

                //visit
                clearTimeout(hoverId);
                ///--------- BEGIN add log hover part 2/2----------///
                if(currentHover != null) {
                    currentHover.end = Date.now();
                    currentHover.duration = currentHover.end - currentHover.start;
                    smData.log.push(currentHover)
                    currentHover = null;
                    if(debugLog) {
                        console.log("hover ends: "+ smData.log[smData.log.length - 1].code + " with "+smData.log[smData.log.length - 1].duration);  
                    }
                }
                
                ///--------- END add log hover part 2/2----------///

            })
    .on("mouseup", function () {
                //var name = d3.select(this).attr("name");
                var name = data.ctr.toLowerCase();
                var ctr = data.ctr;

                if (d3.select(this).classed("active-highlight") == false) {
                    //d3.select(this).classed("active-highlight-line",true)
                    d3.select(".line-chart." + name)
                    .classed("active-highlight-line", true);

                    d3.select(".list-el." + name).classed("active-highlight", true);
                    d3.select("#" + name).selectAll("path")
                    .classed("active-highlight-map", true)

                    d3.selectAll(".marks." + ctr)
                    .classed("active-highlight-line", true);
                } else {
                    //d3.select(this).classed("active-highlight-line",false)
                    d3.select(".line-chart." + name)
                    .classed("active-highlight-line", false);

                    d3.select(".list-el." + name).classed("active-highlight", false);
                    d3.select("#" + name).selectAll("path")
                    .classed("active-highlight-map", false)

                    d3.selectAll(".marks." + ctr)
                    .classed("active-highlight-line", false);
                }
                remove_label();

                ///--------- BEGIN add log click ----------///
                smData.log.push({"type": "click",
                    "target": "line",
                    "code": name,
                    "start": Date.now(),
                    "postState": !d3.select(this).classed("active-highlight")});
                if(debugLog) console.log(smData.log[smData.log.length - 1]);
                smData.click++;
                ///--------- END add log click ----------///
            });


});


// ADD LEGEND
var color = d3.scale.linear()
.domain([0, 100])
.range(["#3e3528", "#e6ded3"]);


var legend = svg.append("circle")
.attr("class", "smokeletLegend")
        //.attr("r",origin_size_of_particle)
        .attr("r", 12)
        .attr("cx", 22)
        .attr("cy", svg_h - 45)
        .style("fill", "#3e3528")
        //.attr("transform","translate(20,-60)")
        .attr("filter", "url(#blur)")
        .style("opacity", 0.5)
/*.style("fill",function(){ 
 return color(getRandomArbitary(0,100)) 
});*/


/*legend.transition()
 .duration(function(){ return (life_of_particle/2) })
 .delay()
 .ease("cubic-in-out")
 .attr("r",function(){ return final_size_of_particle+getRandomArbitary(random_size*-1,random_size) })
 .style("fill",function(){ 
 return color(getRandomArbitary(0,100)) 
 });
 //.style("opacity",0.5);
 
 legend.transition()
 .duration(function(){ return (life_of_particle/2) })
 .delay(function(){ return (life_of_particle/2) })
 .ease("cubic-in-out")
 .attr("r", getRandomArbitary(origin_size_of_particle,final_size_of_particle))
 .style("fill",function(){ 
 return color(getRandomArbitary(0,100)) 
});    */
//.style("opacity",0)


svg.append("text")
.attr("x", 40)
.attr("y", svg_h - 41)
.text("300 Million tonnes of CO2")


}