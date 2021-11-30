import React, {useEffect} from 'react'
import * as d3 from 'd3'
import axios from 'axios'



const dims = {height : 300, width : 300, radius : 150};
const cent = {x : (dims.width / 2 + 5), y : (dims.height / 2 + 5)};




export default function Piechart(props) {
    const data = props.data
    console.log(data)
    const makePieChart = (data) => {


        const svg = d3.select('.canvas').append('svg')
                    .attr('width', dims.width + 200)
                    .attr('height', dims.height + 200)
        const color = d3.scaleOrdinal(d3['schemeSet3'])
        color.domain(data.map(d => d.name))


        const legendCircles = svg.append('g')
            .attr('transform', `translate(${dims.width + 40}, 10)`);

        const legendText = svg.append('g')
            .attr('transform', `translate(${dims.width + 40}, 10)`)
        // const pie = d3.pie()
        legendCircles.selectAll('myCircles')
                    .data(data)
                    .enter()
                        .append('circle')
                        .attr('cx', 10)
                        .attr('cy', function(d, i){ return 100 + (i * 25)})
                        .attr('r', 10)
                        .style('fill', d => color(d.name));
                        // .text("hey")
        
        legendText.selectAll('myText')
                    .data(data)
                    .enter()
                        .append('text')
                        .text(d => d.name)
                            .attr('x', 30)
                            .attr('y', function(d, i){ return 105 + (i * 25)})
                            .attr('fill', 'black')
                            .style('color', 'black')
                        

        const graph = svg.append('g')
                        .attr('transform', `translate(${cent.x}, ${cent.y})`)

        const arcTweenEnter = (d) => {
                    var i = d3.interpolate(d.endAngle, d.startAngle);
                    return function(t) {
                        d.startAngle = i(t);
                        return arcPath(d);
                    }
                }
        const pie = d3.pie()
                    .sort(null)
                    .value(d => d.value);
        
        const arcPath = d3.arc()
                        .outerRadius(dims.radius)
                        .innerRadius(dims.radius / 1.8)
        
        const paths = graph.selectAll('path')
                        .data(pie(data))

            paths.enter()
                .append('path')
                .attr('className', 'arc')
                // .attr('d', arcPath)
                .attr('stroke', '#fff')
                .attr('strokeWidth', 3)
                .attr('fill', d => color(d.data.name))
                .transition().duration(750)
                    .attrTween('d', arcTweenEnter);
        
        

            }
        
    
    useEffect(() => {
            makePieChart(data)
    }, [])

        return (
            <div className = "canvas">
            
            </div>
        )
}
