import functools
import sqlite3

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from Eduplay3_Studienarbeit.db import get_db

bp = Blueprint('currency', __name__, url_prefix='/currency')


@bp.route('/currency', methods=['GET'])
def get_currency():
    res = get_db().execute(f"SELECT currency FROM user where id = {session['user_id']}").fetchone()
    return dict(zip(res.keys(), res))

#TODO Update currency on post

@bp.route('/dummy', methods=['POST'])
def insert_dummy():

    try:
        db = get_db()
        db.execute(f"INSERT INTO inventory(user_id, item_id) VALUES('{session['user_id']}', '{request.form['itemid']}')")
        db.commit()
    except sqlite3.IntegrityError:
        return "Item already in Inventory."

    # just to test return all items in the inventory of the user
    import json
    res = get_db().execute(f"SELECT user_id, item_id FROM inventory where user_id = {session['user_id']}").fetchall()
    readable = [dict(zip(row.keys(), row)) for row in res]
    return json.dumps(readable)

