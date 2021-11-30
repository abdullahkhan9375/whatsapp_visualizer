import React, {useState, useEffect} from 'react';
import {Container, Box, Text, Heading} from '@chakra-ui/react';
import * as d3 from 'd3'
import axios from 'axios'
import Piechart from './components/charts/Piechart';
import Heatmap from './components/charts/Heatmap';
import TimeseriesAssembly from './components/TimeseriesAssembly';


import './styles/index.css';
// import DummyLineChart from './components/charts/DummyLineChart';
// import React from 'react'

const dims = {height : 300, width : 300, radius : 150};
const cent = {x : (dims.width / 2 + 5), y : (dims.height / 2 + 5)};



export default function App() {
    const [pieData, setPieData] = useState(null);
    const [heatmapData, setHeatmapData] = useState(null);
    const [timeseriesData, setTimeseriesData] = useState(null);

    // const makePieChart = (data) => {
    //     console.log(data)
    //     const svg = d3.select('.canvas').append('svg')
    //         .attr('width', dims.width + 150)
    //         .attr('height', dims.height + 150)

    //     const graph = svg.append('g')
    //                     .attr('transform', `translate(${cent.x}, ${cent.y})`)


    //     const pie = d3.pie()
    //                 .sort(null)
    //                 .value(d => d.value);
        
        
                            
        
    //     const arcPath = d3.arc()
    //                     .outerRadius(dims.radius)
    //                     .innerRadius(dims.radius / 2)
    //     const color = d3.scaleOrdinal(d3['schemeSet3'])
    //     color.domain(data.map(d => d.name))
    //     const paths = graph.selectAll('path')
    //                     .data(pie(data))
    //     paths.enter()
    //         .append('path')
    //             .attr('className', 'arc')
    //             .attr('d', arcPath)
    //             .attr('stroke', '#fff')
    //             .attr('strokeWidth', 3)
    //             .attr('fill', d => color(d.data.name))

    //         }

    
    // const [angles, setAngles] = useState([]);

    const apiCall = async () => {
        const response = await axios.get("http://localhost:5000/piechart").then(res => {
        setPieData(JSON.parse(res.data.data))})
        const response2 = await axios.get("http://localhost:5000/daily_text").then(res => {
        setHeatmapData(JSON.parse(res.data.data))})
        const response3 = await axios.get("http://localhost:5000/timeseries").then(res => {
        setTimeseriesData(JSON.parse(res.data.data))})
    }        
        

    useEffect(() => {
        console.log("making req")
        apiCall()
    }, [])


    



    return (
        <Container maxW = "xl" centerContent>
        
           <Heading fontSize = "50px" > 
           Chartsapp 
           </Heading>
           {/* {pieData ? <Piechart data = {pieData}/> : <Text>Loading</Text>} */}
           {/* {heatmapData ? <Heatmap data = {heatmapData}/> : <Text>Loading</Text>} */}
        {timeseriesData ? <TimeseriesAssembly data = {timeseriesData}/> : <Text>Loading</Text>}   
        {/* <DummyLineChart/>   */}
        </Container>
    )
}

