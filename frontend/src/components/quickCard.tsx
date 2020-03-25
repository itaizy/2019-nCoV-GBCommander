import React from 'react'
import styled from 'styled-components'

const Root = styled.div`
    border-radius: 5px;
    display:flex;
    flex-direction:column;
    justify-content:column;
    align-items: center;
    background: #EEEEEE;
    width: 8rem;
`

const Text = styled.div`
    width: 100%;
    text-align:center;
    color: #222222;
    font-size:14pt;
`
const Number = styled.div < { size: "big" | "small", color: string } > `
    width: 100%;
    text-align:center;
    color: ${props => props.color};
    font-size: ${props => props.size == "big" ? "16pt" : "14pt"};
`

export default function QuickCard({ data, color, text }: {
    text: string, data: [number, number], color: string
}) {
    return (
        <Root>
            <Text> {text}</Text>
            <Number size={"big"} color={color} >{data[0]}</Number>
            <Text> 较昨日</Text>
            <Number size={"small"} color={color}>+{data[1]}</Number>
        </Root>
    )
}
