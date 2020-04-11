import { EChartOption } from "echarts"
import { TDeadIncrBar } from "../api/type"
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
        type: 'value' as any,
        max: 100
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

const getTrendBarOpt: (data: TDeadIncrBar) => EChartOption = (data) => {
    const colors: any = {
        '中国': '#DC143C',
        '亚洲其他': '#DB7093',
        '西班牙': '#FFA500',
        '意大利': '#8B0000',
        '欧洲其他': '#4682B4',
        '美国': '#000080',
        '北美洲其他': '#4169E1',
        '中东': '#228B22',
        '非洲': '#B8860B',
        '南美洲': '#6B8E23',
        '大洋洲': '#7B68EE'
    }
    const totalConfirmed =
        Object.entries(data).map(([k, v]) => ({
            name: k,
            type: 'bar',
            stack: '总量',
            data: v.deadIncrPercent,
            areaStyle: {},
            itemStyle: {
                color: colors[k]
            }
        }))
    const xData = Object.entries(data)[0][1].dateList

    const legend = Object.keys(data)

    const opt =
        {
            ...getLineBase(xData, legend),
            series: totalConfirmed
        }
    return (opt
    )
}
export default getTrendBarOpt