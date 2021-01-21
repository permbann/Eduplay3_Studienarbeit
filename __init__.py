import os

from flask import Flask, render_template, session
from MathEngine import MathGenerator
from Eduplay3_Studienarbeit.auth import login_required
from Eduplay3_Studienarbeit.database_files.user_model import db, User
import sqlalchemy

from flask import Flask, render_template, request
from Eduplay3_Studienarbeit.db import get_db, query_db



def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        #DATABASE=os.path.join(app.instance_path, 'users.sqlite'),
        SQLALCHEMY_DATABASE_URI='sqlite:///database_files/users.sqlite',
        SQLALCHEMY_TRACK_MODIFICATIONS=False
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

    @app.route("/", methods=['GET'])
    @login_required
    def index():
        return render_template('game.html')

    app.app_context().push()
    db.init_app(app)
    db.drop_all()  # comment out if you want to keep data on restart
    db.create_all()

    try:
        from werkzeug.security import generate_password_hash
        admin_user = User("admin", "admin@trash-mail.com", generate_password_hash("admin"), jumps=100, currency=0, tries=3)
        db.session.add(admin_user)
        db.session.commit()
    except sqlalchemy.exc.IntegrityError:
        print("Admin user already present. Skipping creation...")
        pass

    # Import and register the blueprint from the factory
    from . import auth
    app.register_blueprint(auth.bp)

    from . import api
    app.register_blueprint(api.bp)

    from . import shop
    app.register_blueprint(shop.bp)

    from . import inventory
    app.register_blueprint(inventory.bp)
    return app
