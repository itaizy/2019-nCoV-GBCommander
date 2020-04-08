import csv
import re

import bs4
import requests
import os
import datetime

import pymysql


var = os.system('cd ./COVID-19 && git pull')
con = pymysql.connect(
    # host='10.1.1.56',
    host='localhost',
    port=3306,
    user='root',
    password='123456',
    db='ncov',
    charset='utf8mb4'
)
cur = con.cursor()

def word_format(word):
    word=re.sub(r"（.+）", "", word.strip().replace('\n','').replace('n.','').replace(" ",''))
    return word

def translate(word):
    url = "http://dict.youdao.com/w/%s/#keyfrom=dict.index" % (word)
    res = requests.get(url)
    soup = bs4.BeautifulSoup(res.text, "lxml")
    elems = soup.select('.trans-container')
    translation = elems[0].text
    translation1 = word_format(translation)
    # 分割解释的意思
    wordTranslation_list = translation1.split("；")
    # 索取第一个翻译意思
    translation2 = wordTranslation_list[0]
    return translation2

def read_daily_count(file_path):
    with open(file_path, "r",encoding='utf-8') as fp:
        reader = csv.reader(fp)
        row_name = next(reader)
        print(row_name)

country_name_dict_p = {'China':'中国', 'US':'美国','Iran': '伊朗','Italy': '意大利','Germany': '德国','Korea, South': '韩国',
                        'Spain': '西班牙','France': '法国','Denmark': '丹麦','Norway': '挪威', 'Netherlands': '荷兰',
                        'United Kingdom': '英国', 'Switzerland': '瑞士', 'Whole world':'全世界', 'Czechia':'捷克', 'Canada':'加拿大',
                        'Portugal':'葡萄牙','Malaysia':'马来西亚','Japan':'日本', 'Belgium':'比利时', 'Austria':'奥地利', 'Sweden':'瑞典',
                        'Australia':'澳大利亚','Brazil':'巴西','Thailand':'泰国', 'Turkey':'土耳其','Israel':'以色列', 'Georgia': '格鲁吉亚',
                        'Other countries and regions':'境外', 'Slovenia':'斯洛文尼亚','Ireland':'爱尔兰','Chile':'智利',
                        'Romania':'罗马尼亚', 'Poland':'波兰','Luxembourg':'卢森堡','Ecuador':'厄瓜多尔', 'Russia':'俄罗斯', 'India':'印度',
                        'Philippines':'菲律宾', 'Pakistan':'巴基斯坦', 'Dominican Republic':'多明尼加', 'Kazakhstan':'哈萨克斯坦',
                        'North Macedonia':'北马其顿','West Bank and Gaza':'约旦河西岸', 'Congo (Kinshasa)':'刚果(金)', 'Taiwan*':'台湾',
                        'Burma':'缅甸','Cote d\'Ivoire':'科特迪瓦','Congo (Brazzaville)':'刚果(布)', 'Holy See':'梵蒂冈', 'Saint Kitts and Nevis':'圣基茨和尼维斯',
                        'Cabo Verde':'佛得角','Diamond Princess':'钻石公主号邮轮', 'Eswatini':'斯威士兰','Kosovo':'科索沃','MS Zaandam':'尚丹号邮轮',
                       'Afghanistan': '阿富汗', 'Albania': '阿尔巴尼亚', 'Algeria': '阿尔及利亚', 'Andorra': '安道尔共和国', 'Angola': '安哥拉',
                       'Antigua and Barbuda': '安提瓜和巴布达', 'Argentina': '阿根廷', 'Armenia': '亚美尼亚', 'Australia': '澳大利亚',
                       'Austria': '奥地利', 'Azerbaijan': '阿塞拜疆', 'Bahamas': '巴哈马群岛', 'Bahrain': '巴林岛', 'Bangladesh': '孟加拉国',
                       'Barbados': '巴巴多斯', 'Belarus': '白罗斯', 'Belgium': '比利时', 'Benin': '贝宁', 'Bhutan': '不丹', 'Bolivia': '玻利维亚',
                       'Bosnia and Herzegovina': '波斯尼亚和黑塞哥维那', 'Brazil': '巴西', 'Brunei': '文莱', 'Bulgaria': '保加利亚',
                       'Burkina Faso': '布基纳法索', 'Cabo Verde': '佛得角', 'Cambodia': '柬埔寨', 'Cameroon': '喀麦隆', 'Canada': '加拿大',
                       'Central African Republic': '中非共和国', 'Chad': '乍得', 'Chile': '智利', 'China': '中国', 'Colombia': '哥伦比亚',
                       'Costa Rica': '哥斯达黎加', "Cote d'Ivoire": '科特迪瓦', 'Croatia': '克罗地亚', 'Diamond Princess': '钻石公主号',
                       'Cuba': '古巴', 'Cyprus': '塞浦路斯', 'Czechia': '捷克', 'Denmark': '丹麦', 'Djibouti': '吉布提', 'Dominican Republic': '多米尼加共和国',
                       'Ecuador': '厄瓜多尔', 'Egypt': '埃及', 'El Salvador': '萨尔瓦多', 'Equatorial Guinea': '赤道几内亚', 'Eritrea': '厄立特里亚国', 'Estonia': '爱沙尼亚',
                       'Eswatini': '斯威士兰', 'Ethiopia': '埃塞俄比亚', 'Fiji': '斐济', 'Finland': '芬兰', 'France': '法国', 'Gabon': '加蓬', 'Gambia': '冈比亚',
                       'Georgia': '佐治亚', 'Germany': '德国', 'Ghana': '加纳', 'Greece': '希腊', 'Guatemala': '危地马拉', 'Guinea': '几内亚', 'Guyana': '圭亚那',
                       'Haiti': '海地', 'Holy See': '圣座', 'Honduras': '洪都拉斯', 'Hungary': '匈牙利', 'Iceland': '冰岛', 'India': '印度', 'Indonesia': '印度尼西亚',
                       'Iran': '伊朗', 'Iraq': '伊拉克', 'Ireland': '爱尔兰', 'Israel': '以色列', 'Italy': '意大利', 'Jamaica': '牙买加', 'Japan': '日本', 'Jordan': '约旦',
                       'Kazakhstan': '哈萨克斯坦', 'Kenya': '肯尼亚', 'Korea, South': '韩国。', 'Kuwait': '科威特',
                       'Kyrgyzstan': '吉尔吉斯斯坦', 'Latvia': '拉脱维亚', 'Lebanon': '黎巴嫩', 'Liberia': '利比里亚', 'Liechtenstein': '列支敦斯登', 'Lithuania': '立陶宛',
                       'Luxembourg': '卢森堡公国', 'Madagascar': '马达加斯加岛', 'Malaysia': '马来西亚', 'Maldives': '马尔代夫', 'Malta': '马耳他', 'Mauritania': '毛里塔尼亚',
                       'Mauritius': '毛里求斯', 'Mexico': '墨西哥', 'Moldova': '摩尔多瓦', 'Monaco': '摩纳哥', 'Mongolia': '蒙古', 'Montenegro': '黑山共和国',
                       'Morocco': '摩洛哥', 'Namibia': '纳米比亚', 'Nepal': '尼泊尔', 'Netherlands': '荷兰', 'New Zealand': '新西兰', 'Nicaragua': '尼加拉瓜', 'Niger': '尼日尔',
                       'Nigeria': '尼日利亚', 'North Macedonia': '北马其顿共和国', 'Norway': '挪威', 'Oman': '阿曼', 'Pakistan': '巴基斯坦', 'Panama': '巴拿马',
                       'Papua New Guinea': '巴布亚新几内亚', 'Paraguay': '巴拉圭', 'Peru': '秘鲁', 'Philippines': '菲律宾', 'Poland': '波兰', 'Portugal': '葡萄牙', 'Qatar': '卡塔尔',
                       'Romania': '罗马尼亚', 'Russia': '俄罗斯', 'Rwanda': '卢旺达', 'Saint Lucia': '圣卢西亚岛', 'Saint Vincent and the Grenadines': '圣文森特和格林纳丁斯',
                       'San Marino': '圣马力诺', 'Saudi Arabia': '沙特阿拉伯', 'Senegal': '塞内加尔', 'Serbia': '塞尔维亚', 'Seychelles': '塞舌尔', 'Singapore': '新加坡',
                       'Slovakia': '斯洛伐克', 'Slovenia': '斯洛文尼亚', 'Somalia': '索马里', 'South Africa': '南非', 'Spain': '西班牙', 'Sri Lanka': '斯里兰卡', 'Sudan': '苏丹',
                       'Suriname': '苏里南', 'Sweden': '瑞典', 'Switzerland': '瑞士', 'Taiwan*': '台湾', 'Tanzania': '坦桑尼亚', 'Thailand': '泰国', 'Togo': '多哥',
                       'Trinidad and Tobago': '特立尼达和多巴哥', 'Tunisia': '突尼斯', 'Turkey': '土耳其', 'Uganda': '乌干达', 'Ukraine': '乌克兰',
                       'United Arab Emirates': '阿拉伯联合酋长国', 'United Kingdom': '英国', 'Uruguay': '乌拉圭', 'US': '美国', 'Uzbekistan': '乌兹别克斯坦',
                       'Venezuela': '委内瑞拉', 'Vietnam': '越南', 'Zambia': '赞比亚', 'Zimbabwe': '津巴布韦', 'Dominica': '多米尼加岛', 'Grenada': '格林纳达',
                       'Mozambique': '莫桑比克', 'Syria': '叙利亚共和国', 'Timor-Leste': '东帝汶', 'Belize': '伯利兹城', 'Laos': '老挝', 'Libya': '利比亚',
                       'West Bank and Gaza': '约旦河西岸及加沙地带', 'Guinea-Bissau': '几内亚比绍', 'Mali': '马里', 'Saint Kitts and Nevis': '圣基茨和尼维斯',
                       'Kosovo': '科索沃', 'Burma': '缅甸', 'MS Zaandam': '尚丹号', 'Botswana': '博茨瓦纳', 'Burundi': '布隆迪', 'Sierra Leone': '塞拉利昂', 'Malawi': '马拉维',
                       'South Sudan': '南苏丹', 'Western Sahara': '西撒哈拉', 'Sao Tome and Principe': '圣多美与普林希比共和国'}

country_CODE = {
    "Afghanistan": "AFG", "Albania": "ALB", "Algeria": "DZA", "Andorra": "AND", "Angola": "AGO", "Antigua and Barbuda": "ATG", "Argentina": "ARG", "Armenia": "ARM", "Austria": "AUT", "Azerbaijan": "AZE", "Bahamas": "BHS", "Bahrain": "BHR", "Bangladesh": "BGD", "Barbados": "BRB", "Belarus": "BLR", "Belgium": "BEL", "Belize": "BLZ", "Benin": "BEN", "Bhutan": "BTN", "Bolivia": "BOL", "Bosnia and Herzegovina": "BIH", "Botswana": "BWA", "Brazil": "BRA", "Brunei": "BRN", "Bulgaria": "BGR", "Burkina Faso": "BFA", "Burma": "MMR", "Burundi": "BDI", "Cabo Verde": "CPV", "Cambodia": "KHM", "Cameroon": "CMR", "Central African Republic": "CAF", "Chad": "TCD", "Chile": "CHL", "Colombia": "COL", "Congo (Brazzaville)": "COG", "Congo (Kinshasa)": "COD", "Costa Rica": "CRI", "Cote d'Ivoire": "CIV", "Croatia": "HRV", "Cuba": "CUB", "Cyprus": "CYP", "Czechia": "CZE", "Denmark": "DNK", "Djibouti": "DJI", "Dominica": "DMA", "Dominican Republic": "DOM", "Ecuador": "ECU", "Egypt": "EGY", "El Salvador": "SLV", "Equatorial Guinea": "GNQ", "Eritrea": "ERI", "Estonia": "EST", "Eswatini": "SWZ", "Ethiopia": "ETH", "Fiji": "FJI", "Finland": "FIN", "France": "FRA", "Gabon": "GAB", "Gambia": "GMB", "Georgia": "GEO", "Germany": "DEU", "Ghana": "GHA", "Greece": "GRC", "Grenada": "GRD", "Guatemala": "GTM", "Guinea": "GIN", "Guinea-Bissau": "GNB", "Guyana": "GUY", "Haiti": "HTI", "Holy See": "VAT", "Honduras": "HND", "Hungary": "HUN", "Iceland": "ISL", "India": "IND", "Indonesia": "IDN", "Iran": "IRN", "Iraq": "IRQ", "Ireland": "IRL", "Israel": "ISR", "Italy": "ITA", "Jamaica": "JAM", "Japan": "JPN", "Jordan": "JOR", "Kazakhstan": "KAZ", "Kenya": "KEN", "Korea, South": "KOR", "Kosovo": "XKS", "Kuwait": "KWT", "Kyrgyzstan": "KGZ", "Laos": "LAO", "Latvia": "LVA", "Lebanon": "LBN", "Liberia": "LBR", "Libya": "LBY", "Liechtenstein": "LIE", "Lithuania": "LTU", "Luxembourg": "LUX", "Madagascar": "MDG", "Malawi": "MWI", "Malaysia": "MYS", "Maldives": "MDV", "Mali": "MLI", "Malta": "MLT", "Mauritania": "MRT", "Mauritius": "MUS", "Mexico": "MEX", "Moldova": "MDA", "Monaco": "MCO", "Mongolia": "MNG", "Montenegro": "MNE", "Morocco": "MAR", "Mozambique": "MOZ", "Namibia": "NAM", "Nepal": "NPL", "Netherlands": "NLD", "New Zealand": "NZL", "Nicaragua": "NIC", "Niger": "NER", "Nigeria": "NGA", "North Macedonia": "MKD", "Norway": "NOR", "Oman": "OMN", "Pakistan": "PAK", "Panama": "PAN", "Papua New Guinea": "PNG", "Paraguay": "PRY", "Peru": "PER", "Philippines": "PHL", "Poland": "POL", "Portugal": "PRT", "Qatar": "QAT", "Romania": "ROU", "Russia": "RUS", "Rwanda": "RWA", "Saint Kitts and Nevis": "KNA", "Saint Lucia": "LCA", "Saint Vincent and the Grenadines": "VCT", "San Marino": "SMR", "Sao Tome and Principe": "STP", "Saudi Arabia": "SAU", "Senegal": "SEN", "Serbia": "SRB", "Seychelles": "SYC", "Sierra Leone": "SLE", "Singapore": "SGP", "Slovakia": "SVK", "Slovenia": "SVN", "Somalia": "SOM", "South Africa": "ZAF", "South Sudan": "SSD", "Spain": "ESP", "Sri Lanka": "LKA", "Sudan": "SDN", "Suriname": "SUR", "Sweden": "SWE", "Switzerland": "CHE", "Syria": "SYR", "Taiwan*": "TWN", "Tanzania": "TZA", "Thailand": "THA", "Timor-Leste": "TLS", "Togo": "TGO", "Trinidad and Tobago": "TTO", "Tunisia": "TUN", "Turkey": "TUR", "Uganda": "UGA", "Ukraine": "UKR", "United Arab Emirates": "ARE", "United Kingdom": "GBR", "Uruguay": "URY", "Uzbekistan": "UZB", "Venezuela": "VEN", "Vietnam": "VNM", "West Bank and Gaza": "PSE", "Western Sahara": "ESH", "Zambia": "ZMB", "Zimbabwe": "ZWE", "Australia": "AUS", "Canada": "CAN", "China": "CHN", "US": "USA"
}

def read_daily_data(file_path):
    if 'global' not in file_path:
        return
    country_dict = {}
    if "confirmed" in file_path:
        key = "confirmed"
    elif "deaths" in file_path:
        key = "dead"
    elif "recovered" in file_path:
        key = "cured"
    print(key)
    with open(file_path, "r",encoding='utf-8') as fp:
        reader = csv.reader(fp)
        row_name_dict = next(reader)
        for line in reader:
            result_dict = {}
            data = line
            for i in range(len(data)):
                if i == 0:
                    pass
                elif i == 1:
                    result_dict['englishName'] = data[i]
                    if data[i] in country_name_dict_p.keys():
                        result_dict['name'] = country_name_dict_p[data[i]]
                    else:
                        result_dict['name'] = translate(data[i])
                else:
                    if result_dict['name'] in country_dict.keys():
                        if i > 3:
                            dateStr = datetime.datetime.strptime(row_name_dict[i] + "20", "%m/%d/%Y").strftime("%m/%d/%Y")[:-2]
                            country_dict[result_dict['name']][dateStr] += int(data[i])
                    else:
                        if i == 2:
                            result_dict['latitude'] = float(data[i])
                        elif i == 3:
                            result_dict['longitude'] = float(data[i])
                        elif i > 3:
                            dateStr = datetime.datetime.strptime(row_name_dict[i] + "20", "%m/%d/%Y").strftime("%m/%d/%Y")[:-2]
                            result_dict[dateStr] = int(data[i])
            if result_dict['name'] not in country_dict.keys():
                country_dict[result_dict['name']] = result_dict
    for place in country_dict.keys():
        for date in country_dict[place].keys():
            if re.match(r"\d+/\d+/\d+", date):
                dateStamp = datetime.datetime.strptime(date+"20", "%m/%d/%Y").strftime("%Y-%m-%d")
                search_SQL = "SELECT * FROM `ncov_data_jhu` WHERE `name`='{}' AND `date`='{}' "
                cur.execute(search_SQL.format(country_dict[place]['name'], dateStamp))
                result = cur.fetchall()
                lastDate = (datetime.datetime.strptime(date+"20", "%m/%d/%Y") - datetime.timedelta(days=1)).strftime("%m/%d/%Y")[:-2]
                last = country_dict[place][lastDate] if lastDate in country_dict[place].keys() else 0
                if len(result) > 0:
                    SQL = "UPDATE `ncov_data_jhu` SET `{}Count`={}, `{}Incr`={} WHERE `name`='{}' AND `date`='{}'"
                    try:
                        SQL = SQL.format(key, country_dict[place][date], key, country_dict[place][date] - last,
                                         country_dict[place]['name'], dateStamp)
                        cur.execute(SQL)
                        # con.commit()
                    except Exception as e:
                        print(e)
                        print(SQL)
                        con.rollback()
                else:
                    SQL = "REPLACE INTO `ncov_data_jhu`(`name`, `englishName`, `countryShortCode`, `date`, `level`, `country`, `longitude`, `latitude`, `{}Count`, `{}Incr`) " \
                          "VALUES('{}', '{}', '{}', '{}', 'country', '{}', {}, {}, {}, {})"
                    try:
                        SQL = SQL.format(key, key, country_dict[place]['name'], country_dict[place]['englishName'].replace("\'", "''"),
                                         country_CODE[country_dict[place]['englishName']] if country_dict[place]['englishName'] in country_CODE.keys() else "",
                                         dateStamp, country_dict[place]['name'], country_dict[place]['longitude'], country_dict[place]['latitude'], country_dict[place][date], country_dict[place][date] - last)
                        cur.execute(SQL)
                        # con.commit()
                    except Exception as e:
                        print(e)
                        print(SQL)
                        con.rollback()
                last = country_dict[place][date]
    con.commit()

csv_list = []
for i in os.walk('./COVID-19'):
    for j in i[2]:
        if j[-4:] == '.csv':
            csv_list.append([i[0],j])

for subpath, file_name in csv_list:
    csv_path = os.path.join(subpath, file_name)
    if "csse_covid_19_daily_reports" in subpath:
        pass
        # read_daily_count(csv_path)
    elif "csse_covid_19_time_series" in subpath:
        print(csv_path)
        read_daily_data(csv_path)

SQL = "SELECT MAX(`date`), SUM(confirmedCount), SUM(confirmedIncr), SUM(curedCount), SUM(curedIncr), SUM(deadCount), SUM(deadIncr) FROM `ncov_data_jhu` WHERE `date` = (SELECT MAX(`date`) FROM ncov_data_jhu);"
try:
    cur.execute(SQL)
    # con.commit()
except Exception as e:
    print(e)
    print(SQL)
    con.rollback()
results = cur.fetchall()
for result in results:
    replace_SQL = "REPLACE INTO `ncov_data_statistic_jhu`(`name`, `date`, `confirm`, `heal`, `dead`, `confirmAdd`, `healAdd`, `deadAdd`) " \
                  "VALUES('global', '{}', {}, {}, {}, {}, {}, {})".format(result[0], result[1], result[3], result[5], result[2], result[4], result[6])
    cur.execute(replace_SQL)
    con.commit()
con.close()
