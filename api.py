import functools
import sqlite3

from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from MathEngine import MathGenerator
from Eduplay3_Studienarbeit.database_files.db_models import db, User
from Eduplay3_Studienarbeit.database_files.db_schemas import user_schema, users_schema, UserSchema

mg = MathGenerator()
bp = Blueprint('api', __name__, url_prefix='/api')


@bp.route("/get_math", methods=['GET'])
def items():
    return mg.get_term(int(request.args.get('difficulty')))


@bp.route('/balance', methods=['GET'])
def get_balance():
    user = _get_current_user()
    schema = UserSchema(only=['currency'])
    return schema.jsonify(user)


@bp.route('/update_jumps', methods=['PUT'])
def update_jumps():
    update_value = int(request.form['change'])
    user = _get_current_user()
    user.jumps = max(user.jumps + update_value, 0)
    db.session.commit()
    return user_schema.jsonify(user)


@bp.route('/jumps', methods=['GET'])
def get_jumps():
    user = _get_current_user()
    return {'jumps': user.jumps}


@bp.route('/tries', methods=['GET'])
def get_tries():
    user = _get_current_user()
    return {'tries': float(user.tries)}


@bp.route('/update_tries', methods=['PUT'])
def update_tries():
    update_value = float(request.form['change'])
    user = _get_current_user()
    user.tries = max(user.tries + update_value, 0)
    db.session.commit()
    return user_schema.jsonify(user)


def _get_current_user():
    return User.query.filter_by(id=session['user_id']).first()
