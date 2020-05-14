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
        bottom: "25%",
        orient: "verticle",
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: {
                type: ['line', 'bar', 'stack', 'tiled']
            },
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

const getTrendOpt: (data: TCountryTrend, mode: "acc" | "cur") => EChartOption[] = (data, mode = "acc") => {
    const totalConfirmed =
        Object.entries(data).map(([k, v]) => ({
            name: k,
            type: 'bar',
            stack: '总量',
            data: mode === "acc" ? v.confirmedCount : mode === "cur" ? v.currentConfirmedCount : v.curedCount,
            areaStyle: {},

        }))
    const deltaConfirmed =
        Object.entries(data).map(([k, v], idx) => ({
            name: k,
            type: 'bar',
            stack: '总量',
            areaStyle: {},
            data: v.confirmedIncr
        }))
    const xData = Object.entries(data)[0][1].dateList

    const legend = Object.keys(data)

    const opt =
        [{
            ...getLineBase(xData, legend),
            title: {
                text: mode === "acc" ? '累计确诊' : mode === "cur" ? '现有确诊' : "累计治愈"
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