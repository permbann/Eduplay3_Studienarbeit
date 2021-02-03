import functools
import sqlite3

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash
from Eduplay3_Studienarbeit.db import get_db

bp = Blueprint('inventory', __name__, url_prefix='/inventory')


@bp.route('/equipped', methods=['GET'])
def get_equipped():
    import json
    res = get_db().execute(f"SELECT item_id FROM inventory where user_id = {session['user_id']}").fetchall()
    readable = [list(row) for row in res]
    print(readable)
    return json.dumps(readable)


@bp.route('/equip', methods=['POST'])
def equip_item():
    item = list(request.form.keys())[0]
    db = get_db()
    db.execute(f"INSERT INTO equipped(user_id, item_id, item_type) VALUES('{session['user_id']}', '{item}', '{item.split('_')[0]}')")

    db.commit()
