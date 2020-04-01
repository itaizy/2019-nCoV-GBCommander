import React, { useRef, useState, useEffect } from 'react'
import { Table } from 'antd'
import { TCountryMap } from '../libs/api/type'
import styled from 'styled-components'
import { TableRowSelection, ColumnsType } from 'antd/lib/table/interface'

const columns: ColumnsType<TCountryMap[0]> = [
    { dataIndex: "name", title: "国家", key: "name" },
    {
        dataIndex: "confirmedIncr", title: "新增", key: "confirmedIncr",

        sorter: (a, b) => a.confirmedIncr- b.confirmedIncr
    },
    {
        dataIndex: "confirmedCount", title: "确诊", key: "confirmedCount",
        sorter: (a, b) => a.confirmedCount - b.confirmedCount
    },

   

    {
        dataIndex: "curedCount", title: "治愈", key: "curedCount",

        sorter: (a, b) => a.curedCount - b.curedCount


    },
    {
        dataIndex: "deadCount", title: "死亡", key: "deadCount",

        sorter: (a, b) => a.deadCount - b.deadCount
    },
]

export default function DataTable({ data, select }:
    { data: TCountryMap, select?: TableRowSelection<TCountryMap[0]> }) {
    const ref = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState(0)
    useEffect(() => {
        if (ref.current)
            setHeight(ref.current.clientHeight)
    }, [ref])

    return (
        <div
            style={{
                height: "100%",
                width: "100%"
            }}
            ref={ref}
        >
            <Table
                style={{
                    height: "100%",
                    maxHeight: "100%",
                    // overflow: "scroll"
                }}
                rowSelection={select}
                scroll={{
                    y: height
                }}
                rowKey={(e: any) => e.name}
                dataSource={data}
                columns={columns}
                pagination={false}
                loading={data.length == 0}
            />
        </div>
    )
}
