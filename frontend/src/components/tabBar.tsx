import styled from "styled-components"
import { Button } from 'antd'
import { useState } from 'react'

export interface IProps {
    onChangeMode: (s: "map" | "line" | "dead") => void
}

const Root = styled.div`
    display: flex;
    justify-content: flex-start;
    height: 100%;
    
`
const SButton = styled(Button)`
    height:100%;
    margin: 0 auto;
    width: 50%;
`

export default function TabBar({ onChangeMode }: IProps) {
    const [mode, setMode] = useState("map")
    return (
        <Root>
            <SButton onClick={() => {
                setMode("map")
                onChangeMode("map")
            }}
                type={mode == "map" ? "primary" : "link"} > 地图 </SButton>
            <SButton
                onClick={() => {
                    setMode("line")
                    onChangeMode("line")
                }}
                type={mode == "line" ? "primary" : "link"}
            > 趋势 </SButton>
            <SButton
                onClick={() => {
                    setMode("dead")
                    onChangeMode("dead")
                }}
                type={mode == "dead" ? "primary" : "link"}
            > 死亡趋势 </SButton>
        </Root >
    )
}
