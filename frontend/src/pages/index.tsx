import React, { useState, useEffect, useCallback } from 'react'
import getMapOpt from '../libs/charts/worldmap'
import ReactEcharts from '../libs/charts'
import styled from 'styled-components'
import { EChartOption, getMap } from 'echarts'
import TabBar from '../components/tabBar'
import DataTable from '../components/table'
import { TCountryMap } from '../libs/api/type'
import { APIGetCountryMap, APIGetCountryTrend } from '../libs/api/api'
import { message, Row, Col } from 'antd'
import CardList from '../components/cardList'
import getTrendOpt from '../libs/charts/line'

const Root = styled.div`
    height:100vh;
    width: 100vw;
    overflow:hidden;
`

const Header = styled.div`
    // height: 24rem;
    text-align:center;
    h1{
        height:6rem;
        font-size:26pt;
        padding:  1rem;
        margin: 0;
    }
`

const Content = styled.div`
    height: calc( 100% - 14rem );
    width: 100%;
`
const LeftTable = styled.div`
    width: 30%;
    height:100%;
    display:inline-block;
`
const RightChart = styled.div`
    float:right;
    width: 70%;
    display:inline-block;
    height:100%;
`

const TabBarContainer = styled.div`
    height: 54.6px;
`

const ChartArea = styled.div`
    height: calc( 100% - 54.6px );
`

export default function index() {
    const [mode, setMode] = useState<"map" | "line">("map")
    const [DataMap, setDataMap] = useState<TCountryMap>([])
    const [DataTrend, setDataTrend] = useState<any[]>([])
    const [mapOpt, setMapOpt] = useState<EChartOption>({})
    const [trendOpt, setTrendOpt] = useState<EChartOption[]>([])
    const [selectedCountry, setSelectedCountry] = useState<string[]>([])
    const [range, setRange] = useState<{
        from: string, to: string
    }>({
        from: "2020-03-01",
        to: "2020-03-20",

    })

    const getCountryMap = useCallback(() => {
        APIGetCountryMap()
            .then(res => setDataMap(res.data))
            .catch(() => message.error("error"))
    }, [])

    const getTrendData = useCallback(() => {
        if (selectedCountry.length > 0) APIGetCountryTrend({
            country_list: selectedCountry,
            ...range,
        }).then(res => setTrendOpt(getTrendOpt(res.data)))
        else
            setTrendOpt([])
    }, [selectedCountry])



    useEffect(() => {
        setMapOpt(getMapOpt(DataMap))
    }, [DataMap])


    useEffect(() => getCountryMap(), [])

    useEffect(() => getTrendData(), [selectedCountry])



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
                            mode == "map" ? <ReactEcharts option={mapOpt} /> : trendOpt.length > 0 ?
                                trendOpt.map((e, idx) =>
                                    <ReactEcharts key={`rmap-${idx}`} option={e} height={"50%"} />) :
                                <img src="/placeholder.png" />

                        }
                    </ChartArea>
                </RightChart>
            </Content>
        </Root >
    )
}
