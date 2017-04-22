from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("app1.html")


@app.route('/2')
def app2():
    return render_template("app2.html")


@app.route('/api/box_data')
def box_data():
    return jsonify([ "red", "red", "blue", "red" ])


@app.route('/api/projects')
def projects():
    projects = []
    projects.append({"name": "Project A", "start_date": "2017-02-14", "end_date": "2017-05-28", "risk": "green"})
    projects.append({"name": "Project B", "start_date": "2017-03-04", "end_date": "2017-08-10", "risk": "red"})
    projects.append({"name": "Project C", "start_date": "2017-02-28", "end_date": "2017-07-17", "risk": "red"})

    return jsonify(projects)
