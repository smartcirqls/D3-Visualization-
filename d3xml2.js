require([
    "splunkjs/mvc",
    "underscore",
    "splunkjs/mvc/searchmanager",
    "splunkjs/mvc/simplexml/ready!"
], function( 
    // Keep these variables in the same order as the libraries above:
    mvc,
    _, 
    SearchManager

) {

    
    // Downloads per artist
    var mySearch = new SearchManager({
        id: "mysearch",
        preview: true,
        cache: true,
        search: mvc.tokenSafe("index=_internal | stats count by source | head 10"),
    });



var myResults = mySearch.data("results") ;
 myResults.on("data", function() {

var rw=[];
var fd=[];

function convertToArrayOfObjects(data) {
    var keys = data.shift(),
        i = 0, k = 0,
        obj = null,
        output = [];

    for (i = 0; i < data.length; i++) {
        obj = {};

        for (k = 0; k < keys.length; k++) {
            obj[keys[k]] = data[i][k];
        }

        output.push(obj);
    }

    return output;
}


var object = {};
                     //console.log("Has data? ", myResults.hasData());
                     //console.log("Type: ", myChoice);
			fd=myResults.data().fields;
			rw=myResults.data().rows;
			//console.log(chartData);
                     	//console.log("Data (rows): ", myResults.data().fields);
                     	//console.log("Backbone collection: (rows) ", myResults.collection());
			//console.log(typeof(fd));
			//console.log(fd);
			//console.log(rw);
                        rw.unshift(fd);
                        //console.log(rw);
 	var objects = convertToArrayOfObjects(rw);

	for(var i = 0; i < objects.length; i++){
    		var obj = objects[i];
    	for(var prop in obj){
        	if(obj.hasOwnProperty(prop) && !isNaN(obj[prop])){
            		obj[prop] = +obj[prop];   
        	}
    	}
	}
 	var json = JSON.parse(JSON.stringify(objects));
	console.log(json);

	var w = 800;
var h = 450;
var margin = {
	top: 58,
	bottom: 100,
	left: 80,
	right: 40
};
var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

var x = d3.scale.ordinal()
		.domain(json.map(function(entry){
			return entry.source;
		}))
		.rangeBands([0, width]);
var y = d3.scale.linear()
		.domain([0, d3.max(json, function(d){
			return d.count;
		})])
		.range([height, 0]);
var ordinalColorScale = d3.scale.category20();
var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");
var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");
var yGridlines = d3.svg.axis()
				.scale(y)
				.tickSize(-width,0,0)
				.tickFormat("")
				.orient("left");
var svg = d3.select("#chart1").append("svg")
			.attr("id", "chart")
			.attr("width", w)
			.attr("height", h);
var chart = svg.append("g")
			.classed("display", true)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
function plot(params){
	this.append("g")
		.call(yGridlines)
		.classed("gridline", true)
		.attr("transform", "translate(0,0)")
	this.selectAll(".bar")
		.data(params.data)
		.enter()
			.append("rect")
			.classed("bar", true)
			.attr("x", function(d,i){
				return x(d.source);
			})
			.attr("y", function(d,i){
				return y(d.count);
			})
			.attr("height", function(d,i){
				return height - y(d.count);
			})
			.attr("width", function(d){
				return x.rangeBand();
			})
			.style("fill", function(d,i){
				return ordinalColorScale(i);
			});
	this.selectAll(".bar-label")
		.data(params.data)
		.enter()
			.append("text")
			.classed("bar-label", true)
			.attr("x", function(d,i){
				return x(d.source) + (x.rangeBand()/2)
			})
			.attr("dx", 0)
			.attr("y", function(d,i){
				return y(d.count);
			})
			.attr("dy", -6)
			.text(function(d){
				return d.count;
			})
	this.append("g")
		.classed("x axis", true)
		.attr("transform", "translate(" + 0 + "," + height + ")")
		.call(xAxis)
			.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", -8)
				.attr("dy", 8)
				.attr("transform", "translate(0,0) rotate(-45)");

	this.append("g")
		.classed("y axis", true)
		.attr("transform", "translate(0,0)")
		.call(yAxis);

	this.select(".y.axis")
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.style("text-anchor", "middle")
		.attr("transform", "translate(-50," + height/2 + ") rotate(-90)")
		.text("Units sold");

	this.select(".x.axis")
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.style("text-anchor", "middle")
		.attr("transform", "translate(" + width/2 + ",80)")
		.text("Donut type");
}
plot.call(chart, {data: json});

	JSONToCSVConvertor(json,true);    
 });


function JSONToCSVConvertor(JSONData,ShowLabel) {

var CSV = '';
var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
//console.log(JSONData);
//console.log(ShowLabel);
//console.log(arrData);

 if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }

for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '' + arrData[i][index] + ',';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

console.log(CSV);
}



});

