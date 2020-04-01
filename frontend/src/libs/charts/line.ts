import { EChartOption } from "echarts"
import { TCountryTrend } from "../api/type"
const getLineBase = (xData: any[], legend: any[]) => ({
    legend: {
        data: legend,
    },
    xAxis: {
        type: 'category' as any,
        boundaryGap: false,
        data: xData
    },
    yAxis: {
        type: 'value' as any
    },
    toolbox: {
        left: 0,
        bottom:"25%",
        orient:"verticle",
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
        }
    },
    tooltip: {
        trigger: 'axis' as 'axis',
        axisPointer: {
            type: 'cross' as 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },

})

const getTrendOpt: (data: TCountryTrend) => EChartOption[] = (data) => {
    const totalConfirmed =
        Object.entries(data).map(([k, v]) => ({
            name: k,
            type: 'line',
            stack: '总量',
            data: v.confirmedCount
        }))
    const deltaConfirmed =
        Object.entries(data).map(([k, v], idx) => ({
            name: k,
            type: 'line',
            stack: '总量',
            data: v.confirmedIncr
        }))
    const xData = Object.entries(data)[0][1].dateList

    const legend = Object.keys(data)

    const opt =
        [{
            ...getLineBase(xData, legend),
            title: {
                text: '累计确诊'
            },
            series: totalConfirmed

        }, {
            ...getLineBase(xData, legend),
            title: {
                text: '新增确诊'
            },
            series: deltaConfirmed



        }]
    return (opt
    )
}
export default getTrendOpt