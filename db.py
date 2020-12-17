import sqlite3

import click
from flask import current_app, g
# g is a special object that is unique for each request.
# current_app is a special object that points to the Flask application handling the request.

from flask.cli import with_appcontext


def get_db():
    """
    The connection is stored and reused instead of creating a new connection if get_db is called a second time in the same request.
    :return:
    """
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )  # establishes a connection to the file pointed at by the DATABASE configuration key.
        g.db.row_factory = sqlite3.Row  # tells the connection to return rows that behave like dicts

    return g.db


def close_db(e=None):
    """
    checks if a connection was created by checking if g.db was set.
    :param e:
    :return:
    """
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    db = get_db()

    with current_app.open_resource('database_files/schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


@click.command('init-db')   # defines a command line command called init-db that calls
                            # the init_db function and shows a success message to the user.
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)