# !/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Main Flask file to start the webserver.
"""

__authors__ = ["Luana Juhl", "Lukas Schult"]
__contact__ = "it16156@lehre.dhbw-stuttgart.de"
__credits__ = ["Luana Juhl", "Lukas Schult"]
__date__ = "2021/02/06"
__deprecated__ = False
__email__ = "it16156@lehre.dhbw-stuttgart.de"
__maintainer__ = "developer"
__status__ = "Released"
__version__ = "1.0"

import os

from flask import Flask, render_template, session, flash

from Eduplay3_Studienarbeit.auth import login_required
from Eduplay3_Studienarbeit.database_files.db_models import db, User, Items
from Eduplay3_Studienarbeit.database_files.db_schemas import ma

import sqlalchemy


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_DATABASE_URI='sqlite:///database_files/db.sqlite',
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route("/", methods=['GET'])
    @login_required
    def index():
        return render_template('game.html')

    app.app_context().push()
    db.init_app(app)
    db.drop_all()  # comment out if you want to keep data on restart
    db.create_all()
    ma.init_app(app)

    try:
        from werkzeug.security import generate_password_hash
        admin_user = User("admin", "admin@trash-mail.com", generate_password_hash("admin"), jumps=1000, currency=100,
                          tries=3)
        db.session.add(admin_user)
        db.session.commit()
        init_items()
    except sqlalchemy.exc.IntegrityError:
        print("Admin user already present. Skipping creation...")
        pass

    # Import and register the blueprint from the factory
    from . import auth
    app.register_blueprint(auth.bp)

    from . import api
    app.register_blueprint(api.bp)

    from . import shop
    app.register_blueprint(shop.bp)

    from . import inventory
    app.register_blueprint(inventory.bp)
    return app


def init_items():
    item_list= [('hat_11', 5),
                ('hat_12', 5),
                ('hat_13', 5),
                ('hat_14', 10),
                ('hat_21', 10),
                ('hat_22', 15),
                ('hat_23', 15),
                ('hat_24', 20),
                ('shoe_11', 5),
                ('shoe_12', 5),
                ('shoe_13', 5),
                ('shoe_14', 10),
                ('shoe_21', 10),
                ('shoe_22', 15),
                ('shoe_23', 15),
                ('shoe_24', 20),
                ('shirt_11', 5),
                ('shirt_12', 5),
                ('shirt_13', 5),
                ('shirt_14', 10),
                ('shirt_21', 10),
                ('shirt_22', 15),
                ('shirt_23', 15),
                ('shirt_24', 20),
                ('accessory_11', 5),
                ('accessory_12', 5),
                ('accessory_13', 5),
                ('accessory_14', 10),
                ('accessory_21', 10),
                ('accessory_22', 15),
                ('accessory_23', 15),
                ('accessory_24', 20)]
    for item in item_list:
        db.session.add(Items(item[0], item[1]))
    db.session.commit()
