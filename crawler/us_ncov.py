import requests
import pymysql
import datetime
import traceback


def get_number(state, key):
    if key in state.keys():
        return state[key] if state[key] else 0
    else:
        return 0

MYSQL_HOST = '10.1.1.56'
# MYSQL_HOST = 'localhost'
MYSQL_PORT = 3306
MYSQL_USER = 'root'
MYSQL_PASSWORD = "123456"
MYSQL_DB = "ncov"
base_sql = "REPLACE INTO `ncov`.`us_test_result`(`state`,`positive`,`positiveScore`,`negative`,`negativeScore`," \
           "`negativeRegularScore`,`commercialScore`,`grade`,`score`,`total`,`pending`,`hospitalized`,`death`," \
           "`totalTestResults`,`dateChecked`,`dateModified`,`notes`,`hash`) " \
           "VALUES ('{}',{},{},{},{},{},{},'{}',{},{},{},{},{},{},'{}','{}','{}','{}')"
result = requests.get("https://covidtracking.com/api/states").json()
with pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        passwd=MYSQL_PASSWORD,
        db=MYSQL_DB,
        charset='utf8mb4'
) as conn:
    for state in result:
        try:
            modifiedDate = datetime.datetime.strptime(state['dateModified'], "%Y-%m-%dT%H:%M:%SZ")
            testDate = datetime.datetime.strptime(state['dateChecked'], "%Y-%m-%dT%H:%M:%SZ")
            grade = state['grade'] if 'grade' in state.keys() else ""
            SQL = base_sql.format(state['state'], get_number(state, 'positive'), get_number(state, 'positiveScore'),
                                  get_number(state, 'negative'), get_number(state, 'negativeScore'),
                                  get_number(state, 'negativeRegularScore'), get_number(state, 'commercialScore'),
                                  grade, get_number(state, 'score'), get_number(state, 'total'),
                                  get_number(state, 'pending'), get_number(state, 'hospitalized'), get_number(state, 'death'),
                                  get_number(state, 'totalTestResults'), testDate.strftime("%Y-%m-%d"), modifiedDate.strftime("%Y-%m-%d"),
                                  state['notes'], state['hash'])
            conn.execute(SQL)
        except Exception as e:
            traceback.print_exc()