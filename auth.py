import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from Eduplay3_Studienarbeit.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register', methods=('GET', 'POST'))  # associates the URL /register with the register view function.
def register():
    if request.method == 'POST':
        # request.form is a special type of dict mapping submitted form keys and values.
        # The user will input their username and password.
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None

        if not username:
            error = 'Username is required.'
        elif not password:
            error = 'Password is required.'
        elif db.execute(
            'SELECT id FROM user WHERE username = ?', (username,)
        ).fetchone() is not None:
            error = 'User {} is already registered.'.format(username)

        if error is None:
            db.execute(
                'INSERT INTO user (username, password, jumps, currency, tries) VALUES (?, ?, 3, 0, 3)',
                (username, generate_password_hash(password))
            )   # The database library will take care of escaping the values so you
                # are not vulnerable to a SQL injection attack.
            db.commit()
            return redirect(url_for('auth.login'))

        flash(error)

    return render_template('auth/register.html')


@bp.route('/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None
        user = db.execute(
            'SELECT * FROM user WHERE username = ?', (username,)
        ).fetchone()

        if user is None:
            error = 'Incorrect username.'
        # check_password_hash() hashes the submitted password in the same way
        # as the stored hash and securely compares them.
        elif not check_password_hash(user['password'], password):
            error = 'Incorrect password.'

        if error is None:
            # session is a dict that stores data across requests.
            session.clear()
            session['user_id'] = user['id']
            return redirect(url_for('index'))

        flash(error)

    return render_template('auth/login.html')


# If a user is logged in their information should be loaded and made available to other views. (session id)
@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = get_db().execute(
            'SELECT * FROM user WHERE id = ?', (user_id,)
        ).fetchone()


@bp.route('/logout')
def logout():
    session.clear()  # remove the user id from the session.
    return redirect(url_for('index'))


# Require Authentication in Other Views (used as a decorator below route decorator)
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            # The url_for() function generates the URL to a view based on a name and arguments.
            return redirect(url_for('auth.login'))

        return view(**kwargs)

    return wrapped_view

