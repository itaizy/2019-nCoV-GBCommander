import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import QuickCard from './quickCard'
import { TChinaCount } from '../libs/api/type'
import { APIGetChinaCount } from '../libs/api/api'
import { Statistic, Row, Col, Button, Card } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

moment.locale('zh-ch')


const Root = styled.div`
    width: 100%;
    height: 8rem;
    display: flex;
    justify-content: space-around;
    margin: 0 1rem;
    padding: 0 0 0.5rem 0;
`
const item = [
    "累计确诊",
    "死亡",
    "治愈",
    "境外输入",
    "累计境外输入"
]
const Time = styled.div`
    width: 100%;
    padding: 0 3rem;
    display: flex;
    justify-content: flex-end;
`

export default function CardList() {
    const [data, setData] = useState<TChinaCount | undefined>(undefined)
    useEffect(() => {
        APIGetChinaCount().then(res => setData(res.data))

    }, [])
    const duration = moment.duration(moment().diff(moment(data?.modifyTime)))

    return (
        <div>
            <Time><span>统计截止:{moment(data?.modifyTime).format('LLL')}, 更新于{
                Math.floor(duration.asHours())
            }小时{
                    Math.round(duration.asMinutes() % 60)

                }分钟前</span>
                <a href='./ddata.html'>&nbsp;&nbsp;&nbsp;&nbsp;数据下载</a>
            </Time>
            
            {
                data ?
                    <>
                        <Row>
                            <Col span={16}>
                                <Card>
                                    <Row>
                                        <Col span={6}>
                                            <Statistic
                                                title={<div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "black" }}>海外现有确诊</div>}
                                                value={data.currentConfirmedCount}
                                                valueStyle={{ color: '#FF3030' }}
                                            />
                                            <Statistic
                                                value={data.currentConfirmedIncr}
                                                valueStyle={{ color: '#FF3030' }}
                                                prefix={data.currentConfirmedIncr > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} />
                                        </Col>
                                        <Col span={6}>
                                            <Statistic
                                                title={<div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "black" }}>海外累计确诊</div>}
                                                value={data.confirmedCount}
                                                valueStyle={{ color: '#B03060' }}
                                            />
                                            <Statistic
                                                value={data.confirmedIncr}
                                                valueStyle={{ color: '#B03060' }}
                                                prefix={data.confirmedIncr > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} />
                                        </Col>
                                        <Col span={6}>
                                            <Statistic
                                                title={<div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "black" }}>海外累计死亡</div>}
                                                value={data.deadCount}
                                                valueStyle={{ color: '#8B8B7A' }}
                                            />
                                            <Statistic
                                                value={data.deadIncr}
                                                valueStyle={{ color: '#8B8B7A' }}
                                                prefix={data.deadIncr > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} />
                                        </Col>
                                        <Col span={6}>
                                            <Statistic
                                                title={<div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "black" }}>海外累计治愈</div>}
                                                value={data.curedCount}
                                                valueStyle={{ color: '#3f8600' }}
                                            />
                                            <Statistic
                                                value={data.curedIncr}
                                                valueStyle={{ color: '#3f8600' }}
                                                prefix={data.curedIncr > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            {/* <Col span={1}>
                        </Col> */}
                            <Col span={8}>
                                <Card>
                                    <Row>
                                        <Col span={12}>
                                            <Statistic
                                                title={<div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "black" }}>中国现有确诊</div>}
                                                value={data.chinaConfirmedCount}
                                                valueStyle={{ color: '#FF3030' }}
                                            />
                                            <Statistic
                                                value={data.chinaConfirmedIncr}
                                                valueStyle={{ color: '#FF3030' }}
                                                prefix={data.chinaConfirmedIncr > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} />
                                        </Col>
                                        <Col span={12}>
                                            <Statistic
                                                title={<div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "black" }}>中国累计输入</div>}
                                                value={data.inputTotalConfirmedCount}
                                                valueStyle={{ color: '#FF3030' }}
                                            />
                                            <Statistic
                                                value={data.inputTotalConfirmedIncr}
                                                valueStyle={{ color: '#FF3030' }}
                                                prefix={data.inputTotalConfirmedIncr > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        {/*                         
                        <QuickCard
                            data={[data?.currentConfirmedCount, data?.currentConfirmedIncr]}
                            text={"现有确诊"}
                            color={"red"}
                        />

                        <QuickCard
                            data={[data?.confirmedCount, data?.confirmedIncr]}
                            text={"累计确诊"}
                            color={"red"}
                        />
                        
                        

                        <QuickCard
                            data={[data?.deadCount, data?.deadIncr]}
                            text={"死亡"}
                            color={"grey"}
                        />
                        <QuickCard
                            data={[data?.curedCount, data?.curedIncr]}
                            text={" 治愈"}
                            color={"green"}
                        />
                        <QuickCard
                            data={[data?.inputConfirmedCount, data?.inputConfirmedIncr]}
                            text={"境外输入"}
                            color={"red"}
                        />
                        <QuickCard
                            data={[data?.inputTotalConfirmedCount, data?.inputTotalConfirmedIncr]}
                            text={"累计境外输入"}
                            color={"red"}
                        /> */}

                    </>
                    : null
            }



        </div>
    )
}
