
from re import I
from flask import Flask, session
from flask_cors import CORS
import os
import sys
import Whatsapp
import json
app = Flask(__name__)
app.config["SECRET_KEY"] = os.urandom(24)
CORS(app)
# MES = None
INTERNAL_ERROR = json.dumps(
    {"status": "500", "message": "Internal Server Error"})


def correct_req(data):
    return json.dumps({"status": "200", "message": "OK", "data": data})


@app.route('/')
def hello_world():
    return 'Hello, World!'


def check_file():
    check_path = 'data'
    if os.listdir(check_path) == []:
        print('No file found in data folder')
        return False
    else:
        global MES
        MES = Whatsapp.Whatsapp('data/messages.txt')
        MES.parse_file()

        return True


@app.route('/users', methods=['GET'])
def get_all_users():
    """ get all users """
    if check_file():
        data = MES.get_all_users()
        return correct_req(data)
    else:
        return INTERNAL_ERROR


@app.route('/piechart', methods=['GET'])
def get_piechart_json():
    """ get piechart json """
    if check_file():
        data = MES.send_piechart_json()
        # print(data)
        return correct_req(data)
    else:
        return INTERNAL_ERROR


@app.route('/avg_text_length', methods=['GET'])
def get_avg_text_length():
    """ get avg text length """
    if check_file():
        data = MES.send_avg_text_length_json()
        return correct_req(data)
    else:
        return INTERNAL_ERROR


@app.route('/wordcloud', methods=['GET'])
def get_word_cloud():
    """ get word cloud """
    if check_file():
        data = MES.send_word_cloud_json()
        return correct_req(data)
    else:
        return INTERNAL_ERROR


@app.route('/hourly_text', methods=['GET'])
def get_hourly_text():
    """ get hourly text """
    if check_file():
        data = MES.send_hourly_json()
        return correct_req(data)
    else:
        return INTERNAL_ERROR


@app.route('/timeseries', methods=['GET'])
def get_timeseries_json():
    """ get timeseries json """
    if check_file():
        data = MES.send_timeseries_json()
        return correct_req(data)
    else:
        return INTERNAL_ERROR


@app.route('/daily_text', methods=['GET'])
def get_daily_text():
    """ get daily text """
    if check_file():
        data = MES.send_daily_json()
        return correct_req(data)
    else:
        return INTERNAL_ERROR


@app.route('/lexical_diversity', methods=['GET'])
def get_lexical_diversity_json():
    """ get lexical_diversity json """
    if check_file():
        data = MES.send_lexical_diversity_json()
        return correct_req(data)
    else:
        return INTERNAL_ERROR


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
