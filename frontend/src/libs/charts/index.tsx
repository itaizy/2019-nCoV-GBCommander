
import React, { useState, useRef, useEffect } from 'react'
import echart, { EChartOption } from 'echarts'
import worldmap from 'echarts/map/json/world.json'

echart.registerMap('world', worldmap)

export interface IProps {
    option: EChartOption
    width?: string
    height?: string
}

export default function ReactEcharts({ option, width, height }: IProps) {
    const [chartObj, setChartObj] = useState<echart.ECharts | undefined>(undefined)
    const chartContainer = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (chartContainer.current) {
            const chart = echart.init(chartContainer.current)
            setChartObj(chart)
        }
    }, [chartContainer])


    useEffect(() => {
        if (chartObj) {
            console.log(option)
            chartObj.setOption(option,true)
        }
    }, [chartObj, option])


    return (
        <div ref={chartContainer} style={{
            width: "100%",
            height: height ?? "100%"
        }} />
    )
}
