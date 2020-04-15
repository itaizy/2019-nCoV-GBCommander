import React, { useRef, useState, useEffect } from 'react'
import { Table, Button } from 'antd'
import { TCountryMap, StatisticInfo } from '../libs/api/type'
import { DownloadOutlined } from '@ant-design/icons';
import styled from 'styled-components'
import { TableRowSelection, ColumnsType } from 'antd/lib/table/interface'

const columns: ColumnsType<StatisticInfo[0]> = [
    { dataIndex: "title", title: "名称", key: "title", align: 'center'},
    {
        dataIndex: "link", title: "下载", key: "link", align: 'center', 
        render: (text, record) => (
            <span>
              <Button type="primary" icon={<DownloadOutlined />} href={'http://ring.act.buaa.edu.cn/commander' + record.link}>
                下载
              </Button>
            </span>
          ),
    },
    {
        dataIndex: "updateTime", title: "更新时间", key: "updateTime", align: 'center', 
    },
]

export default function DDataTable({ data, select }:
    { data: StatisticInfo, select?: TableRowSelection<StatisticInfo[0]> }) {
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
                width: "100%",
                textAlign: "center"
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
                rowKey={(e: any) => e.title}
                dataSource={data}
                columns={columns}
                pagination={false}
                loading={data.length == 0}
                bordered={true}
                size='middle' 
            />
        </div>
    )
}
