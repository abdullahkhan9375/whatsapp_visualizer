import { dragDisable } from 'd3-drag';
import React, {useEffect, useState} from 'react'
import Timeseries from './charts/Timeseries';



export default function TimeseriesAssembly(props) {

    const [focus, setFocus] = useState([])
    // const [secondFocus, setSecondFocus] = useState([...props.data[0].data])
    // const data = props.data 

    const generateSenderList = props.data.map((d, i) => {
        return <li><button onClick = {() => setTheFocus(d)} > {d.name} </button> </li>
    })

    // let selection = [];

    const setTheFocus = (d) => {
        setFocus(focus => [...d.data])
        console.log(d.name)
    }

    return (
        <div>
        {focus.length !== 0 ? <Timeseries focus = {focus}/> : <p> Make a selection </p>}
            <div>
            {generateSenderList}</div>
        </div>
    )
}
