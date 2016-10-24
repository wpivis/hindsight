var anim = 0;
var intervals = new Array();

var top_year = "2007";
var curr_year = 0,
prev_year = 0;
var disp_none = false;

var range_co2 = new Array();

var svg_h = 513,
svg_w = 652;

var all_years = new Array();


/*var data = [
 {"w":10,"h":20,"x":0,"y":200,"num":30},
 {"w":100,"h":200,"x":300,"y":400,"num":1},
 {"w":100,"h":20,"x":300,"y":0,"num":5},
 {"w":100,"h":200,"x":600,"y":600,"num":100},
 ];*/

 var ctr_list = ["Australia", "Austria", "Belgium", "Canada", "CzechRepublic", "Denmark", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Japan", "SouthKorea", "Luxembourg", "Mexico", "Netherlands", "NewZealand", "Norway", "Poland", "Portugal", "Slovakia", "Spain", "Sweden", "Switzerland", "Turkey", "UnitedKingdom", "UnitedStatesofAmerica", "Brazil", "Chile", "China", "Estonia", "India", "Indonesia", "Israel", "Russia", "Slovenia", "SouthAfrica"];

 var ctr_full_list = ["Australia", "Austria", "Belgium", "Canada", "Czech Republic", "Denmark", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Japan", "South Korea", "Luxembourg", "Mexico", "Netherlands", "New Zealand", "Norway", "Poland", "Portugal", "Slovakia", "Spain", "Sweden", "Switzerland", "Turkey", "United Kingdom", "United States of America", "Brazil", "Chile", "China", "Estonia", "India", "Indonesia", "Israel", "Russia", "Slovenia", "South Africa"];

 var ctr_flags = ["AUS", "AUT", "BEL", "CAN", "CZE", "DNK", "FIN", "FRA", "DEU", "GRC", "HUN", "ISL", "IRL", "ITA", "JPN", "KOR", "LUX", "MEX", "NLD", "NZL", "NOR", "POL", "PRT", "SVK", "ESP", "SWE", "CHE", "TUR", "GBR", "USA", "BRA", "CHL", "CHN", "EST", "IND", "IDN", "ISR", "RUS", "SVN", "SAF"]


 var ctr_list_copy = new Array();
 ctr_list_copy = ctr_list.slice(0);

 for (j = 0; j < ctr_list.length; j++) {
    range_co2.push(dataco2[ctr_list[j]][top_year].co2);
    //alert(d3.keys(dataco2[ctr_list[j]]))
}

all_years = d3.keys(dataco2[ctr_list[0]]);


var all_years_int = new Array();

all_years.forEach(function (d) {
    all_years_int.push(parseInt(d))
});

//console.log(all_years_int)

var x_line = d3.scale.linear()
.domain([0, all_years_int.length - 1])
.range([40, 815]);

var y_line = d3.scale.linear()
.domain([d3.max(range_co2), d3.min(range_co2)])
.range([30, svg_h / 2 - 30]);

var line = d3.svg.line()
.x(function (d, i) {
    return x_line(i);
})
.y(function (d) {
    return y_line(d);
});



var x_tick_range = d3.scale.linear().range([0, 775]);
x_tick_range.domain(d3.extent(all_years_int));



range = d3.scale.linear()
.domain([0, d3.max(range_co2)])
.range([0, 20]);

var life_of_particle = 4000,
num_of_particles = 10,
origin_size_of_particle = 2,
final_size_of_particle = 10,
random_size = 5;

var bounding_box_w = 100,
bounding_box_h = 150;


d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};



function getRandomArbitary(min, max) {
    return Math.random() * (max - min) + min;
}

function clone_d3_selection(selection, i) {
            // Assume the selection contains only one object, or just work
            // on the first object. 'i' is an index to add to the id of the
            // newly cloned DOM element.
    var attr = selection.node().attributes;
    var length = attr.length;
    var node_name = selection.property("nodeName");
    var parent = d3.select(selection.node().parentNode);
    var cloned = parent.append(node_name)
                 .attr("id", selection.attr("id") + i);
    for (var j = 0; j < length; j++) { // Iterate on attributes and skip on "id"
        if (attr[j].nodeName == "id") continue;
        cloned.attr(attr[j].name,attr[j].value);
    }
    console.log(cloned)
    return cloned;

}

function draw_polution(year) {

    breath();

    curr_year = year;

    d3.select(".repere")
    .transition()
    .duration(1000)
    .ease("cubic-in-out")
    .attr("transform", function () {
                /*var curr_pos = all_years.indexOf(curr_year);
                var curr_w = parseFloat(d3.select(this).attr("width"));*/
                
                return "translate(" + (x_tick_range(curr_year) + 40) + ",25)";
            })
    .each("end",function(){
        d3.select(".m"+year).classed(visitMark,true)
    })

    


    d3.select("#year")
    .text(year);

    d3.selectAll(".y_button").classed("selected", false);
    d3.select(".b" + year).classed("selected", true);

    d3.select("#underline")
    .attr("x2", function () {
        var orX = parseInt(d3.select(this).attr("x1"));
        var width = parseInt(d3.select("#year").style("width"));
        return orX + width;
    })

    /*d3.selectAll(".smokelet")
     .transition()
     .duration(life_of_particle/10)
     .delay(function(d,i){
     return i*life_of_particle/10
     })
     .attr("r",0)
     .style("opacity",0)
     .each("end",function(){
     d3.select(this).remove();
 })*/

 for (i = 0; i < ctr_list.length; i++) {

    var id = ctr_list[i].toLowerCase();

        //console.log(id)

        var country = d3.select("#" + id);
        //country.selectAll("path").style("fill","red");

        if (country.node() == null)
            alert(id)

        var bbox = country.node().getBBox();
        var w = bbox.width;
        var h = bbox.height;
        var x = bbox.x;
        var y = bbox.y;
        smoke(ctr_list[i], year, w, h, x, y);
    }
}


function particles(country, year, w, h, x, y) {

    prev_year = year;

    var svg = d3.select("svg");

    for (n = 0; n < Math.round(range(dataco2[country][year].co2)); n++) {

        var color = d3.scale.linear()
        .domain([0, dataco2[country][year].co2 - 1])
        .range(["#3e3528", "#e6ded3"]);
        //.range(["#000", "#e6ded3"]);

        var orDelay = getRandomArbitary(0, life_of_particle);
        //var orDelay = n*life_of_particle/4;
        /*var orDelay = d3.scale.linear()
         .domain([0, data[country][year].co2 - 1])
         .range([0,life_of_particle/2])*/

         var particle = svg.append("circle")
         .attr("class", "smokelet year" + year)
         .attr("r", origin_size_of_particle)
         .attr("cx", getRandomArbitary(0, w - w / 2) + x + w / 4)
         .attr("cy", getRandomArbitary(0, h - h / 2) + y + h / 4)
         .attr("transform", "translate(20,-60)")
         .attr("filter", "url(#blur)")
         .style("opacity", 0)
         .style("fill", function () {
            return color(getRandomArbitary(0, dataco2[country][year].co2))
        });


         particle.transition()
         .duration(function () {
            return (life_of_particle / 2)
        })
         .delay(orDelay)
         .ease("cubic-in-out")
         .attr("r", function () {
            return final_size_of_particle + getRandomArbitary(random_size * -1, random_size)
        })
                //.attr("cx",function(){ return getRandomArbitary(0,w)+x })
                //.attr("cy",function(){ return getRandomArbitary(0,h)+y })
                .style("opacity", 0.5);

                particle.transition()
                .duration(function () {
                    return (life_of_particle / 2)
                })
                .delay(function () {
                    return (life_of_particle / 2) + orDelay
                })
                .ease("cubic-in-out")
                .attr("r", 0)
                //.attr("cx",function(){ return getRandomArbitary(0,w)+x })
                //.attr("cy",function(){ return getRandomArbitary(0,h)+y })
                .style("opacity", 0)
                .each("end", function () {
                    d3.select(this).remove();
                })

            }

        }



        function smoke(country, year, w, h, x, y) {
            intervals[country + year] = setInterval(function () {
                particles(country, year, w, h, x, y);
        //},life_of_particle+range(data[country][year].co2)*5);
    }, life_of_particle / 2);
        }

        function breath() {
            d3.selectAll(".y_button").classed("selected", false);
            for (key in intervals) {
                clearTimeout(intervals[key]);
            }
        }

        function searchStringInArray(str, strArray) {
            for (var j = 0; j < strArray.length; j++) {
                if (strArray[j].match(str))
                    return j;
            }
            return -1;
        }

        function remove_from_list(val) {
    //alert(val)
    var index = searchStringInArray(val, ctr_list);
    var c_name = val.toLowerCase();
    if (index !== -1) {
        ctr_list.splice(index, 1);
        d3.select(".line-chart." + c_name).classed("invisible", true);
        d3.selectAll(".marks." + val).classed("invisible", true);
    } else {
        ctr_list.push(val)
        d3.select(".line-chart." + c_name).classed("invisible", false);
        d3.selectAll(".marks." + val).classed("invisible", false);
    }


    draw_polution(curr_year);

}

function remove_all() {

    checkboxes = document.getElementsByName("country_sel");

    if (disp_none == false) {
        ctr_list.length = 0;
        /*d3.selectAll(".checkbox")
        .attr("checked",null);*/
        for (var n = 0; n < checkboxes.length; n++) {
            checkboxes[n].checked = false;
        }

        d3.selectAll(".line-chart").classed("invisible", true);
        disp_none = true;

        d3.selectAll(".marks").classed("invisible", true);

        d3.select(".r-all")
        .html("Show All");
    } else {
        /*ctr_list.length = 0;
         d3.selectAll(".checkbox")
         .attr("checked",null);
         ctr_list = ctr_list_copy.slice(0);
         d3.selectAll(".checkbox")
         .attr("checked",true);*/
         ctr_list = ctr_list_copy.slice(0);

         for (var n = 0; n < checkboxes.length; n++) {
            checkboxes[n].checked = true;
        }

        d3.selectAll(".line-chart").classed("invisible", false);
        disp_none = false;

        d3.selectAll(".marks").classed("invisible", false);

        d3.select(".r-all")
        .html("Remove All");
    }

    ///--------- BEGIN add log click ----------///
    smData.log.push({"type": "click",
        "target": "checkbox",
        "code": "all",
        "start": Date.now(),
        "postState": !disp_none});
    if(debugLog) console.log(smData.log[smData.log.length - 1]);
    smData.click++;
    ///--------- END add log click ----------///



    draw_polution(curr_year);
}