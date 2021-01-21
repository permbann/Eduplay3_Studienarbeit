import os

from flask import Flask, render_template, session
from MathEngine import MathGenerator
from Eduplay3_Studienarbeit.auth import login_required
from flask import Flask, render_template, request
from Eduplay3_Studienarbeit.db import get_db, query_db

mg = MathGenerator()

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'users.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    @app.route("/", methods=['GET'])
    def index():
        return render_template('game.html')

    @app.route("/items", methods=['GET', 'POST'])
    def items():
        return mg.generate_lvl2()

    @app.route("/dbv", methods=['GET'])
    @login_required
    def db_view():
        res = get_db().execute(f"SELECT * FROM user where id = {session['user_id']}").fetchone()
        print([x for x in res])
        return render_template('dbv.html', iii=[x for x in res])


    @app.route('/test', methods=['GET'])
    def test():
        for items in query_db('select * from items'):
            print (items['item_id'], 'has the cost', items['cost'])
        for inventory in query_db('select * from inventory'):
            print (inventory['user_id'], 'has the items', inventory['item_id'])
        return "test"

    from . import db
    db.init_app(app)

    # Import and register the blueprint from the factory
    from . import auth
    app.register_blueprint(auth.bp)

    from . import currency
    app.register_blueprint(currency.bp)

    from . import shop
    app.register_blueprint(shop.bp)

    from . import inventory
    app.register_blueprint(inventory.bp)
    return app
