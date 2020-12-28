import os

from flask import Flask, render_template
from Eduplay3_Studienarbeit.task_generator import MathGenerator

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

    @app.route('/shop')
    def shop():
        return render_template('shop.html')

    @app.route("/", methods=['GET'])
    def index():
        return render_template('game.html')

    @app.route("/items", methods=['GET', 'POST'])
    def items():
        return render_template('game.html', tellme=mg.generate_lvl2()[0])

    from . import db
    db.init_app(app)

    # Import and register the blueprint from the factory
    from . import auth
    app.register_blueprint(auth.bp)

    return app
