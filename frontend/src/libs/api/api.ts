
import Axios from 'axios'
import { TChinaCount, TCountryMap, TCountryIncrMap, TDeadIncr, TDeadIncrBar, StatisticInfo } from './type'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const { apiBase } = publicRuntimeConfig
const URL = {
    countryMap: `${apiBase}/country_map`,
    countryIncr: `${apiBase}/country_incr_map`,
    countryTend: `${apiBase}/country_tend`,
    countryList: `${apiBase}/country_list`,
    chinaCount: `${apiBase}/world_count`,
    deadtrend: `${apiBase}/dead_river_flow`,
    deadtrendbar: `${apiBase}/dead_bar`,
    africaconfirmflow: `${apiBase}/africa_confirm_flow`,
    statisticinfo: `${apiBase}/statistic_info`,
}

export const APIGetCountryMap = () => Axios.get<TCountryMap>(URL.countryMap)
export  const APICountryIncr =  () => Axios.get<TCountryIncrMap>(URL.countryIncr)
export const APIGetCountryTrend = (payload: {
    country_list: string[]
    from: string
    to: string
}) => Axios.post(URL.countryTend, payload)
export const APIGetChinaCount = () => Axios.get<TChinaCount>(URL.chinaCount)
export const APIGetDeadIncrTrend = () => Axios.get<TDeadIncr>(URL.deadtrend)
export const APIGetDeadIncrTrendBar = () => Axios.get<TDeadIncrBar>(URL.deadtrendbar)
export const APIGetDeadIncrTrendAfrica = () => Axios.get<TDeadIncr>(URL.africaconfirmflow)
export const APIGetStatisticInfo = () => Axios.get<StatisticInfo>(URL.statisticinfo)

