import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import QuickCard from './quickCard'
import { TChinaCount } from '../libs/api/type'
import { APIGetChinaCount } from '../libs/api/api'

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

export default function CardList() {
    const [data, setData] = useState<TChinaCount | undefined>(undefined)
    useEffect(() => {
        APIGetChinaCount().then(res => setData(res.data))

    }, [])

    return (
        <Root>
            {
                data ?

                    <>
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
                        />

                    </>
                    : null
            }



        </Root>
    )
}
