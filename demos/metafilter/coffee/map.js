var SmallMultiples, conditionThreshold, currentVisit, hoverId, plotData, setupIsoytpe, transformData;

//for map
//configure
var condition = "nofade" //all, fade, nofade
var metric = "visits" //mentions, visits
var SORT = 'count' //default: count; then name


var DIV = 20;


var FADECOLOR = "#f1a340" //"#91bfdb"
var NOFADECOLOR = "#998ec3"//"#f6743d"
var MIDDLECOLOR = "#f7f7f7" //#ffffbf
var mapCcolor = condition == "fade" ? FADECOLOR : NOFADECOLOR
var opacityScaleFade = d3.scale.linear().domain([0,9]).range([0,1])
var opacityScaleNofade = d3.scale.linear().domain([0,6]).range([0,1])

var colorScaleFade = d3.scale.linear().domain([0,9]).range([MIDDLECOLOR,FADECOLOR])
var colorScaleNofade = d3.scale.linear().domain([-6,0]).range([NOFADECOLOR, MIDDLECOLOR])
//[-6, 9]
var DIFFMIN_MENTIONS = -6
var DIFFMAX_MENTIONS = 9
var DIFFMIN_VISITS = -4
var DIFFMAX_VISITS = 22
var colorScale = d3.scale.linear().domain([DIFFMIN_MENTIONS, 0, DIFFMAX_MENTIONS]).range([NOFADECOLOR, MIDDLECOLOR, FADECOLOR])
var colorScaleLog = d3.scale.linear().domain([-Math.log(6),0, Math.log(9)]).range([NOFADECOLOR, MIDDLECOLOR, FADECOLOR])
var colorScale_Visits = d3.scale.linear().domain([DIFFMIN_VISITS, 0, DIFFMAX_VISITS]).range([NOFADECOLOR, MIDDLECOLOR, FADECOLOR])


//discrete
var DIFFCOLOR_RANGE_NEG = ["#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"];
var DIFFCOLOR_RANGE_POS = ["#f7f7f7", "#fee0b6", "#fdb863", "#e08214", "#b35806", "#7f3b08"]; 
var MENTION_COLOR_DOMAIN = [0.005, 0.01, 0.05, 0.1, 0.25, 1.1]
var VISIT_COLOR_DOMAIN = [0.01, 0.05, 0.1, 0.25, 0.5, 1.1]
var colorScaleDiscretePos = d3.scale.threshold().domain(metric == "mentions" ? MENTION_COLOR_DOMAIN : VISIT_COLOR_DOMAIN).range(DIFFCOLOR_RANGE_POS)
var colorScaleDiscreteNeg = d3.scale.threshold().domain(metric == "mentions" ? MENTION_COLOR_DOMAIN : VISIT_COLOR_DOMAIN).range(DIFFCOLOR_RANGE_NEG)
var totalFade = 0;
var totalNofade = 0;
var total = 0;


this.isTempHighlight = false;
conditionThreshold = 0.5;
this.smData = {
  mouseOver: 0,
  mouseMove: 0,
  sortEvent: 0,
  fadeDelay: 500,
  condition: "",
  visited_sequence: "",
  visitedArray: []
};
hoverId = '';
currentVisit = null;

if (Math.random() > conditionThreshold) {
  smData.condition = "fade";
} else {
  smData.condition = "nofade";
}

console.log(smData);

SmallMultiples = function() {
  var area, bisect, caption, chart, circle, curYear, data, fade, format, height, line, margin, mousemove, mouseout, mouseover, setupScales, width, xScale, xValue, yAxis, yScale, yValue;
  width = 150;
  height = 120;
  margin = {
    top: 15,
    right: 10,
    bottom: 40,
    left: 35
  };
  data = [];
  circle = null;
  caption = null;
  curYear = null;
  bisect = d3.bisector(function(d) {
    return d.date;
  }).left;
  format = d3.time.format("%Y");
  xScale = d3.time.scale().range([0, width]);
  yScale = d3.scale.linear().range([height, 0]);
  xValue = function(d) {
    return d.date;
  };
  yValue = function(d) {
    return d.n;
  };
  yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(4).outerTickSize(0).tickSubdivide(1).tickSize(-width);
  area = d3.svg.area().x(function(d) {
    return xScale(xValue(d));
  }).y0(height).y1(function(d) {
    return yScale(yValue(d));
  });
  line = d3.svg.line().x(function(d) {
    return xScale(xValue(d));
  }).y(function(d) {
    return yScale(yValue(d));
  });
  setupScales = function(data) {
    var extentX, maxY;
    maxY = d3.max(data, function(c) {
      return d3.max(c.values, function(d) {
        return yValue(d);
      });
    });
    maxY = maxY + (maxY * 1 / 4);
    yScale.domain([0, maxY]);
    extentX = d3.extent(data[0].values, function(d) {
      return xValue(d);
    });
    return xScale.domain(extentX);
  };
  chart = function(selection) {
    return selection.each(function(rawData) {
      var div, g, lines, svg;
      //console.log(rawData)
      data = rawData;
      setupScales(data);
      div = d3.select(this).selectAll(".chart").data(data);
      div.enter().append("div").attr("class", "chart").append("svg").append("g");
      svg = div.select("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);

      g = svg.select("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      lines = g.append("g");
      lines.append("path").attr("class", "area").style("pointer-events", "none").attr("d", function(c) {
        return area(c.values);
      });
      lines.append("path").attr("class", "line").style("pointer-events", "none").attr("d", function(c) {
        return line(c.values);
      });
      lines.append("text").attr("class", "title").attr("text-anchor", "middle").attr("y", height).attr("dy", margin.bottom / 2 + 5).attr("x", width / 2).text(function(c) {
        return c.key;
      });
      lines.append("text").attr("class", "static_year").attr("text-anchor", "start").style("pointer-events", "none").attr("dy", 13).attr("y", height).attr("x", 0).text(function(c) {
        return xValue(c.values[0]).getFullYear();
      });
      lines.append("text").attr("class", "static_year").attr("text-anchor", "end").style("pointer-events", "none").attr("dy", 13).attr("y", height).attr("x", width).text(function(c) {
        return xValue(c.values[c.values.length - 1]).getFullYear();
      });
      circle = lines.append("circle").attr("r", 2.2).attr("opacity", 0).style("pointer-events", "none");
      caption = lines.append("text").attr("class", "caption").attr("text-anchor", "middle").style("pointer-events", "none").attr("dy", -8);
      curYear = lines.append("text").attr("class", "year").attr("text-anchor", "middle").style("pointer-events", "none").attr("dy", 13).attr("y", height);
      
      g.append("rect").attr("class", "background").style("pointer-events", "all").attr("width", width + margin.right).attr("height", height).style("fill", "none")
      
      //for maps
      var maps = svg.append('rect').attr("width", width).attr("height",height).attr("transform", "translate(" + margin.left + "," + margin.top + ")")

          maps
            .style("fill", function(d) {
                
                if(metric == "mentions"){
                if(condition == "all"){
                  var diff = d['fadeMentionsChance'] - d['nofadeMentionsChance']
                  //console.log(diff)
                  if(diff >= 0)
                      return colorScaleDiscretePos(diff)
                  else
                      return colorScaleDiscreteNeg(-diff)
                }
                else if(condition == "fade") {
                  //console.log(d['fadeMentionsChance'])
                  return colorScaleDiscretePos(d['fadeMentionsChance'])
                }
                else if(condition == "nofade") {
                  //console.log(d['nofadeMentionsChance'])
                  return colorScaleDiscreteNeg(d['nofadeMentionsChance'])
                }
                }
                else if (metric == "visits") {
                  if(condition == "all"){
                  var diff = d['fadeVisitsChance'] - d['nofadeVisitsChance']
                  //console.log(diff)
                  if(diff >= 0)
                      return colorScaleDiscretePos(diff)
                  else
                      return colorScaleDiscreteNeg(-diff)
                }
                else if(condition == "fade") {
                  //console.log(d['fadeVisitsChance'])
                  return colorScaleDiscretePos(d['fadeVisitsChance'])
                }
                else if(condition == "nofade") {
                  //console.log(d['nofadeVisitsChance'])
                  return colorScaleDiscreteNeg(d['nofadeVisitsChance'])
                }
                }
            })
            .style("opacity", 0.75)

      
      

      return g.append("g").attr("class", "y axis").call(yAxis);
       
    
    });
  };
  fade = function(who) {
    d3.select(who).style("fill-opacity", 0).classed('expVisited', true);
    smData.mouseOver++;
    smData.visited_sequence += d3.select(who).data()[0].key + "-";
    return currentVisit = {
      "code": d3.select(who).data()[0].key,
      "start": Date.now(),
      "mousemove": 0
    };
  };
  // mouseover = function() {
  //   var that;
  //   that = this;
  //   hoverId = setTimeout(function() {
  //     return fade(that);
  //   }, smData.fadeDelay);
  //   circle.attr("opacity", 1.0);
  //   d3.selectAll(".static_year").classed("hidden", true);
  //   return mousemove.call(this);
  // };
  // mousemove = function() {
  //   var date, index, year;
  //   smData.mouseMove++;
  //   year = xScale.invert(d3.mouse(this)[0]).getFullYear();
  //   date = format.parse('' + year);
  //   if (currentVisit) {
  //     currentVisit.mousemove++;
  //   }
  //   index = 0;
  //   circle.attr("cx", xScale(date)).attr("cy", function(c) {
  //     index = bisect(c.values, date, 0, c.values.length - 1);
  //     return yScale(yValue(c.values[index]));
  //   });
  //   caption.attr("x", xScale(date)).attr("y", function(c) {
  //     return yScale(yValue(c.values[index]));
  //   }).text(function(c) {
  //     return yValue(c.values[index]);
  //   });
  //   return curYear.attr("x", xScale(date)).text(year);
  // };
  // mouseout = function() {
  //   clearTimeout(hoverId);
  //   d3.selectAll(".static_year").classed("hidden", false);
  //   circle.attr("opacity", 0);
  //   caption.text("");
  //   curYear.text("");
  //   if (currentVisit) {
  //     currentVisit.end = Date.now();
  //     currentVisit.duration = currentVisit.end - currentVisit.start + smData.fadeDelay;
  //     smData.visitedArray.push(currentVisit);
  //     currentVisit = null;
  //   }
  //   if (isTempHighlight && smData.condition === "nofade") {
  //     return d3.select(this).style("fill-opacity", 0.6);
  //   }
  // };
  chart.x = function(_) {
    if (!arguments.length) {
      return xValue;
    }
    xValue = _;
    return chart;
  };
  chart.y = function(_) {
    if (!arguments.length) {
      return yValue;
    }
    yValue = _;
    return chart;
  };
  return chart;
};

transformData = function(rawData) {
  var format, nest;
  format = d3.time.format("%Y");
  rawData.forEach(function(d) {
    d.date = format.parse(d.year);
    return d.n = +d.n;
  });
  nest = d3.nest().key(function(d) {
    return d.category;
  }).sortValues(function(a, b) {
    return d3.ascending(a.date, b.date);
  }).entries(rawData);
  return nest;
};

plotData = function(selector, data, plot) {
  return d3.select(selector).datum(data).call(plot);
};

setupIsoytpe = function() {
  $("#vis").isotope({
    itemSelector: '.chart',
    layoutMode: 'fitRows',
    getSortData: {
      count: function(e) {
        var d, sum;
        d = d3.select(e).datum();
        sum = d3.sum(d.values, function(d) {
          return d.n;
        });
        return sum * -1;
      },
      name: function(e) {
        var d;
        d = d3.select(e).datum();
        return d.key;
      }
    }
  });
  return $("#vis").isotope({
    sortBy: SORT
  });
};

makeMap = function(data, findingsData) {
  
  var LABEL = "chart";

  //init attributes for data
  data.forEach(function(chart){
    //mentions
    chart['mentions'] = 0;
    chart['diff'] = 0;
    chart['fadeMentions'] = 0;
    chart['nofadeMentions'] = 0;

    //visits
    chart['visits'] = 0;
    chart['diffVisits'] = 0;
    chart['fadeVisits'] = 0;
    chart['nofadeVisits'] = 0;
  })

  total = findingsData.length

  //go through findingsData and add attributes to data, then return
  findingsData.forEach(function(row, rowIndex){

    //conditions
    if(row.condition == "fade") totalFade++;
    else totalNofade++;

    //mentions
    var mentionSet = [];
    for(var iLabel = 1; iLabel <= 5; iLabel++ ){

            if(row[LABEL+iLabel] && row[LABEL+iLabel].length){
                row[LABEL+iLabel] = JSON.parse(row[LABEL+iLabel])
                row[LABEL+iLabel].forEach(function(tag, tagIndex){
                    if(tag.text != "N/A" && tag.text != "Group Mention"){
                        mentionSet.push(tag.text)
                        
                        
                    }
                })

            }
    }
    mentionSet = _.uniq(mentionSet)
    mentionSet.forEach(function(mention){
      var chart = _.filter(data, function(e){
                          return e.key == mention;
                        })
      if(chart.length > 0)
      {
          chart[0]['mentions']++;
          chart[0]['diff'] += (row.condition == "fade") ? 1 : -1;
          chart[0]['fadeMentions'] += (row.condition == "fade") ? 1 : 0;
          chart[0]['nofadeMentions'] += (row.condition == "fade") ? 0 : 1;
                            
      }
    })



    //visits, visited_sequence_arr
    var seqs = row.visited_sequence_arr.split('-');
    seqs = _.uniq(seqs)

    seqs.forEach(function(entry, i){
          var chart = _.filter(data, function(e){
                          return e.key == entry && entry != "";
                        })
          if(chart.length > 0)
          {
            chart[0]['visits']++;
            chart[0]['diffVisits'] += (row.condition == "fade") ? 1 : -1;
            chart[0]['fadeVisits'] += (row.condition == "fade") ? 1 : 0;
            chart[0]['nofadeVisits'] += (row.condition == "fade") ? 0 : 1;
                          
          }
                
    });

  })

  //chart counts
  chartSummaries = [];
  for(var i = 0; i < 5; i++){
    chartSummaries[i] = {
    'mentionsFade':0,
    'mentionsNofade': 0,
    'visitsFade':0,
    'visitsNofade':0
    }
  }
  console.log(chartSummaries)
  var countMap = [1, 5, 10, 15, 20]

  //compute chancesc
  data.forEach(function(chart) {
      //values for each chart
      chart['fadeMentionsChance'] = chart['fadeMentions'] / totalFade 
      chart['nofadeMentionsChance'] = chart['nofadeMentions'] / totalNofade 
      chart['fadeVisitsChance'] = chart['fadeVisits'] / totalFade 
      chart['nofadeVisitsChance'] = chart['nofadeVisits'] / totalNofade
  
      //chart counts
      for(var i = 0; i < 5; i++){
        chartSummaries[i]['mentionsFade'] += chart['fadeMentions'] >= countMap[i] ? 1 : 0;
        chartSummaries[i]['mentionsNofade'] += chart['nofadeMentions'] >= countMap[i] ? 1 : 0;
        chartSummaries[i]['visitsFade'] += chart['fadeVisits'] >= countMap[i] ? 1 : 0;
        chartSummaries[i]['visitsNofade'] += chart['nofadeVisits'] >= countMap[i] ? 1 : 0;
      }
  })

  //get max
  var maxChanceFade = _.max(data, function(c){
    return c.fadeMentionsChance
  })
  var maxChanceNofade = _.max(data, function(c){
    return c.nofadeMentionsChance
  })
  console.log("max chance of mentions: "+Math.max(maxChanceFade.fadeMentionsChance, maxChanceNofade.nofadeMentionsChance))

  maxChanceFade = _.max(data, function(c){
    return c.fadeVisitsChance
  })
  maxChanceNofade = _.max(data, function(c){
    return c.nofadeVisitsChance
  })
  console.log("max chance of mentions: "+Math.max(maxChanceFade.fadeVisitsChance, maxChanceNofade.nofadeVisitsChance))


  //output summaries
  var outputChartSummaries = ['mentionsFade', 'mentionsNofade', 'visitsFade', 'visitsNofade']
  for(var item = 0; item < outputChartSummaries.length; item++){
    console.log(outputChartSummaries[item])
    for(var i = 0; i <5; i++){
      console.log(countMap[i] + ": "+chartSummaries[i][outputChartSummaries[item]])
    }
  }

  return data;
}


this.makeSmallMultiples = function() {
  var display, plot;
  plot = SmallMultiples();
  display = function(error, rawData, findingsData) {
    var data;
    if (error) {
      console.log(error);
    }
    data = transformData(rawData);
    data = makeMap(data, findingsData);
    console.log(data)
    plotData("#vis", data, plot);
    return setupIsoytpe();
  };

  queue()
    .defer(d3.tsv, "data/askmefi_category_year.tsv")
    .defer(d3.json, "data/results/findings-metafilter-merged.json")
    .await(display);
  return d3.select("#button-wrap").selectAll("div").on("click", function() {
    var id;
    id = d3.select(this).attr("id");
    d3.select("#button-wrap").selectAll("div").classed("active", false);
    d3.select("#" + id).classed("active", true);
    smData.sortEvent++;
    return $("#vis").isotope({
      sortBy: id
    });
  });
};

makeSmallMultiples();