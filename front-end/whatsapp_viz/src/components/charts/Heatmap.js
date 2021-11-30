import React, {useEffect} from 'react'
import * as d3 from 'd3';
// import {scale} from 'd3-scale'

// const margin = {top : 20, right : 25, bottom : 20, left : 40}
// const width = 450 - margin.left - margin.right;
// const height = 300 - margin.top - margin.bottom;




export default function Heatmap(props) {
    
    const data = props.data
    
    const heightPerMember = 38
    const widthPerMember = 167
    // console.log(data)

    const makeHeatmap = (data) => {
        var margin = {top: 20, right: 20, bottom: 20, left: 90},
        width = data.length * widthPerMember - margin.left - margin.right,
        height = data.length * heightPerMember - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(".canvasHeatmap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Labels of row and columns
        // var myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        // var myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]
        const dataMatrix = data.map(d => d.value)
        const myGroups = data.map(d => d.name)
        const myVars =Array.from({length: 31}, (_, index) => index + 1);
        

        // console.log(day1)



        var x = d3.scaleBand()
            .range([0, width])
        .domain(myVars)
        .padding(0.1);
            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(32))

        // Build X scales and axis:
        var y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(myGroups.reverse())
        .padding(0);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Build color scale
        var myColor = d3.scaleLinear()
        .range(["white", "#69b3a2"])
        .domain([0, 1000])

        let realIndex = 0
        let offset = 0
        for (let j = 0; j < data.length; j ++) {
            for (let i = 1; i <= 31; i++) {
                var datum = data[j].value[`${i}`]
                console.log(datum)
                svg.append('rect')
                .attr("x", x(i))
                .attr("y", offset * 5 * data.length)
                .attr("width", 30)
                .attr("height", 30)
                .style("fill", myColor(datum))

                // svg.append('text')
                // .attr("x", i * 30 + 2)
                // .attr("y", offset * 30 + 17)
                // .text(`${datum}`)
                // .style("fontSize", "8")

                realIndex ++
            }
            offset ++
        }

        // svg.selectAll('.row')
        // .data(day1, d => d)
        // .enter()
        // .append('rect')
        // .attr("x", (d, i) => x(i))
        // .attr("y", (d, i) => y(i))
        // .attr("width", x.bandwidth())
        // .attr("height", y.bandwidth())
        // .style("fill", (d, i) => myColor(d))
    

        //Read the data
        // svg.selectAll()
        //     .data(data, function(d, i) {
        //         return d.value[`${i}`]})
        //     .enter()
        //         .append("rect")
        //         .attr("x", function(d) { return x(d.name) })
        //         .attr("y", function(d, i) { return y(d.value[`${i}`]) })
        //         .attr("width", x.bandwidth() )
        //         .attr("height", y.bandwidth() )
        //         .style("fill", function(d) { return myColor(d.value)} )

    }


    useEffect(() => {
        makeHeatmap(data)
    }, []); 


    return (
        <div className = "canvasHeatmap">

        </div>
    )
}

































//     const makeHeatmap = (data) => {
//         const dataMatrix = data.map(d => d.value)
//         // console.log(dataMatrix)
//             // data.map(d => d.values)
//         const rowLabels = data.map(d => d.name)
//         const colLabels = data[0].value.map((d, i) => "Day " + `${i + 1}`)
        
//         const matrix = () => {
//             const margin = { top: 50, right: 50, bottom: 180, left: 180 }
//             const width = 350
//             const height = 350
//             const container = '.canvasHeatmap'
//             const startColor = "#FC7C89"
//             const endColor = "#21A38B"  
//             const maxValue = d3.max(dataMatrix, (layer) => {
//                 return d3.max(layer, (d) => {
//                     return d
//                 }
//                 )})
//             const minValue = d3.min(dataMatrix, (layer) => {
//                 return d3.min(layer, (d) => {
//                     return d
//                 }
//                 )})
            
//             const numrows = dataMatrix.length;
//             const numcols = dataMatrix[0].length;

//             const svg = d3.select('.canvasHeatmap')
//                 .append('svg')
//                 .attr('width', width + margin.left + margin.right)
//                 .attr('height', height + margin.top + margin.bottom)
//                 .append('g')
//                 .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            
//             const background = svg.append('rect')
//                 .attr('width', width)
//                 .attr('height', height)
//                 .style('stroke', 'black')
            
//             const x = d3.scaleBand()
//                     .range([0, width]).domain(d3.range(numcols))

//             const y = d3.scaleBand()
//                 .range([height, 0])
//                 .domain(d3.range(numrows))
                

//             const colorMap = d3.scaleLinear()
//                 .domain([minValue, maxValue])
//                 .range([startColor, endColor])
            
//             const row = svg.selectAll('.row')
//                 .data(dataMatrix)
//                 .enter()
//                 .append('g')
//                 .attr('class', 'row')
//                 .attr('transform', function(d, i) {
//                     return 'translate(0,' + y(i) + ')'
//                 })

//             const cell = row.selectAll('.cell')
//                         .data((d) => {return d})
//                         .enter()
//                         .append('g')
//                         .attr('class', 'cell')
//                         .attr('transform', function(d, i) {
//                             return 'translate(' + x(i) + ', 0)'
//                         })
            
//             cell.append('rect')
//                 .attr('width', x.rangeBand() - 0.3 )
//                 .attr('height', y.rangeBand() - 0.3 )
            
//             row.selectAll('.cell')
//                         .data((d, i) => data[i])
//                         .style("fill", colorMap)
            
//             const labels = svg.append('g')
//                 .attr('class', 'labels')
            
//             const columnLabels = labels
//                 .selectAll('.column-label')
//                 .data(colLabels)
//                 .enter()
//                 .append('g')
//                 .attr('class', 'column-label')
//                 .attr('transform', function(d, i) {
//                     return 'translate(' + x(i) + ',' + height + ')'
//                 })

//             columnLabels
//                 .append('line')
//                 .style("stroke", "black")
//                 .style("stroke-width", "1px")
//                 .attr('x1', x.rangeBand() / 2)
//                 .attr('x2', x.rangeBand() / 2)
//                 .attr('y1', 0)
//                 .attr('y2', 5)
            
//             columnLabels
//                 .append('text')
//                 .attr("x", 0)
//                 .attr("y", y.rangeBand() / 2 + 20)
//                 .attr("dy", "0.82em")
//                 .attr("text-anchor", "end")
//                 .attr("transform", "rotate(-60)")
//                 .text(function(d) { return d })
            
//             const rowLabels = labels
//                 .selectAll('.row-label')
//                 .data(rowLabels)
//                 .enter()
//                 .append('g')
//                 .attr('class', 'row-label')
//                 .attr('transform', function(d, i) {
//                     return 'translate(' + 0 + ',' + y(i) + ')'
//                 })
            
//             rowLabels
//                 .append('line')
//                 .style("stroke", "black")
//                 .style("stroke-width", "1px")
//                 .attr('x1', 0)
//                 .attr('x2', -5)
//                 .attr('y1', y.rangeBand() / 2)
//                 .attr('y2', y.rangeBand() / 2)
            
//             rowLabels
//                 .append('text')
//                 .attr("x", -8)
//                 .attr("y", y.rangeBand() / 2)
//                 .attr("dy", "0.32em")
//                 .attr("text-anchor", "end")
//                 .text(function(d) { return d })
//             console.log("should be done")
//             }
        
//         matrix()
// }






