import React, { useState, useEffect, useCallback } from 'react'
import { getMapOpt, getMapIncrOpt } from '../libs/charts/worldmap'
import ReactEcharts from '../libs/charts'
import styled from 'styled-components'
import { EChartOption, getMap } from 'echarts'
import TabBar from '../components/tabBar'
import DDataTable from '../components/dtable'
import { TCountryMap, TCountryIncrMap, TChinaCount, StatisticInfo } from '../libs/api/type'
import { APIGetCountryMap, APIGetCountryTrend, APICountryIncr, APIGetDeadIncrTrend, APIGetDeadIncrTrendBar, APIGetDeadIncrTrendAfrica, APIGetChinaCount, APIGetStatisticInfo } from '../libs/api/api'
import { message, Row, Col, Radio, Button, Tooltip, Input, List, Divider  } from 'antd'
import CardList from '../components/cardList'
import getTrendOpt from '../libs/charts/line'
import getThemeRiverOpt from '../libs/charts/ThemeRiver'
import getTrendBarOpt from '../libs/charts/bar'
import moment from 'moment'
import { SearchOutlined } from '@ant-design/icons';


const Root = styled.div`
    height:100vh;
    width: 100vw;
    overflow:hidden;
`

const Header = styled.div`
    // height: 15rem;
    text-align:center;
    h1{
        height:6rem;
        font-size:26pt;
        padding:  1rem;
        margin: 0;
    }
`

const Content = styled.div`
    height: calc( 100% - 16rem );
    width: 100%;
`
const LeftTable = styled.div`
    width: 100%;
    height:95%;
    display:inline-block;
    z-index:10;
`
const RightChart = styled.div`
    float:left;
    width: 60%;
    display:inline-block;
    height:100%;
    overflow:hidden;
`
const FloatingArea = styled.div`
    position: absolute;
    top :1px;
    right:1rem;


`

const TabBarContainer = styled.div`
    height: 54.6px;
`

const ChartArea = styled.div`
    position: relative;
    height: calc( 100% - 54.6px );
`

const SearchArea = styled.div`
    position: relative;
    text-align:center;
`

const Time = styled.div`
    width: 100%;
    padding: 0 3rem;
    display: flex;
    justify-content: flex-end;
`

const { Search } = Input;

export default function ddata() {
    const [mode, setMode] = useState<"map" | "line" | "dead">("map")
    const [DataMap, setDataMap] = useState<TCountryMap>([])
    const [DataIncurMap, setDataIncurMap] = useState<TCountryIncrMap>([])
    const [DataMapMode, setDataMapMode] = useState("acc")
    const [DataDeadMode, setDataDeadMode] = useState("theme")
    const [DataTrend, setDataTrend] = useState<any[]>([])
    const [mapOpt, setMapOpt] = useState<EChartOption>({})
    const [trendOpt, setTrendOpt] = useState<EChartOption[]>([])
    const [deadTrendOpt, setDeadTrendOpt] = useState<EChartOption>({})
    const [deadTrendBarOpt, setDeadTrendBarOpt] = useState<EChartOption>({})
    const [selectedCountry, setSelectedCountry] = useState<string[]>([])
    const [DataStatisticInfo, setDataStatisticInfo] = useState<StatisticInfo>([])
    const [FilterDataStatisticInfo, setFilterDataStatisticInfo] = useState<StatisticInfo>([])
    const [range, setRange] = useState<{
        from: string, to: string
    }>({
        from: "2020-03-01",
        to: moment().format("YYYY-MM-DD")

    })

    const [data, setData] = useState<TChinaCount | undefined>(undefined)
    useEffect(() => {
        APIGetChinaCount().then(res => setData(res.data))

    }, [])
    const duration = moment.duration(moment().diff(moment(data?.modifyTime)))

    const getCountryMap = useCallback(() => {
        console.log("DataMapMode effect", DataMapMode)
        if (DataMapMode == "acc")
            APIGetCountryMap()
                .then(res => setDataMap(res.data))
                .catch(() => message.error("error"))
        else
            APICountryIncr()
                .then(res => setDataIncurMap(res.data))
                .catch(() => message.error("error"))
    }, [DataMapMode])

    const getTrendData = useCallback(() => {
        if (selectedCountry.length > 0) APIGetCountryTrend({
            country_list: selectedCountry,
            ...range,
        }).then(res => setTrendOpt(getTrendOpt(res.data,"acc")))
        else
            setTrendOpt([])
    }, [selectedCountry])

    const getDeadTrendData = useCallback(() => {
        if (DataDeadMode == "theme")
            APIGetDeadIncrTrend()
                .then(res => setDeadTrendOpt(getThemeRiverOpt(res.data)))
                .catch(() => message.error("error"))
        else if (DataDeadMode == "themeAfrica")
            APIGetDeadIncrTrendAfrica()
                .then(res => setDeadTrendOpt(getThemeRiverOpt(res.data)))
                .catch(() => message.error("error"))
        else
            APIGetDeadIncrTrendBar()
                .then(res => setDeadTrendBarOpt(getTrendBarOpt(res.data)))
                .catch(() => message.error("error"))
    }, [DataDeadMode])

    const getDataStatisticInfo = useCallback(() => {
        APIGetStatisticInfo()
            .then(res => {
                setDataStatisticInfo(res.data)
                setFilterDataStatisticInfo(res.data)
            })
            .catch(() => message.error("error"))
    }, [])

    useEffect(() => {
        if (DataMapMode == 'acc')
            setMapOpt(getMapOpt(DataMap))
        else
            setMapOpt(getMapIncrOpt(DataIncurMap))

    }, [DataMap, DataIncurMap, DataMapMode])

    useEffect(() => getDataStatisticInfo(), [])


    useEffect(() => getCountryMap(), [DataMapMode])

    useEffect(() => getTrendData(), [selectedCountry])

    useEffect(() => getDeadTrendData(), [DataDeadMode])

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      };

    

    return (
        <Root>
            <Header>
                <h1>JHU数据自助下载</h1>
                {/* <CardList /> */}
                <Time><span>统计截止:{moment(data?.modifyTime).format('LLL')}, 更新于{
                        Math.floor(duration.asHours())
                    }小时{
                            Math.round(duration.asMinutes() % 60)

                        }分钟前</span></Time>
            </Header>
            <SearchArea>
                <Search placeholder="input search text" onSearch={value => {
                    setFilterDataStatisticInfo(DataStatisticInfo.filter(n => n.title.indexOf(value) >= 0))
                    }} style={{width: '40%'}} enterButton/>
                <br />
                <br />
            </SearchArea>
            <Content>
                <LeftTable>
                    <DDataTable
                        data={FilterDataStatisticInfo}
                    />
                </LeftTable>
            </Content>
            <br />
            <Divider>北航大数据科学与脑机智能高精尖创新中心服务支撑</Divider>
        </Root >
    )
}
