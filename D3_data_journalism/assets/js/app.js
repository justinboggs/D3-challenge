var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40, 
    bottom: 60,
    left: 40
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create svg wrapper, append an svg group to hold chart, shift the group by margins
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data
d3.csv("D3_data_journalism/assets/data/data.csv").then(function(incomeData) {
    
    // parse data
    incomeData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    //create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(incomeData, d => d.poverty)-1, d3.max(incomeData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(incomeData, d => d.healthcare)-1, d3.max(incomeData, d => d.healthcare)])
        .range([height, 0]);

    // create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axis to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // create circles    
    var circlesGroup = chartGroup.selectAll("circle")
        .data(incomeData)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "7")
        .attr("stroke", "black")
        .attr("opacity", ".80");

    // initialize tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.abbr}<br>In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`);
        });
    
    // create tooltip in the chart
    chartGroup.call(toolTip);

    // create event listeners
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
    })

        // on mouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    
    // create axis labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 5)
        .attr("x", 0 - (height))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / width}, ${height + margin.top + 20})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
}).catch(function(error) {
    console.log(error);
});
