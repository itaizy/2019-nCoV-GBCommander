import datetime
import json
import os

import pymysql
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import cross_origin

app = Flask(__name__)

# MYSQL_HOST = '10.1.1.56'
MYSQL_HOST = 'localhost'
MYSQL_PORT = 3306
MYSQL_USER = 'root'
MYSQL_PASSWORD = "123456"
MYSQL_DB = "ncov"

@app.route('/api/country_map')
@cross_origin()
def country_map():
    results = []
    with pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        passwd=MYSQL_PASSWORD,
        db=MYSQL_DB,
        charset='utf8mb4'
    ) as conn:
        sql = "SELECT `name`, `englishName`, `confirmedCount`, `curedCount`, `deadCount`, `confirmedIncr` FROM ncov_data_jhu t WHERE (SELECT count(1) FROM ncov_data_jhu WHERE `name` = t.`name` AND `date` > t.`date` ) < 1 AND `level` = 'country' ORDER BY `confirmedCount` DESC;"
        conn.execute(sql)
        results = conn.fetchall()
    countries = []
    for result in results:
        countries.append({
            "name": result[0],
            "englishName": result[1],
            "confirmedCount": result[2],
            "confirmedIncr": result[5],
            "curedCount": result[3],
            "deadCount": result[4]
          })
    return jsonify(countries)

@app.route('/api/country_incr_map')
@cross_origin()
def country_incr_map():
    results = []
    with pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        passwd=MYSQL_PASSWORD,
        db=MYSQL_DB,
        charset='utf8mb4'
    ) as conn:
        sql = "SELECT `name`, `englishName`, `confirmedIncr`, `curedIncr`, `deadIncr` FROM ncov_data_jhu t WHERE (SELECT count(1) FROM ncov_data_jhu WHERE `name` = t.`name` AND `date` > t.`date` ) < 1 AND `level` = 'country' ORDER BY `confirmedIncr` DESC;"
        conn.execute(sql)
        results = conn.fetchall()
    countries = []
    for result in results:
        countries.append({
            "name": result[0],
            "englishName": result[1],
            "confirmedIncr": result[2],
            "curedIncr": result[3],
            "deadIncr": result[4]
          })
    return jsonify(countries)

@app.route('/api/country_tend', methods=['POST'])
@cross_origin()
def country_tend():
    results = []
    recevie_data = request.get_json()
    country_list = ['全球']
    countries = {}
    if recevie_data != None:
        if 'country_list' in recevie_data.keys():
            country_list = recevie_data['country_list']
        begin_time = (datetime.datetime.now() - datetime.timedelta(days=7)).strftime("%Y-%m-%d")
        if 'from' in recevie_data.keys():
            begin_time = recevie_data['from']
        end_time = datetime.datetime.now().strftime("%Y-%m-%d")
        if 'to' in recevie_data.keys():
            end_time = recevie_data['to']
        with pymysql.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            passwd=MYSQL_PASSWORD,
            db=MYSQL_DB,
            charset='utf8mb4'
        ) as conn:
            if country_list[0] == "全球":
                sql = "SELECT '全球', 'global', `date`, SUM(`confirmedCount`), SUM(`confirmedIncr`), SUM(`curedCount`), SUM(`curedIncr`), " \
                      "SUM(`deadCount`), SUM(`deadIncr`) FROM	ncov_data_jhu WHERE date >= '{}' AND date <= '{}' GROUP BY date;"
                conn.execute(sql.format(begin_time, end_time))
            else:
                sql = 'SELECT `name`, `englishName`, `date`, `confirmedCount`, `confirmedIncr`, `curedCount`, `curedIncr`, ' \
                      '`deadCount`, `deadIncr` FROM	ncov_data_jhu WHERE	`name` IN ({}) AND date >= "{}" AND date <= "{}";'
                conn.execute(sql.format(",".join(['"' + j + '"' for j in country_list]), begin_time, end_time))
            results = conn.fetchall()
        for result in results:
            if result[0] not in countries.keys():
                countries[result[0]] = {
                    "name": result[0],
                    "englishName": result[1],
                    "dateList": [],
                    "confirmedCount": [],
                    "confirmedIncr": [],
                    "currentConfirmedCount": [],
                    "currentConfirmedIncr": [],
                    "curedCount": [],
                    "curedIncr": [],
                    "deadCount": [],
                    "deadIncr": [],
                }
            countries[result[0]]['dateList'].append(result[2].strftime("%Y-%m-%d"))
            countries[result[0]]['confirmedCount'].append(int(result[3]))
            countries[result[0]]['confirmedIncr'].append(int(result[4]))
            countries[result[0]]['currentConfirmedCount'].append(int(result[3]) - int(result[5]) - int(result[7]))
            countries[result[0]]['currentConfirmedIncr'].append(int(result[4]) - int(result[6]) - int(result[8]))
            countries[result[0]]['curedCount'].append(int(result[5]))
            countries[result[0]]['curedIncr'].append(int(result[6]))
            countries[result[0]]['deadCount'].append(int(result[7]))
            countries[result[0]]['deadIncr'].append(int(result[8]))
    return jsonify(countries)

@app.route('/api/country_list')
@cross_origin()
def country_list():
    countries = []
    with pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        passwd=MYSQL_PASSWORD,
        db=MYSQL_DB,
        charset='utf8mb4'
    ) as conn:
        sql = "SELECT DISTINCT `name`, `englishName`, `countryShortCode` FROM ncov_data_jhu WHERE `level`='country';"
        conn.execute(sql)
        results = conn.fetchall()
    for result in results:
        countries.append({
            "name": result[0],
            "englishName": result[1],
            "countryShortCode": result[2],
        })
    return jsonify(countries)

@app.route('/api/world_count')
@cross_origin()
def world_count():
    china = {}
    with pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        passwd=MYSQL_PASSWORD,
        db=MYSQL_DB,
        charset='utf8mb4'
    ) as conn:
        sql = "SELECT `confirm`, `confirmAdd`, `heal`, `healAdd`, `dead`, `deadAdd` FROM ncov_data_statistic_jhu ORDER BY `date` DESC LIMIT 1;"
        conn.execute(sql)
        results = conn.fetchall()
        sql = "SELECT `suspectedCount`, `suspectedIncr`, `currentConfirmedCount`, `currentConfirmedIncr`, `modifyTime` FROM ncov_data_global ORDER BY `date` DESC LIMIT 1;"
        conn.execute(sql)
        results2 = conn.fetchall()
        sql = "SELECT `nowConfirm`, `nowConfirmAdd` FROM ncov_data_tencent ORDER BY `date` DESC LIMIT 1;"
        conn.execute(sql)
        results3 = conn.fetchall()
    for result in results:
        china["confirmedCount"] = int(result[0])
        china["confirmedIncr"] = int(result[1])
        china["curedCount"] = int(result[2])
        china["curedIncr"] = int(result[3])
        china["deadCount"] = int(result[4])
        china["deadIncr"] = int(result[5])
    for result in results2:
        china['inputTotalConfirmedCount'] = int(result[0])
        china['inputTotalConfirmedIncr'] = int(result[1])
        china['chinaConfirmedCount'] = int(result[2])
        china['chinaConfirmedIncr'] = int(result[3])
        china['modifyTime'] = datetime.datetime.fromtimestamp(int(result[4]) / 1000).isoformat()
    for result in results3:
        china["currentConfirmedCount"] = int(result[0])
        china["currentConfirmedIncr"] = int(result[1])
    return jsonify(china)

@app.route('/api/dead_river_flow')
@cross_origin()
def dead_river_flow():
    country_dict = {
        "中国": ['中国'],
        "亚洲其他": ['阿富汗', '阿拉伯联合酋长国', '阿曼', '阿塞拜疆', '巴基斯坦', '巴林岛', '不丹', '东帝汶', '菲律宾', '哈萨克斯坦',
                 '韩国', '吉尔吉斯斯坦', '柬埔寨', '卡塔尔', '科威特', '老挝', '黎巴嫩', '马尔代夫', '马来西亚', '蒙古', '孟加拉国',
                 '缅甸', '尼泊尔', '日本', '沙特阿拉伯', '斯里兰卡', '泰国', '土耳其', '文莱', '亚美尼亚', '乌兹别克斯坦',
                 '新加坡', '叙利亚共和国', '伊拉克', '伊朗', '以色列', '印度', '印度尼西亚', '约旦', '越南'],
        "西班牙": ['西班牙'],
        "意大利": ['意大利'],
        "欧洲其他": ['白俄罗斯', '波兰', '乌克兰', '保加利亚', '丹麦', '斯洛伐克', '德国', '爱尔兰', '圣马力诺', '法国', '匈牙利',
                 '克罗地亚', '希腊', '立陶宛', '拉脱维亚', '瑞士', '罗马尼亚', '英国', '卢森堡公国', '摩尔多瓦', '瑞典', '摩纳哥',
                 '挪威', '马耳他', '斯洛文尼亚', '捷克', '北马其顿共和国', '阿尔巴尼亚', '芬兰', '安道尔共和国', '荷兰', '葡萄牙',
                 '波斯尼亚和黑塞哥维那', '俄罗斯', '比利时', '奥地利', '爱沙尼亚', '冰岛'],
        "美国": ['美国'],
        "北美洲其他": ['加拿大', '墨西哥', '危地马拉', '伯利兹城', '萨尔瓦多', '洪都拉斯', '巴拿马', '巴哈马群岛', '古巴', '牙买加',
                  '海地', '多米尼加共和国', '哥斯达黎加', '圣基茨和尼维斯', '安提瓜和巴布达', '圣卢西亚岛', '圣文森特和格林纳丁斯',
                  '巴巴多斯', '格林纳达', '特立尼达和多巴哥', '尼加拉瓜'],
        "中东": ['巴林岛', '埃及', '伊朗', '伊拉克', '以色列', '约旦', '科威特', '黎巴嫩', '阿曼', '卡塔尔', '沙特阿拉伯',
               '叙利亚共和国', '阿拉伯联合酋长国'],
        "非洲": ['埃及', '利比亚', '苏丹', '突尼斯', '阿尔及利亚', '摩洛哥', '埃塞俄比亚', '厄立特里亚国', '索马里', '吉布提',
               '肯尼亚', '坦桑尼亚', '乌干达', '卢旺达', '布隆迪', '塞舌尔', '乍得', '中非共和国', '喀麦隆', '赤道几内亚',
               '加蓬', '刚果(布)', '刚果(金)', '圣多美与普林希比共和国', '毛里塔尼亚', '西撒哈拉', '塞内加尔', '冈比亚',
               '马里', '布基纳法索', '几内亚', '几内亚比绍', '佛得角', '塞拉利昂', '利比里亚', '科特迪瓦', '加纳', '多哥',
               '贝宁', '尼日尔', '赞比亚', '安哥拉', '津巴布韦', '马拉维', '莫桑比克', '博茨瓦纳', '纳米比亚', '南非',
               '斯威士兰', '马达加斯加岛', '毛里求斯'],
        "南美洲": ['哥伦比亚', '委内瑞拉', '圭亚那', '苏里南', '厄瓜多尔', '秘鲁', '巴西', '玻利维亚', '智利', '巴拉圭', '乌拉圭', '阿根廷'],
        "大洋洲": ['澳大利亚', '新西兰', '巴布亚新几内亚', '斐济'],
    }
    river_flow = {
        "data": [],
        "legend": [i for i in country_dict.keys()]
    }
    with pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        passwd=MYSQL_PASSWORD,
        db=MYSQL_DB,
        charset='utf8mb4'
    ) as conn:
        for part in country_dict:
            sql = "SELECT `date`, SUM(`deadIncr`) FROM ncov_data_jhu WHERE `name` IN (" + ",".join(["'" + j + "'" for j in country_dict[part]]) + ") AND date >= '2020-03-01' GROUP BY `date`;"
            conn.execute(sql)
            results = conn.fetchall()
            for result in results:
                river_flow['data'].append([result[0].strftime("%Y-%m-%d"), int(result[1]), part])
    return jsonify(river_flow)

@app.route('/api/dead_bar')
@cross_origin()
def dead_bar():
    country_dict = {
        "中国": ['中国'],
        "亚洲其他": ['阿富汗', '阿拉伯联合酋长国', '阿曼', '阿塞拜疆', '巴基斯坦', '巴林岛', '不丹', '东帝汶', '菲律宾', '哈萨克斯坦',
                 '韩国', '吉尔吉斯斯坦', '柬埔寨', '卡塔尔', '科威特', '老挝', '黎巴嫩', '马尔代夫', '马来西亚', '蒙古', '孟加拉国',
                 '缅甸', '尼泊尔', '日本', '沙特阿拉伯', '斯里兰卡', '泰国', '土耳其', '文莱', '亚美尼亚', '乌兹别克斯坦',
                 '新加坡', '叙利亚共和国', '伊拉克', '伊朗', '以色列', '印度', '印度尼西亚', '约旦', '越南'],
        "西班牙": ['西班牙'],
        "意大利": ['意大利'],
        "欧洲其他": ['白俄罗斯', '波兰', '乌克兰', '保加利亚', '丹麦', '斯洛伐克', '德国', '爱尔兰', '圣马力诺', '法国', '匈牙利',
                 '克罗地亚', '希腊', '立陶宛', '拉脱维亚', '瑞士', '罗马尼亚', '英国', '卢森堡公国', '摩尔多瓦', '瑞典', '摩纳哥',
                 '挪威', '马耳他', '斯洛文尼亚', '捷克', '北马其顿共和国', '阿尔巴尼亚', '芬兰', '安道尔共和国', '荷兰', '葡萄牙',
                 '波斯尼亚和黑塞哥维那', '俄罗斯', '比利时', '奥地利', '爱沙尼亚', '冰岛'],
        "美国": ['美国'],
        "北美洲其他": ['加拿大', '墨西哥', '危地马拉', '伯利兹城', '萨尔瓦多', '洪都拉斯', '巴拿马', '巴哈马群岛', '古巴', '牙买加',
                  '海地', '多米尼加共和国', '哥斯达黎加', '圣基茨和尼维斯', '安提瓜和巴布达', '圣卢西亚岛', '圣文森特和格林纳丁斯',
                  '巴巴多斯', '格林纳达', '特立尼达和多巴哥', '尼加拉瓜'],
        "中东": ['巴林岛', '埃及', '伊朗', '伊拉克', '以色列', '约旦', '科威特', '黎巴嫩', '阿曼', '卡塔尔', '沙特阿拉伯',
               '叙利亚共和国', '阿拉伯联合酋长国'],
        "非洲": ['埃及', '利比亚', '苏丹', '突尼斯', '阿尔及利亚', '摩洛哥', '埃塞俄比亚', '厄立特里亚国', '索马里', '吉布提',
               '肯尼亚', '坦桑尼亚', '乌干达', '卢旺达', '布隆迪', '塞舌尔', '乍得', '中非共和国', '喀麦隆', '赤道几内亚',
               '加蓬', '刚果(布)', '刚果(金)', '圣多美与普林希比共和国', '毛里塔尼亚', '西撒哈拉', '塞内加尔', '冈比亚',
               '马里', '布基纳法索', '几内亚', '几内亚比绍', '佛得角', '塞拉利昂', '利比里亚', '科特迪瓦', '加纳', '多哥',
               '贝宁', '尼日尔', '赞比亚', '安哥拉', '津巴布韦', '马拉维', '莫桑比克', '博茨瓦纳', '纳米比亚', '南非',
               '斯威士兰', '马达加斯加岛', '毛里求斯'],
        "南美洲": ['哥伦比亚', '委内瑞拉', '圭亚那', '苏里南', '厄瓜多尔', '秘鲁', '巴西', '玻利维亚', '智利', '巴拉圭', '乌拉圭', '阿根廷'],
        "大洋洲": ['澳大利亚', '新西兰', '巴布亚新几内亚', '斐济'],
    }
    bar = {}
    result_dict = {}
    with pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        passwd=MYSQL_PASSWORD,
        db=MYSQL_DB,
        charset='utf8mb4'
    ) as conn:
        for part in country_dict:
            sql = "SELECT `date`, SUM(`deadIncr`) FROM ncov_data_jhu WHERE `name` IN (" + ",".join(["'" + j + "'" for j in country_dict[part]]) + ") AND date >= '2020-03-01' GROUP BY `date`;"
            conn.execute(sql)
            results = conn.fetchall()
            for result in results:
                if result[0].strftime("%Y-%m-%d") not in result_dict.keys():
                    result_dict[result[0].strftime("%Y-%m-%d")] = {}
                result_dict[result[0].strftime("%Y-%m-%d")][part] = int(result[1])
                if "total" not in result_dict[result[0].strftime("%Y-%m-%d")].keys():
                    result_dict[result[0].strftime("%Y-%m-%d")]['total'] = int(result[1])
                else:
                    result_dict[result[0].strftime("%Y-%m-%d")]['total'] += int(result[1])
        for part in country_dict:
            bar[part] = {
                'dateList': [],
                'deadIncrPercent' : []
            }
        for date in result_dict:
            for part in country_dict:
                bar[part]['dateList'].append(date)
                bar[part]['deadIncrPercent'].append(round(result_dict[date][part] * 100/ result_dict[date]['total'], 2))
    return jsonify(bar)

@app.route('/api/africa_confirm_flow')
@cross_origin()
def africa_confirm_flow():
    country_dict = {
        "非洲": ['埃及', '利比亚', '苏丹', '突尼斯', '阿尔及利亚', '摩洛哥', '埃塞俄比亚', '厄立特里亚国', '索马里', '吉布提',
               '肯尼亚', '坦桑尼亚', '乌干达', '卢旺达', '布隆迪', '塞舌尔', '乍得', '中非共和国', '喀麦隆', '赤道几内亚',
               '加蓬', '刚果(布)', '刚果(金)', '圣多美与普林希比共和国', '毛里塔尼亚', '西撒哈拉', '塞内加尔', '冈比亚',
               '马里', '布基纳法索', '几内亚', '几内亚比绍', '佛得角', '塞拉利昂', '利比里亚', '科特迪瓦', '加纳', '多哥',
               '贝宁', '尼日尔', '赞比亚', '安哥拉', '津巴布韦', '马拉维', '莫桑比克', '博茨瓦纳', '纳米比亚', '南非',
               '斯威士兰', '马达加斯加岛', '毛里求斯'],
    }
    river_flow = {
        "data": [],
        "legend": [i for i in country_dict['非洲']]
    }
    with pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        passwd=MYSQL_PASSWORD,
        db=MYSQL_DB,
        charset='utf8mb4'
    ) as conn:
        for part in country_dict:
            sql = "SELECT `name`, `date`, SUM(`confirmedIncr`) FROM ncov_data_jhu WHERE `name` IN (" + ",".join(["'" + j + "'" for j in country_dict[part]]) + ") AND date >= '2020-03-01' GROUP BY `date`, `name`;"
            conn.execute(sql)
            results = conn.fetchall()
            for result in results:
                river_flow['data'].append([result[1].strftime("%Y-%m-%d"), int(result[2]), result[0]])
    return jsonify(river_flow)

@app.route('/api/statistic/')
@cross_origin()
def statistic():
    name = request.args.get('name')
    return send_from_directory(os.path.join(os.path.dirname(os.path.abspath(__file__)), "statistic"), '{}.xlsx'.format(name), as_attachment=True)

@app.route('/api/statistic_info')
@cross_origin()
def statistic_info():
    statistic_info = []
    with pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        passwd=MYSQL_PASSWORD,
        db=MYSQL_DB,
        charset='utf8mb4'
    ) as conn:
        sql = "SELECT `title`, `countries`, `link`, `updateTime` FROM statistic_info;"
        conn.execute(sql)
        results = conn.fetchall()
        topic_info = []
        for result in results:
            if len(json.loads(result[1])) > 1:
                topic_info.append({
                    'title': result[0],
                    'countries': json.loads(result[1]),
                    'link': result[2],
                    'updateTime': result[3].strftime("%Y-%m-%d %H:%M:%S"),
                })
            else:
                statistic_info.append({
                    'title': result[0],
                    'countries': json.loads(result[1]),
                    'link': result[2],
                    'updateTime': result[3].strftime("%Y-%m-%d %H:%M:%S"),
                })
        topic_info.extend(statistic_info)
    return jsonify(topic_info)

if __name__ == '__main__':
    app.run()