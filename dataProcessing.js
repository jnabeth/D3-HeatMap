document.addEventListener('DOMContentLoaded',function(){
    req=new XMLHttpRequest();
    req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json',true);
    req.send();
    req.onload=function(){
      fullDataset=JSON.parse(req.responseText);

      let dataset = fullDataset.monthlyVariance

      var margin = {top: 20, right: 40, bottom: 100, left: 65},
      width = 1200 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      const minVar = d3.min(dataset, (d) => d.variance);
      const maxVar = d3.max(dataset, (d) => d.variance);

      // append the svg object to the body of the page
      const svg = d3.select("body")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Labels of row and columns -> unique identifier of the column called 'year' and 'month'
      var myGroups = d3.map(dataset, function(d){return d.year;}).keys()
      var myVars = d3.map(dataset, function(d){return d.month;}).keys()
      let month = ["January","February","March","April","May","June","July", "August","September","October","November","December"];
      let yearTicks = myGroups.filter(x => x%10==0)

      // Build X scales and axis:
      const xScale = d3.scaleBand()
        .range([0, width])
        .domain(myGroups)
        .padding(0.0);
      svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(xScale)
                .tickSize(0)
                .tickValues(yearTicks))
        .select(".domain").remove()

      // Build Y scales and axis:
      const yScale = d3.scaleBand()
        .range([0, height])
        .domain(myVars)
        .padding(0.0);
      svg.append("g")
        .attr("id", "y-axis")
        .call(d3.axisLeft(yScale)
                .tickFormat((d,i) => month[i])
                .tickSize(0))
        .select(".domain").remove()

      // Create tooltip
      var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .attr("id", "tooltip")
                    .style("opacity", 0);
      
      var legendElementWidth = 40;
      var legendElementHeight = 40;
      var colors = ["#173F5F", "#20639B", "#c7e9b4","#edf8b1", "#F6D55C","#f0b03a", "#ED553B", "#ed003f"];
      
      //Build color scale
      var myColor = d3.scaleQuantile()
        .range(colors)
        .domain([minVar, maxVar]);
   
      svg.selectAll()
        .data(dataset, (d,i) => d.year+':'+d.month)
        .enter()
        .append("rect")
        .attr("x", (d,i) => xScale(d.year))
        .attr("y", (d,i) => yScale(d.month))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .style("fill", (d,i) => myColor(d.variance))
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 0.8);

        // Draw legend
        var legend = svg.selectAll(".legend")
          .data(myColor.quantiles())
          .enter().append("g")
          .attr("class", "legend");

        // Draw legend colored rectangles
        legend.append("rect")
          .attr("x", function(d, i) { return legendElementWidth * i; })
          .attr("y", height+legendElementHeight)
          .attr("width", legendElementWidth)
          .attr("height", legendElementHeight)
          .style("fill", function(d, i) { return colors[i]; });

        legend.append("text")
          .attr("class", "mono")
          .text(function(d) { return "≥ " + Math.round(d); })
          .attr("x", function(d, i) { return (legendElementWidth * i)+legendElementWidth/5; })
          .attr("y", height+2.5*legendElementHeight);

        legend.exit().remove();
        
  };
});
