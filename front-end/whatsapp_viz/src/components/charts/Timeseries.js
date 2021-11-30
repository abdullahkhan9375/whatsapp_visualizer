import React, {useState, useRef, useEffect, useLayoutEffect} from 'react'
import * as d3 from 'd3';
// import ReactFauxDOM from 'react-faux-dom';


export default function Timeseries({focus}) {

    const svgRef = useRef();
    console.log(focus)
    const parseDate = d3.timeParse('%d/%m/%y')
    function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
            }
    const margin = {top: 10, right: 20, bottom: 50, left: 20}
    const width = 1200 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom
    
    
    // function tweenDash() {
    //     const l = focus.length,
    //         i = d3.interpolateString("0," + l, l + "," + l);
    //     return function(t) { return i(t) };
    //     }
    // function transition(path) {
    //     path.transition()
    //         .duration(2000)
    //         .attrTween("stroke-dasharray", tweenDash)
    //         .on("end", () => { d3.select('.line').call(transition); });
    //     }

    d3.selectAll(".line").remove() 
    d3.selectAll(".x-axis").remove()
    d3.selectAll(".y-axis").remove()

    const svg = d3.selectAll('.canvasTimeseries')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
    
    const graph = svg.append('g')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const x = d3.scaleTime().range([0, width])
    const xAxisGroup = graph.append('g')
                                .attr('transform', `translate(0, ${height})`)
                                .attr('class', 'x-axis')
                                // .selectAll('text')
                                // .attr('transform', 'rotate(-45)')
                                // .attr('text-anchor', 'end')

    const max = d3.max(focus, d => d.count)
    const y = d3.scaleLinear().range([height, 0])

    const yAxisGroup = graph.append('g')
                                .attr('class', 'y-axis')
                                // .call(d3.axisLeft(y))
                y
                .domain([0, max]);

                x
                .domain(d3.extent(focus, d => parseDate(d.date)))
                

    const line = d3.line()
    .curve(d3.curveBasisOpen)
                    // .interpolate('monotone')
                    .x(function(d) {return x(parseDate(d.date))})
                    .y(function(d) {return y(d.count)});
    
    const xAxis = d3.axisBottom(x)
                    .tickFormat(d3.timeFormat('%b %Y'))
                    
            // .attr('class', 'x-axis-group')
                                .ticks(20)
                                
                                
            
    const yAxis = d3.axisLeft(y)
            // .attr('class', 'y-axis-group')
                                .ticks(10)
            
            xAxisGroup.call(xAxis).selectAll('text')
                                .attr('transform', 'rotate(-45)')
                                .attr('fontFamily','Roboto')
                                .attr('text-anchor', 'end')
            yAxisGroup.call(yAxis)
    
    
    
    const makeTimeseries = (focus) => {
            console.log(focus)

            svg.selectAll('.x-axis').transition()
                .duration(2000)
            svg.append("linearGradient")
                .attr("id", "line-gradient")
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", 0)
                .attr("y1", y(0))
                .attr("x2", 0)
                .attr("y2", y(max))
                .selectAll("stop")
                    .data([
                    {offset: "0%", color: "#2DE1C2"},
                    {offset: "100%", color: "#EE6352"}
                    ])
                .enter().append("stop")
                    .attr("offset", function(d) { return d.offset; })
                    .attr("stop-color", function(d) { return d.color; });


        const path = graph.append('path')    
                        .data([focus])
                        .attr('class', 'line')
                        .attr('fill', 'none')
                        .attr('stroke', 'url(#line-gradient)')
                        .attr('stroke-width', 1.5)
                        .transition()
                        .duration(2000)
                        .attr('d', line)
                }

    useEffect(() => {
        makeTimeseries(focus)
    }, [focus])



    return (
            <svg className = "canvasTimeseries">
                
            </svg>
    )
}














// var x = d3.scaleTime()
//                 .domain(d3.extent(data, (d) => {getDate(d.value)}))
//                 .range([0, width]);
//             svg.append("g")
//                 .attr("transform", "translate(0," + height + ")")
//                 .call(d3.axisBottom(x).ticks(5));
        
//         var y = d3.scaleLinear()
//                 .domain([0, d3.max(data, (d) => {getVal(d.value)})])
//                 .range([ height, 0 ]);
//             svg.append("g")
//                 .call(d3.axisLeft(y));
                
        
//         // var res = sumstat.map(function(d){ return d.key }) // list of group names
//        var res = data.map((d) => d.name)// list of group names
//         var color = d3.scaleOrdinal()
//         .domain(res)
//         .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999']) 

//         svg.selectAll(".line")
//         .data(data)
//         .enter()
//         .append("path")
//             .attr("fill", "none")
//             .attr("stroke", color(d => {return d.name}))
//             .attr("stroke-width", 1.5)
//             .attr("d",d3.line()
//                         .x(d => x(d))
//                         .y(d => y(d))
//             )