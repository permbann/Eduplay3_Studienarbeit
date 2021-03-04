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
import pathlib
from flask import Blueprint, request, session
from MathEngine import MathGenerator
# import E3LevelGenerator as level_generator
from E3LevelGenerator import LevelGenerator
from Eduplay3_Studienarbeit.database_files.db_models import db, User
from Eduplay3_Studienarbeit.database_files.db_schemas import user_schema, UserSchema

mg = MathGenerator()
bp = Blueprint('api', __name__, url_prefix='/api')


@bp.route("/get_math", methods=['GET'])
def items():
    return mg.get_term(int(request.args.get('difficulty')))


@bp.route("/difficulty")
def get_difficulty():
    user = _get_current_user()
    schema = UserSchema(only=['active_difficulty'])
    return schema.jsonify(user)


@bp.route('/balance', methods=['GET'])
def get_balance():
    user = _get_current_user()
    schema = UserSchema(only=['currency'])
    return schema.jsonify(user)


@bp.route('/jumps', methods=['GET'])
def get_jumps():
    user = _get_current_user()
    return {'jumps': user.jumps}


@bp.route('/tries', methods=['GET'])
def get_tries():
    user = _get_current_user()
    return {'tries': float(user.tries)}


@bp.route('/update_difficulty', methods=['PATCH'])
def update_difficulty():
    update_value = int(request.form['change'])
    user = _get_current_user()
    user.jumps = max(user.active_difficulty + update_value, 0)
    db.session.commit()
    return user_schema.jsonify(user)


@bp.route('/update_jumps', methods=['PATCH'])
def update_jumps():
    update_value = int(request.form['change'])
    user = _get_current_user()
    user.jumps = max(user.jumps + update_value, 0)
    db.session.commit()
    return user_schema.jsonify(user)


@bp.route('/update_tries', methods=['PATCH'])
def update_tries():
    update_value = float(request.form['change'])
    user = _get_current_user()
    user.tries = max(user.tries + update_value, 0)
    db.session.commit()
    return user_schema.jsonify(user)


@bp.route('/level/<level>')
def get_level(level):
    levels_path = os.path.join(pathlib.Path(__file__).parent.absolute(), 'static/assets/game/levels')
    level = open(f"{levels_path}/{level}.json", "r").read()
    return level


@bp.route('/genlevel')
def get_level_gen():
    generator = LevelGenerator(10, 40)
    return generator.generate_level()


def _get_current_user():
    return User.query.filter_by(id=session['user_id']).first()


