import { EChartOption } from "echarts"
import { TDeadIncr } from "../api/type"

// const getThemeRiverOpt: (data: any[]) => EChartOption[] = (data) => {
const getThemeRiverOpt: (data: TDeadIncr) => EChartOption = (data) => {
    const colors: any = {
        '中国': '#FF0000',
        '亚洲其他': '#00BFFF',
        '西班牙': '#D2691E',
        '意大利': '#FFD700',
        '欧洲其他': '#FFDEAD',
        '美国': '#FF00FF',
        '北美洲其他': '#800080',
        '中东': '#008000',
        '非洲': '#696969',
        '南美洲': '#0000FF',
        '大洋洲': '#D8BFD8' 
    }
    const opt = {
        tooltip: {
            trigger: 'axis' as 'axis',
            axisPointer: {
                type: 'line' as 'line',
                lineStyle: {
                    color: 'rgba(0,0,0,0.2)',
                    width: 1,
                    type: 'solid' as 'solid'
                }
            },
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
        },
        
    
        legend: {
            data: data.legend
        },
        
        singleAxis: {
            top: 50,
            bottom: 50,
            axisTick: {},
            axisLabel: {},
            type: 'time' as 'time',
            axisPointer: {
                animation: true,
                label: {
                    show: true
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed' as 'dashed',
                    opacity: 0.2
                }
            }
        },
        color: ['#DC143C','#DB7093','#FFA500','#8B0000','#4682B4','#000080','#4169E1','#228B22','#B8860B','#6B8E23','#7B68EE'],
        series: [
            {
                type: 'themeRiver' as 'themeRiver',
                emphasis: {
                    itemStyle: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.8)'
                    }
                },
                label: {
                    show: false,
                    // position: 'right',
                    // distance: 1000
                },
                data: data.data
            }
        ]
    }
    

    return opt
}
export default getThemeRiverOpt