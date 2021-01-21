import functools
import sqlite3

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from Eduplay3_Studienarbeit.db import get_db

bp = Blueprint('currency', __name__, url_prefix='/currency')

def update_currency():
    update_value = int(request.form['change'])
    db = get_db()
    try:
        db.execute(f"UPDATE user SET currency = MAX({update_value}, 0) WHERE id = {session['user_id']}")
        db.commit()
    except sqlite3.Error as er:
        return er.args
    return "success"


@bp.route('/get', methods=['GET'])
def get_currency():
    res = get_db().execute(f"SELECT currency FROM user where id = {session['user_id']}").fetchone()
    return dict(zip(res.keys(), res))


@bp.route('/dummy', methods=['POST'])
def insert_dummy():
    item = list(request.form.keys())[0]
    try:
        db = get_db()
        db.execute(f"INSERT INTO inventory(user_id, item_id) VALUES('{session['user_id']}', '{item}')")
        db.commit()
    except sqlite3.IntegrityError:
        return "Item already in Inventory."

    # just to test return all items in the inventory of the user
    import json
    res = get_db().execute(f"SELECT user_id, item_id FROM inventory where user_id = {session['user_id']}").fetchall()
    readable = [dict(zip(row.keys(), row)) for row in res]
    return json.dumps(readable)

