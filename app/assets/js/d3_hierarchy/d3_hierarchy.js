var DataSet = function() {
  this.data = {
    "name": "Items",
    "items": {
      "item": [{
          "id": "0001",
          "type": "donut",
          "name": "Cake",
          "ppu": 0.55,
          "children": [{
            "name": "batters",
            "children": [{
              "id": "1001",
              "type": "Regular"
            }, {
              "id": "1002",
              "type": "Chocolate"
            }, {
              "id": "1003",
              "type": "Blueberry"
            }, {
              "id": "1004",
              "type": "Devil's Food"
            }]
          }, {
            "name": "topping",
            "children": [{
              "id": "5001",
              "type": "None"
            }, {
              "id": "5002",
              "type": "Glazed"
            }, {
              "id": "5005",
              "type": "Sugar"
            }, {
              "id": "5007",
              "type": "Powdered Sugar"
            }, {
              "id": "5006",
              "type": "Chocolate with Sprinkles"
            }, {
              "id": "5003",
              "type": "Chocolate"
            }, {
              "id": "5004",
              "type": "Maple"
            }]
          }]
        }, {
          "id": "0002",
          "type": "donut",
          "name": "Raised",
          "ppu": 0.55,
          "children": [{
            "name": "batters",
            "children": [{
              "id": "1001",
              "type": "Regular"
            }]
          }, {
            "name": "topping",
            "children": [{
              "id": "5001",
              "type": "None"
            }, {
              "id": "5002",
              "type": "Glazed"
            }, {
              "id": "5005",
              "type": "Sugar"
            }, {
              "id": "5003",
              "type": "Chocolate"
            }, {
              "id": "5004",
              "type": "Maple"
            }]
          }]
        }, {
          "id": "0003",
          "type": "donut",
          "name": "Old Fashioned",
          "ppu": 0.55,
          "children": [{
            "name": "batters",
            "children": [{
              "id": "1001",
              "type": "Regular"
            }, {
              "id": "1002",
              "type": "Chocolate"
            }]
          }, {
            "name": "topping",
            "children": [{
              "id": "5001",
              "type": "None"
            }, {
              "id": "5002",
              "type": "Glazed"
            }, {
              "id": "5003",
              "type": "Chocolate"
            }, {
              "id": "5004",
              "type": "Maple"
            }]
          }]
        }, {
          "id": "0004",
          "type": "bar",
          "name": "Bar",
          "ppu": 0.75,
          "children": [{
            "name": "batters",
            "children": [{
              "id": "1001",
              "type": "Regular"
            }]
          }, {
            "name": "topping",
            "children": [{
              "id": "5003",
              "type": "Chocolate"
            }, {
              "id": "5004",
              "type": "Maple"
            }]
          }, {
            "name": "fillings",
            "children": [{
              "id": "7001",
              "name": "None",
              "addcost": 0
            }, {
              "id": "7002",
              "name": "Custard",
              "addcost": 0.25
            }, {
              "id": "7003",
              "name": "Whipped Cream",
              "addcost": 0.25
            }]
          }]
        },

        {
          "id": "0005",
          "type": "twist",
          "name": "Twist",
          "ppu": 0.65,
          "children": [{
            "name": "batters",
            "children": [{
              "id": "1001",
              "type": "Regular"
            }, ]
          }, {
            "name": "topping",
            "children": [{
              "id": "5002",
              "type": "Glazed"
            }, {
              "id": "5005",
              "type": "Sugar"
            }, ]
          }]
        },

        {
          "id": "0006",
          "type": "filled",
          "name": "Filled",
          "ppu": 0.75,
          "children": [{
            "name": "batters",
            "children": [{
              "id": "1001",
              "type": "Regular"
            }, ]
          }, {
            "name": "topping",
            "children": [{
              "id": "5002",
              "type": "Glazed"
            }, {
              "id": "5007",
              "type": "Powdered Sugar"
            }, {
              "id": "5003",
              "type": "Chocolate"
            }, {
              "id": "5004",
              "type": "Maple"
            }]
          }, {
            "name": "fillings",
            "children": [{
              "id": "7002",
              "name": "Custard",
              "addcost": 0
            }, {
              "id": "7003",
              "name": "Whipped Cream",
              "addcost": 0
            }, {
              "id": "7004",
              "name": "Strawberry Jelly",
              "addcost": 0
            }, {
              "id": "7005",
              "name": "Rasberry Jelly",
              "addcost": 0
            }]
          }]
        }
      ]
    }
  }
};


var flare_min = (new DataSet()).data;
flare_min.children = flare_min.items.item.splice(-6);

var height = 630,
  width = 1200;

var svg = d3
  .select("#hierarchy")
  .append("svg")
  .attr("height", height)
  .attr("width", width)
  .append("g")
  .attr("transform", "translate(50,0)");

var tree = d3
  .layout
  .tree()
  .size([height, width - 250]);

var diagonal = d3
  .svg
  .diagonal()
  .projection(function(d) {
    return [d.y, d.x];
  });

var search_term = "fillings";

function findInPath(source, text) {
	if (source.name === text || source.type === text) {
  	return true;
  } else {
  	return false;
  }
}


var linkFilter = function(d) {
  return findInPath(d.source, search_term)
}


flare_min.x0 = height / 2;
flare_min.y0 = 0;

var i = 0;
var duration = 1000;

update(flare_min);

function update(source) {

  var nodes = tree.nodes(flare_min);
  var links = tree.links(nodes);

  var node = svg.selectAll("g.node")
    .data(nodes, function(d) {
      return d.id2 || (d.id2 = ++i);
    });

  var nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on("click", click);

  nodeEnter.append("path")
    .attr("d", d3.svg.symbol().size(1).type("diamond"))
    .style("stroke", "steelblue")
    .style("stroke-width", "1.5px");

  nodeEnter.append("text")
    .attr("x", function(d) {
      return d.children || d._children ? -13 : 13;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) {
      return d.children || d._children ? "end" : "start";
    })
    .text(function(d) {
      return d.name ? d.name : d.type;
    })
    .style("fill-opacity", 1e-6)
    .style("font", "15px Helvetica")
    .style("fill", "black")
    .style("stroke-width", ".01px");



  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    })


  nodeUpdate.select("path")
    .filter(function(d) {
      return findInPath(d, search_term)
    })
    .style("fill", function(d) {
      return d._children ? "red" : "#faa";
    });

  nodeUpdate.select("path")
    .filter(function(d) {
      return !findInPath(d, search_term)
    })
    .style("fill", function(d) {
      return d._children ? "lightsteelblue" : "#fff";
    });

  var sizeScale = d3.scale.linear()
    .domain([0, 3])
    .range([200, 70]);

  nodeUpdate.select("path")
    .attr("d", d3.svg.symbol().size(function(d) {
      return sizeScale(d.depth);
    }).type(function(d) {
      if (d.depth >= 2) {
        return "diamond";
      } else if (d.depth <= 1) {
        return "cross";
      }
    }))
    .style("stroke", "steelblue")
    .style("stroke-width", "1.5px");

  nodeUpdate.select("text")
    .style("fill-opacity", 1)
    .style("font", "15px Helvetica")
    .style("fill", "black")
    .style("stroke-width", ".01px");


  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  nodeExit.select("path")
    .attr("d", d3.svg.symbol().size(1).type("diamond"));

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);


  var link = svg.selectAll("path.link")
    .data(links, function(d) {
      return d.target.id2;
    });

  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {
        x: source.x0,
        y: source.y0
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .style("fill", "none")
    .style("stroke-width", "2px");

  link.transition()
    .duration(duration)
    .attr("d", diagonal);

  link.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = {
        x: source.x,
        y: source.y
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .remove();

  var colorScale = d3.scale.linear()
    .domain([0, 3])
    .range(["#b3d1ff", "#0066ff"]);

  link.filter(linkFilter).style("stroke", "red");
  link.filter(function(d) {
    return !linkFilter(d);
  }).style("stroke", function(d) {
    return colorScale(d.source.depth);
  });

  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

