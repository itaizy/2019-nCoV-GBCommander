import { EChartOption } from 'echarts'
import { TCountryMap, TCountryIncrMap } from '../api/type'
import nameMap from '../../../assets/name_map.json'
export const getMapIncrOpt: (data: TCountryIncrMap) => EChartOption = (data) => {
    const Opt = ({
        visualMap: [{
            type: 'piecewise' as 'piecewise',
            // type:"continuous" as any,
            min: 0,
            max: 10000,
            top: 0,
            align: "auto" as "right",
            text: ['高', '低'],
            textStyle: {
                fontSize: 10
            },

            inRange: {
                color: ["#fff1f0", "#ffa39e", "#ff4d4f", "#cf1322", "#820014"]
            },
            pieces: [
                { min: 10000 },
                { min: 5000, max: 9999 },
                { min: 1000, max: 4999 },
                { min: 100, max: 999 },
                { min: 1, max: 99 },
            ],
        }],
        tooltip: {
            trigger: 'item' as any,
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params: any) {
                return `${(params.name) as any}: ${params.value}`
            }
        },
        series: [
            {
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
                    value: e.confirmedIncr
                }))
            }
        ]
    })
    return Opt
}

export const getMapOpt: (data: TCountryMap) => EChartOption = (data) => {
    const opt = ({
        visualMap: [{
            type: 'piecewise' as 'piecewise',
            // type:"continuous" as any,
            min: 0,
            max: 10000,
            top: 0,
            align: "auto" as "right",
            text: ['高', '低'],
            textStyle: {
                fontSize: 10
            },

            inRange: {
                color: ["#fff1f0", "#ffa39e", "#ff4d4f", "#cf1322", "#820014"]
            },
            pieces: [
                { min: 90000 },
                { min: 10000, max: 89999 },
                { min: 1000, max: 9999 },
                { min: 100, max: 999 },
                { min: 1, max: 99 },
            ],
        }],
        tooltip: {
            trigger: 'item' as any,
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params: any) {
                return `${(params.name) as any}: ${params.value}`
            }
        },
        series: [
            {
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
    return opt

}

const getCategory = (num: number) => {
    if (num < 100) {
        return "0-99"
    } else if (num < 1000) {
        return "100-999"
    } else if (num < 10000) {
        return "1000-9999"
    } else if (num < 100000) {
        return "10000-99999"
    } else {
        return "100000"
    }
}

