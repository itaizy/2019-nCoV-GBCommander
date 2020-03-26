import datetime

import pymysql
from flask import Flask, jsonify, request
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
        sql = "SELECT `name`, `englishName`, `confirmedCount`, `curedCount`, `deadCount` FROM ncov_data t WHERE (SELECT count(1) FROM ncov_data WHERE `name` = t.`name` AND `date` > t.`date` ) < 1 AND `level` = 'country' ORDER BY `confirmedCount` DESC;"
        conn.execute(sql)
        results = conn.fetchall()
    countries = []
    for result in results:
        countries.append({
            "name": result[0],
            "englishName": result[1],
            "confirmedCount": result[2],
            "curedCount": result[3],
            "deadCount": result[4]
          })
    return jsonify(countries)

@app.route('/api/country_tend', methods=['POST'])
@cross_origin()
def country_tend():
    results = []
    recevie_data = request.get_json()
    country_list = ['中国']
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
            sql = 'SELECT `name`, `englishName`, `date`, `confirmedCount`, `confirmedIncr`, `curedCount`, `curedIncr`, `deadCount`, `deadIncr` FROM	ncov_data WHERE	`name` IN ({}) AND date >= "{}" AND date <= "{}";'
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
                    "curedCount": [],
                    "curedIncr": [],
                    "deadCount": [],
                    "deadIncr": [],
                }
            countries[result[0]]['dateList'].append(result[2].strftime("%Y-%m-%d"))
            countries[result[0]]['confirmedCount'].append(result[3])
            countries[result[0]]['confirmedIncr'].append(result[4])
            countries[result[0]]['curedCount'].append(result[5])
            countries[result[0]]['curedIncr'].append(result[6])
            countries[result[0]]['deadCount'].append(result[7])
            countries[result[0]]['deadIncr'].append(result[8])
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
        sql = "SELECT DISTINCT `name`, `englishName`, `countryShortCode` FROM ncov_data WHERE `level`='country';"
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
        sql = "SELECT `nowConfirm`, `nowConfirmAdd`, `confirm`, `confirmAdd`, `heal`, `healAdd`, `dead`, `deadAdd` FROM ncov_data_tencent ORDER BY `date` DESC LIMIT 1;"
        conn.execute(sql)
        results = conn.fetchall()
        sql = "SELECT `suspectedCount`, `suspectedIncr`, `currentConfirmedCount`, `currentConfirmedIncr` FROM ncov_data_global ORDER BY `date` DESC LIMIT 1;"
        conn.execute(sql)
        results2 = conn.fetchall()
    for result in results:
        china["confirmedCount"] = int(result[2])
        china["confirmedIncr"] = int(result[3])
        china["curedCount"] = int(result[4])
        china["curedIncr"] = int(result[5])
        china["deadCount"] = int(result[6])
        china["deadIncr"] = int(result[7])
        china["currentConfirmedCount"] = int(result[0])
        china["currentConfirmedIncr"] = int(result[1])
    for result in results2:
        china['inputTotalConfirmedCount'] = int(result[0])
        china['inputTotalConfirmedIncr'] = int(result[1])
        china['chinaConfirmedCount'] = int(result[2])
        china['chinaConfirmedIncr'] = int(result[3])
    return jsonify(china)

if __name__ == '__main__':
    app.run()