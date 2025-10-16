"""flask/website.py - Tech4Taxes website flask route/app file."""
import os
from flask import Flask, render_template

from py.flask_config import DevelopmentConfig, ProductionConfig
import py.devserver_js_processor as devserver_js_processor


def create_app():
    app = Flask(__name__)

    # default to dev
    is_production = os.getenv("FLASK_ENV", "DEV") == "PROD"
    if is_production:
        app.config.from_object('py.flask_config.ProductionConfig')
    else:
        app.config.from_object('py.flask_config.DevelopmentConfig')

    app.context_processor(
        lambda: {
            "get_module_path": devserver_js_processor.module_path_processor,
            "include_module_style": devserver_js_processor.module_style_processor,
        }
    )

    @app.route("/")
    def hello_world():
        return render_template("home.html")


    @app.route("/legagenda")
    def leg_agenda():
        return render_template("legislative_agenda.html")


    @app.route("/demo/d3")
    def demo_d3():
        return render_template("demo_d3.html")

    @app.route("/demo/plotly")
    def demo_plotly():
        return render_template("demo_plotly.html")

    @app.route("/demo/bno")
    def demo_bno():
        return render_template("demo_bno.html")

    return app


app = create_app()
