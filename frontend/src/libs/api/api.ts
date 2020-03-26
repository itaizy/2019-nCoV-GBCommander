
import Axios from 'axios'
import { TChinaCount, TCountryMap } from './type'
const base = "http://ring.act.buaa.edu.cn/commander/api"
const URL = {
    countryMap: `${base}/country_map`,
    countryTend: `${base}/country_tend`,
    countryList: `${base}/country_list`,
    chinaCount: `${base}/world_count`,
}

export const APIGetCountryMap = () => Axios.get<TCountryMap>(URL.countryMap)
export const APIGetCountryTrend = (payload: {
    country_list: string[]
    from: string
    to: string
}) => Axios.post(URL.countryTend, payload)
export const APIGetChinaCount = () => Axios.get<TChinaCount>(URL.chinaCount)
