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
from E3LevelGenerator import LevelGenerator
from Eduplay3_Studienarbeit.database_files.db_models import db, User, Items, Inventory, Equipped
from Eduplay3_Studienarbeit.database_files.db_schemas import user_schema, users_schema, UserSchema, ItemsSchema, \
    InventorySchema, EquippedSchema

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


@bp.route('/currency', methods=['GET'])
def get_currency():
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


@bp.route('/update_currency', methods=['PATCH'])
def update_currency():
    """
    Updates currency in database
    :return: new currency
    """
    user = _get_current_user()
    currency = int(request.form['currency'])
    user.currency = user.currency + currency
    db.session.add(user)
    db.session.commit()
    schema = UserSchema()
    return schema.jsonify(user)


@bp.route('/update_mascot', methods=['PATCH'])
def update_mascot():
    """
    Updates mascot in database
    :return: new mascot
    """
    user = _get_current_user()
    mascot = int(request.form['mascot'])
    user.mascot = mascot
    db.session.add(user)
    db.session.commit()
    schema = UserSchema()
    return schema.jsonify(user)


@bp.route('/get_mascot', methods=['GET'])
def get_mascot():
    user = _get_current_user()
    schema = UserSchema()
    return schema.jsonify(user)


@bp.route('/add_item', methods=['PUT'])
def add_item():
    """
    Adds a new item into the users Inventory after being purchased
    :return: inventory including new item
    """
    item = request.form['item_id']
    inventory = Inventory(session['user_id'], item)
    db.session.add(inventory)
    db.session.commit()
    schema = InventorySchema()
    return schema.jsonify(inventory)


@bp.route('/get_items', methods=['GET'])
def get_items():
    """
    gets all items in the users inventory eg. all purchased items
    :return: inventory
    """
    inventory = _get_current_inventory()
    schema = InventorySchema(many=True)
    return schema.jsonify(inventory)


@bp.route('/get_hat', methods=['GET'])
def get_hat_cost():
    """
    gets cost of all hats with their corresponding ID
    :return: list of cost + item_id
    """
    hats = Items.query.filter(Items.item_id.like('%hat%')).all()
    schema = ItemsSchema(many=True)
    return schema.jsonify(hats)


@bp.route('/get_shoe', methods=['GET'])
def get_shoe_cost():
    """
    gets cost of all shoes with their corresponding ID
    :return: list of cost + item_id
    """
    shoes = Items.query.filter(Items.item_id.like('%shoe%')).all()
    schema = ItemsSchema(many=True)
    return schema.jsonify(shoes)


@bp.route('/get_shirt', methods=['GET'])
def get_shirt_cost():
    """
    gets cost of all shirts with their corresponding ID
    :return: list of cost + item_id
    """
    shirts = Items.query.filter(Items.item_id.like('%shirt%')).all()
    schema = ItemsSchema(many=True)
    print(shirts)
    return schema.jsonify(shirts)


@bp.route('/get_accessory', methods=['GET'])
def get_accessory_cost():
    """
    gets cost of all accessories with their corresponding ID
    :return: list of cost + item_id
    """
    accessories = Items.query.filter(Items.item_id.like('%accessory%')).all()
    schema = ItemsSchema(many=True)
    return schema.jsonify(accessories)


@bp.route('/add_equipped', methods=['PUT'])
def add_equipped():
    """
    Adds a newly equipped item to the database
    :return:
    """
    key, value = list(request.form.items())[0]  # get the first item (only one allowed in the request)
    if not value:
        value = None

    equipped = _get_current_equipped()
    if not equipped:
        hat = value if 'hat' in key else None
        shoe = value if 'shoe' in key else None
        shirt = value if 'shirt' in key else None
        accessory = value if 'accessory' in key else None
        equipped = Equipped(
            user_id=session['user_id'],
            hat=hat,
            shoe=shoe,
            shirt=shirt,
            accessory=accessory
        )
    else:
        if 'hat' in key:
            equipped.hat = value
        if 'shoe' in key:
            equipped.shoe = value
        if 'shirt' in key:
            equipped.shirt = value
        if 'accessory' in key:
            equipped.accessory = value
    db.session.add(equipped)
    db.session.commit()
    schema = EquippedSchema()
    return schema.jsonify(equipped)


@bp.route('/get_equipped', methods=['GET'])
def get_equipped():
    """
    gets all equipped items
    :return:
    """
    equipped = _get_all_equipped()
    schema = EquippedSchema(many=True)
    return schema.jsonify(equipped)




def _get_current_user():
    """
    :return: user_id of current user
    """
    return User.query.filter_by(id=session['user_id']).first()


def _get_current_inventory():
    """
    :return: inventory of current user
    """
    return Inventory.query.filter_by(user_id=session['user_id']).all()


def _get_current_equipped():
    """
    :return: equipped items of current user
    """
    return Equipped.query.filter_by(user_id=session['user_id']).first()

def _get_all_equipped():
    """
    :return: equipped items of current user
    """
    return Equipped.query.filter_by(user_id=session['user_id']).all()
