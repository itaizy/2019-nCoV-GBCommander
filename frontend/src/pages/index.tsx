import React, { useState, useEffect, useCallback } from 'react'
import { getMapOpt, getMapIncrOpt } from '../libs/charts/worldmap'
import ReactEcharts from '../libs/charts'
import styled from 'styled-components'
import { EChartOption, getMap } from 'echarts'
import TabBar from '../components/tabBar'
import DataTable from '../components/table'
import { TCountryMap, TCountryIncrMap } from '../libs/api/type'
import { APIGetCountryMap, APIGetCountryTrend, APICountryIncr, APIGetDeadIncrTrend, APIGetDeadIncrTrendBar, APIGetDeadIncrTrendAfrica } from '../libs/api/api'
import { message, Row, Col, Radio } from 'antd'
import CardList from '../components/cardList'
import getTrendOpt from '../libs/charts/line'
import getThemeRiverOpt from '../libs/charts/ThemeRiver'
import getTrendBarOpt from '../libs/charts/bar'
import moment from 'moment'


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
    float:right;
    width: 40%;
    height:100%;
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

export default function index() {
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
    const [range, setRange] = useState<{
        from: string, to: string
    }>({
        from: "2020-03-01",
        to: moment().format("YYYY-MM-DD")

    })

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
        }).then(res => setTrendOpt(getTrendOpt(res.data)))
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




    useEffect(() => {
        if (DataMapMode == 'acc')
            setMapOpt(getMapOpt(DataMap))
        else
            setMapOpt(getMapIncrOpt(DataIncurMap))

    }, [DataMap, DataIncurMap, DataMapMode])


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
                <h1>新冠疫情全球态势研判系统</h1>
                <CardList />

            </Header>

            <Content>
                <LeftTable>
                    <DataTable
                        data={DataMap}
                        select={mode == "line" ? {
                            onSelect(e, _, rows) {
                                setSelectedCountry(rows.map((e: any) => e.name))
                            },
                            hideDefaultSelections: true,
                            selectedRowKeys: selectedCountry
                        } : undefined}
                    />
                </LeftTable>
                <RightChart>
                    <TabBarContainer>
                        <TabBar
                            onChangeMode={(e) => setMode(e)}
                        />
                    </TabBarContainer>
                    <ChartArea>
                        {
                            mode == "map" ? <>
                                <FloatingArea>
                                    <Radio.Group onChange={e => {
                                        console.log(e.target.value)
                                        return setDataMapMode(e.target.value)
                                    }} value={DataMapMode}>
                                        <Radio value={"acc"}>累计</Radio>
                                        <Radio value={"inc"}>新增</Radio>
                                    </Radio.Group>
                                </FloatingArea>

                                <ReactEcharts option={mapOpt} />
                            </> : 
                            mode == "line" ? 
                            trendOpt.length > 0 ?
                                    trendOpt.map((e, idx) =>
                                        <ReactEcharts key={`rmap-${idx}`} option={e} height={"50%"} />) :
                                    <div style={{textAlign: "center"}}>
                                    <img src="./placeholder0401.png" style={{
                                        maxWidth:"70%",
                                    }}/>
                                    </div> : 
                                    <>
                                        <FloatingArea>
                                            <Radio.Group onChange={e => {
                                                console.log(e.target.value)
                                                return setDataDeadMode(e.target.value)
                                            }} value={DataDeadMode}>
                                                <Radio style={radioStyle} value={"theme"}>河流图(死亡)</Radio>
                                                <Radio style={radioStyle} value={"themeAfrica"}>河流图(非洲确诊)</Radio>
                                                <Radio style={radioStyle} value={"bar"}>柱状图(死亡)</Radio>
                                            </Radio.Group>
                                        </FloatingArea>
                                        {
                                            DataDeadMode == "bar" ?
                                                <ReactEcharts option={deadTrendBarOpt}/> :
                                                <ReactEcharts option={deadTrendOpt}/> 
                                        }
                                    </>
                        }
                    </ChartArea>
                </RightChart>
            </Content>
        </Root >
    )
}
