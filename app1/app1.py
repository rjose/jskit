from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template("app1.html")


@app.route('/api/box_data')
def box_data():
    return jsonify([ "red", "red", "blue", "red" ])
