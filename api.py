import functools
import sqlite3
from flask import jsonify
from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from MathEngine import MathGenerator
from Eduplay3_Studienarbeit.database_files.db_models import db, User, Items, Inventory, Equipped
from Eduplay3_Studienarbeit.database_files.db_schemas import user_schema, users_schema, UserSchema, ItemsSchema, \
    InventorySchema, EquippedSchema

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


# -----------------------------------------------------------------------------

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
    return jsonify(schema.dump(inventory))


@bp.route('/get_hat', methods=['GET'])
def get_hat_cost():
    """
    gets cost of all hats with their corresponding ID
    :return: list of cost + item_id
    """
    hats = Items.query.filter(Items.item_id.like('%hat%')).all()
    schema = ItemsSchema(many=True)
    return jsonify(schema.dump(hats))


@bp.route('/get_shoe', methods=['GET'])
def get_shoe_cost():
    """
    gets cost of all shoes with their corresponding ID
    :return: list of cost + item_id
    """
    shoes = Items.query.filter(Items.item_id.like('%shoe%')).all()
    schema = ItemsSchema(many=True)
    return jsonify(schema.dump(shoes))


@bp.route('/get_glove', methods=['GET'])
def get_glove_cost():
    """
    gets cost of all gloves with their corresponding ID
    :return: list of cost + item_id
    """
    gloves = Items.query.filter(Items.item_id.like('%glove%')).all()
    schema = ItemsSchema(many=True)
    return jsonify(schema.dump(gloves))


@bp.route('/get_accessory', methods=['GET'])
def get_accessory_cost():
    """
    gets cost of all accessories with their corresponding ID
    :return: list of cost + item_id
    """
    accessories = Items.query.filter(Items.item_id.like('%accessory%')).all()
    schema = ItemsSchema(many=True)
    return jsonify(schema.dump(accessories))


@bp.route('/add_equipped', methods=['PUT'])
def add_equipped():
    """
    Adds a newly equipped item to the database
    :return:
    """
    key, value = list(request.form.items())[0]  # get the first item (only one allowed in the request)
    equipped = _get_current_equipped()
    if not equipped:
        hat = value if 'hat' in key else None
        shoe = value if 'shoe' in key else None
        glove = value if 'glove' in key else None
        accessory = value if 'accessory' in key else None
        equipped = Equipped(
            user_id=session['user_id'],
            hat=hat,
            shoe=shoe,
            glove=glove,
            accessory=accessory
        )
    else:
        if 'hat' in key:
            equipped.hat = value
        if 'shoe' in key:
            equipped.shoe = value
        if 'glove' in key:
            equipped.glove = value
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
    return jsonify(schema.dump(equipped))


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
