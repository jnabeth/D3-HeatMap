document.addEventListener('DOMContentLoaded',function(){
    req=new XMLHttpRequest();
    req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json',true);
    req.send();
    req.onload=function(){
      dataset=JSON.parse(req.responseText);

      var margin = {top: 20, right: 40, bottom: 20, left: 40},
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      const minX = d3.min(dataset, (d) => d.year)-1;
      const maxX = d3.max(dataset, (d) => d.year)+1;
      const minY = d3.min(dataset, (d) => d.month);
      const maxY = d3.max(dataset, (d) => d.month);

      const xScale = d3.scaleLinear()
                       .domain([minX, maxX])
                       .range([0, width]);

      const yScale = d3.scaleLinear()
                       .domain([minY, maxY])
                       .range([0, height]);
      
      const xAxis = d3.axisBottom(xScale)
                      .tickFormat(d3.format(""));
      
      const yAxis = d3.axisLeft(yScale)

      const svg = d3.select("body")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .attr("id", "tooltip")
                    .style("opacity", 0);
                    
      var color = d3.scaleOrdinal(d3.schemeCategory10);

      svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("data-xvalue", (d, i) => d.Year)
      .attr("data-yvalue", function(d){
        var t = new Date(1986,3,17,12,d.Time.substring(0,2),d.Time.substring(3,5));
        return t;
      })
      .attr("cx", (d, i) => xScale(d.Year))
      .attr("cy", (d, i) => yScale(d.Seconds))
      .attr("r", 5)
      .style("fill", function(d){
          if (d.Doping === "") {
              return color("No Doping Allegations")
          } else {
              return color("Doping Allegations")
          }
        })
      .on("mouseover", function(d) {
        tooltip.transition()
             .duration(200)
             .style("opacity", .9);
        tooltip.html(d.Name + ": " + d.Nationality + "<br/>Year: " + d.Year + ", Time: " + d.Time + "<br/>" +  d.Doping)
             .style("left", d3.event.pageX+ "px")
             .style("top", d3.event.pageY + "px")
             .attr("data-year", d.Year)
         })
     .on("mouseout", function(d) {
        tooltip.transition()
             .duration(500)
             .style("opacity", 0);
     });

      // Display x-axis
     svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis)

      // Display y-axis
      svg.append("g")
       .attr("id", "y-axis")
       .call(yAxis);
       
      // draw legend
      var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legendClass")
        .attr("id","legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      // draw legend colored rectangles
      legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

      // draw legend text
      legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;})
  };
});
