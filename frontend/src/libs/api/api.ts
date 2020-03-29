
import Axios from 'axios'
import { TChinaCount, TCountryMap } from './type'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const { apiBase } = publicRuntimeConfig
const URL = {
    countryMap: `${apiBase}/country_map`,
    countryIncr: `${apiBase}/country_incr`,
    countryTend: `${apiBase}/country_tend`,
    countryList: `${apiBase}/country_list`,
    chinaCount: `${apiBase}/world_count`,
}

export const APIGetCountryMap = () => Axios.get<TCountryMap>(URL.countryMap)
export  const APICountryIncr =  () => Axios.get<TCountryMap>(URL.countryIncr)
export const APIGetCountryTrend = (payload: {
    country_list: string[]
    from: string
    to: string
}) => Axios.post(URL.countryTend, payload)
export const APIGetChinaCount = () => Axios.get<TChinaCount>(URL.chinaCount)

