from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
import sqlite3
from Eduplay3_Studienarbeit.db import get_db

bp = Blueprint('shop', __name__, url_prefix='/shop')


@bp.route('/hats', methods=['GET', 'POST'])
def shop():
    return render_template("shop/hats.html")


@bp.route('/shoes', methods=['GET', 'POST'])
def shoes():
    return render_template("shop/shoes.html")


@bp.route('/shirts', methods=['GET', 'POST'])
def shirts():
    return render_template("shop/shirts.html")


@bp.route('/accessories', methods=['GET', 'POST'])
def accessories():
    return render_template("shop/accessories.html")


@bp.route('/gethat', methods=['GET'])
def get_hat_cost():
    import json
    res = get_db().execute(f"SELECT item_id, cost FROM items WHERE item_id LIKE '%hat%'").fetchall()
    readable = [dict(zip(row.keys(), row)) for row in res]
    return json.dumps(readable)


@bp.route('/getshoe', methods=['GET'])
def get_shoe_cost():
    import json
    res = get_db().execute(f"SELECT item_id, cost FROM items WHERE item_id LIKE '%shoe%'").fetchall()
    readable = [dict(zip(row.keys(), row)) for row in res]
    return json.dumps(readable)

@bp.route('/getshirt', methods=['GET'])
def get_shirt_cost():
    import json
    res = get_db().execute(f"SELECT item_id, cost FROM items WHERE item_id LIKE '%shirt%'").fetchall()
    readable = [dict(zip(row.keys(), row)) for row in res]
    return json.dumps(readable)

@bp.route('/getaccessory', methods=['GET'])
def get_accessory_cost():
    import json
    res = get_db().execute(f"SELECT item_id, cost FROM items WHERE item_id LIKE '%accessory%'").fetchall()
    readable = [dict(zip(row.keys(), row)) for row in res]
    return json.dumps(readable)