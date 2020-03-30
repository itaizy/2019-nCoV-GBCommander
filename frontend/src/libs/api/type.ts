interface tcountrydata {
    confirmedIncr:number;
    confirmedCount: number;
    curedCount: number;
    deadCount: number;
    englishName: string;
    name: string;
}

export type TCountryMap = Array<tcountrydata>
// Generated by https://quicktype.io

export interface TChinaCount {
    currentConfirmedCount: number;
    currentConfirmedIncr: number;
    confirmedCount: number;
    confirmedIncr: number;
    curedCount: number;
    curedIncr: number;
    deadCount: number;
    deadIncr: number;
    chinaConfirmedCount: number;
    chinaConfirmedIncr: number;
    inputConfirmedCount: number;
    inputConfirmedIncr: number;
    inputTotalConfirmedCount: number;
    inputTotalConfirmedIncr: number;
    englishName: string;
    name: string;
    modifyTime: string;
}

// Generated by https://quicktype.io

export interface TCountryTrend {
    [key: string]: trendobject

}

export interface trendobject {
    confirmedCount: number[];
    confirmedIncr: number[];
    curedCount: number[];
    curedIncr: number[];
    dateList: string[];
    deadCount: number[];
    deadIncr: number[];
    englishName: string;
    name: string;
}


// Generated by https://quicktype.io

export type TCountryIncrMap = Array<{
    confirmedIncr: number;
    curedIncr: number;
    deadIncr: number;
    englishName: string;
    name: string;
}>
