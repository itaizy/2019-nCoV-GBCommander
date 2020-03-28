import { EChartOption } from 'echarts'
import { TCountryMap } from '../api/type'
import nameMap from '../../../assets/name_map.json'

const getOption: (data: TCountryMap) => EChartOption = (data) => ({
    visualMap: [{
        type: "continuous" as "continuous",
        left: 'right' as any,
        min: 0,
        max:5000,
        inRange: {
            color: [ '#e0f3f8','#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        },
        text: ['High', 'Low'],           // 文本，默认为数值文本
        calculable: true
    }],
    tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
        formatter: function (params: any) {
            return `${(params.name) as any}: ${(params.value) as any}`
        }
    },
    series: [
        {
            name: 'USA PopEstimates',
            type: 'map',
            roam: true,
            map: 'world',
            nameMap: nameMap,

            emphasis: {
                label: {
                    show: true
                }
            },
            // 文本位置修正
            textFixed: {
                Alaska: [20, -20]
            },
            data: data.map(e => ({
                name: e.name,
                value: e.confirmedCount
            }))


        }
    ]


})

export default getOption
