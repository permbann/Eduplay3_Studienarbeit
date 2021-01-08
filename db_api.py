import functools
import sqlite3

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from Eduplay3_Studienarbeit.db import get_db

bp = Blueprint('db_api', __name__, url_prefix='/db_api')


@bp.route('/balance', methods=['GET'])
def get_balance():
    res = get_db().execute(f"SELECT currency FROM user where id = {session['user_id']}").fetchone()
    return dict(zip(res.keys(), res))


@bp.route('/update_jumps', methods=['POST'])
def update_jumps():
    update_value = int(list(request.form.values())[0])
    db = get_db()
    print(update_value, type(update_value))
    try:
        if update_value < 0:
            if get_tries()['tries'] <= 0:
                db.execute(
                    f"UPDATE user SET jumps = MAX(jumps + {update_value}, 0) WHERE id = {session['user_id']}"
                )
                db.execute(
                    f"UPDATE user SET tries = 3 WHERE id = {session['user_id']}"
                )
                db.commit()
            else:
                db.execute(
                    f"UPDATE user SET tries = tries - 1 WHERE id = {session['user_id']}"
                )
                db.commit()
        else:

            db.execute(
                f"UPDATE user SET jumps = MAX(jumps + {update_value}, 0) WHERE id = {session['user_id']}"
            )
            db.commit()
    except sqlite3.Error as er:
        return er.args
    return "success"


@bp.route('/jumps', methods=['GET'])
def get_jumps():
    res = get_db().execute(f"SELECT jumps FROM user where id = {session['user_id']}").fetchone()
    return dict(zip(res.keys(), res))

@bp.route('/tries', methods=['GET'])
def get_tries():
    res = get_db().execute(f"SELECT tries FROM user where id = {session['user_id']}").fetchone()
    return dict(zip(res.keys(), res))

@bp.route('/update_tries', methods=['POST'])
def update_tries():
    update_value = float(list(request.form.values())[0])
    db = get_db()
    db.execute(
        f"UPDATE user SET tries = MAX(tries + {update_value}, 0) WHERE id = {session['user_id']}"
    )
    db.commit()
    return "Updated tries amount."


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

