import React, {useEffect} from 'react'
import * as d3 from 'd3'

const margin = {top: 40, right: 20, bottom: 50, left: 100}

const graphWidth = 560 - margin.left - margin.right
const graphHeight = 400 - margin.top - margin.bottom





export default function DummyLineChart() {

    const data = [
        {date : new Date(2020, 0, 1), value : 10},
        {date : new Date(2020, 0, 2), value : 20},
        {date : new Date(2020, 0, 3), value : 30},
        {date : new Date(2020, 0, 4), value : 40},
    ]

    const svg = d3.select('.canvas')
                .append('svg')
                .attr('width', graphWidth + margin.left + margin.right)
                .attr('height', graphHeight + margin.top + margin.bottom)

    const graph = svg.append('g')
                .attr('width', graphWidth)
                .attr('height', graphHeight)
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

    
    

    const x = d3.scaleTime().range([0, graphWidth])
    const y = d3.scaleLinear().range([graphHeight, 0])

    const xAxisGroup = graph.append('g')
                            .attr('class', 'x-axis')
                            .attr('transform', `translate(0, ${graphHeight})`)

    const yAxisGroup = graph.append('g')
                            .attr('class', 'y-axis')


    x.domain(d3.extent(data, d => d.date))
    y.domain([0, d3.max(data, d => d.value)])

    const xAxis = d3.axisBottom(x)
                    .ticks(4)
                    .tickFormat(d3.timeFormat('%d %b'))
    
    const yAxis = d3.axisLeft(y)
                    .ticks(4)

    // call Axes
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    
    
    // useEffect(() => {
    //     makeAxis()
    // }, [])
    


    return (
        <div className ="canvas">
            
        </div>
    )
}
