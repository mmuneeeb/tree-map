document.addEventListener('DOMContentLoaded', function(){
  getDataSet();  
});


function getDataSet(){
  let url = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json";
  d3.json(url).get(function(error, d) {
    let data = d;
    drawTreemap(data)
  });
  
}
function drawTreemap(data){
  
  let svgWidth = 900;
  let svgHeight = 700;
  
  let colorSet = d3.scaleOrdinal().range(d3.schemeCategory20c);
  
  //Set the margins and size of the svg
  const margin = {top: 40, right: 10, bottom: 10, left: 10},
      width = 1200 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom,
      color = d3.scaleOrdinal().range(d3.schemeCategory20c);

  //Create a treemap layout
  const treemap = d3.treemap().size([width, height]);
  
  //Append the svg to the div
  const canvas = d3.select("#chart-container").append("svg")
    .style("position", "relative")
    .attr("width", (width + margin.left + margin.right))
    .attr("height", (height + margin.top + margin.bottom))
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");
  
  //Create the tooltip for the treemap
  let tooltip = d3.select("body")
                  .append("div")	
                  .attr("id", "tooltip")				
                  .style("opacity", 0); 
  
  //Create the tree hierarchy for the map
  const root = d3.hierarchy(data, (d) => d.children).sum((d) => d.value);
  
  const tree = treemap(root);
  
  //Create the nodes for the map
  const node = canvas.datum(root).selectAll("g")
                .data(tree.leaves())
                .enter().append("g")
                .attr("class", "node")
                .attr("data-name", d => d.data.name)
                .attr("data-category", d => d.data.category)
                .attr("data-value", d => d.data.value)
                .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")" )
                .on("mousemove", d =>{
          
                    let tooltipInfo =`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`; 
                    tooltip.transition()		
                        .duration(100)		
                        .style("opacity", .85);	
                    tooltip.attr("data-value", d.value);
                    tooltip.html(tooltipInfo)	
                        .style("left", (d3.event.pageX - 50) + "px") 
                        .style("top", (d3.event.pageY - 100) + "px"); 
                }) 
                .on("mouseout", function(d) {		

                      tooltip.transition()		
                          .duration(100)		
                          .style("opacity", 0);	
                   }); 
  
  //Draw each rect for the node
  node.append("rect")
      .attr("class", "tile")
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .attr("width", (d) => (d.x1 - d.x0)) 
      .attr("height", (d) => (d.y1 - d.y0))
      .attr("fill", (d) => colorSet(d.parent.data.name))
      .attr('stroke', "black")
      .attr('stroke-width', '1')
      
                
  
  //Draw the text for each node
  node.append("text")
      .attr("class", "node-text")
      .selectAll("tspan")
      .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter().append("tspan")
      .attr("x", 4)
      .attr("y", function(d, i) { return 13 + i * 10; })
      .text(function(d) { return d; });
  
  
  let categories = root.leaves().map(nodes => nodes.data.category);
  
  categories = categories.filter(function(category, index, self){
    return self.indexOf(category)===index;    
  })
  
  const legendWidth = 600;
  const legendRows = 4;
  const legendColumnWidth = legendWidth/legendRows;
  const legendRowHeight = 10;
  const legendRectSize = 15;
  let legend = d3.select("#legend-container")
                  .append("svg")
                  .attr("id", "legend")
                  .attr("width", legendWidth);
  
  let legendItem = legend.append("g")
                    .attr("transform", "translate(60, 0)")
                    .selectAll("g")
                    .data(categories)
                    .enter().append("g")
                    .attr("transform", (d,i) => `translate(${(i%legendRows)*legendColumnWidth}, 
        ${Math.floor(i/legendRows)*legendRectSize + (legendRowHeight*(Math.floor(i/legendRows)))})`
                    );
  
  
  
  legendItem.append("rect")
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .attr("class", "legend-item")
            .attr("fill", d => colorSet(d));
  
  legendItem.append("text")                              
     .attr('x', legendRectSize + 3)                          
     .attr('y', legendRectSize -5)                       
     .text(function(d) { return d; });  
  
  
  
  
}