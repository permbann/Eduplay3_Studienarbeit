import functools
import sqlite3

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from Eduplay3_Studienarbeit.database_files.user_model import db, User

bp = Blueprint('db_api', __name__, url_prefix='/db_api')


@bp.route('/balance', methods=['GET'])
def get_balance():
    user = _get_current_user()
    return {'currency': user.currency}


@bp.route('/update_jumps', methods=['POST'])
def update_jumps():
    update_value = int(request.form['change'])
    user = _get_current_user()
    user.jumps = max(user.jumps + update_value, 0)
    db.session.commit()
    return f"updated {user.username}s jump count to: {user.jumps}"


@bp.route('/jumps', methods=['GET'])
def get_jumps():
    user = _get_current_user()
    return {'jumps': user.jumps}


@bp.route('/tries', methods=['GET'])
def get_tries():
    user = _get_current_user()
    print(user.tries, type(user.tries))
    return {'tries': float(user.tries)}


@bp.route('/update_tries', methods=['POST'])
def update_tries():
    update_value = float(request.form['change'])
    user = _get_current_user()
    user.tries = max(user.tries + update_value, 0)
    db.session.commit()
    return f"updated {user.username}s jump count to: {user.tries}"


def _get_current_user():
    return User.query.filter_by(id=session['user_id']).first()
