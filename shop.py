from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for

from Eduplay3_Studienarbeit.db import get_db

bp = Blueprint('shop', __name__, url_prefix='/shop')


@bp.route('/', methods=['GET', 'POST'])
def shop():
    return render_template("shop.html")


@bp.route('/add_item', methods=['POST'])
def add_item():
    db = get_db()
    user_id = session['user_id']
    item_id = request.form['nm']

    db.execute('INSERT INTO inventory (user_id,item_id) VALUES(?, ?)',(user_id, item_id))
    print(user_id)

    db.commit()

