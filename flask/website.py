"""flask/website.py - Tech4Taxes website flask route/app file."""
from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def hello_world():
    return render_template("home.html")


@app.route("/legagenda")
def leg_agenda():
    return render_template("legislative_agenda.html")


@app.route("/demo")
def datavis_demo():
    return render_template("datavis_demo.html")
