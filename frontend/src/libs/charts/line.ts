import { EChartOption } from "echarts"
import { TCountryTrend } from "../api/type"
const getLineBase = (xData: any[], legend: any[]) => ({
    legend: {
        data: legend,
    },
    xAxis: {
        type: 'category' as any,
        boundaryGap: false,
    },
    yAxis: {
        type: 'value' as any
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
            data: v.confirmedCount
        }))
    const deltaConfirmed =
        Object.entries(data).map(([k, v], idx) => ({
            name: k,
            type: 'line',
            data: v.confirmedIncr
        }))
    const legend = Object.keys(data)

    const opt =
        [{
            ...getLineBase([], legend),
            title: {
                text: '累计确诊'
            },
            series: totalConfirmed

        }, {
            ...getLineBase([], legend),
            title: {
                text: '新增确诊'
            },
            series: deltaConfirmed



        }]
    return (opt
    )
}
export default getTrendOpt