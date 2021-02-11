import functools

from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for

from wtforms import Form, StringField, PasswordField, validators

from werkzeug.security import check_password_hash, generate_password_hash
from Eduplay3_Studienarbeit.database_files.db_models import db, User, Equipped

bp = Blueprint('auth', __name__, url_prefix='/auth')


class LoginForm(Form):
    username = StringField("Username", validators=[validators.Length(min=3, max=50),
                                                   validators.DataRequired(message="Please Fill This Field")])

    password = PasswordField("Password", validators=[validators.DataRequired(message="Please Fill This Field")])


class RegisterForm(Form):
    username = StringField("Username", validators=[validators.Length(min=3, max=25),
                                                   validators.DataRequired(message="Please Fill This Field")])

    email = StringField("Email", validators=[validators.Length(min=7, max=50),
                                             validators.DataRequired(message="Please Fill This Field")])
    password = PasswordField("Password", validators=[

        validators.DataRequired(message="Please Fill This Field"),

        validators.EqualTo(fieldname="confirm", message="Your Passwords Do Not Match")
    ])

    confirm = PasswordField("Confirm Password", validators=[validators.DataRequired(message="Please Fill This Field")])


@bp.route('/login/', methods=['GET', 'POST'])
def login():
    form = LoginForm(request.form)

    if request.method == 'POST' and form.validate:

        user = User.query.filter_by(username=form.username.data).first()

        if user:

            if check_password_hash(user.password, form.password.data):

                session.clear()
                session['user_id'] = user.id
                flash('You have successfully logged in.', "success")
                return redirect(url_for('index'))

            else:

                flash('Username or Password Incorrect', "Danger")

                return redirect(url_for('auth.login'))

    return render_template('auth/login.html', form=form)


@bp.route('/register/', methods=['GET', 'POST'])
def register():
    form = RegisterForm(request.form)

    if request.method == 'POST' and form.validate():

        hashed_password = generate_password_hash(form.password.data, method='sha256')

        new_user = User(

            username=form.username.data,
            email=form.email.data,
            password=hashed_password,
            jumps=5,
            currency=0,
            tries=3
        )
        print(new_user.email)
        db.session.add(new_user)
        db.session.commit()

        flash('You have successfully registered', 'success')

        return redirect(url_for('auth.login'))

    else:

        return render_template('auth/register.html', form=form)


@bp.route('/logout/')
def logout():
    session['logged_in'] = False

    return redirect(url_for('auth.login'))


@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = User.query.filter_by(id=user_id).first().username


# Require Authentication in Other Views (used as a decorator below route decorator)
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            # The url_for() function generates the URL to a view based on a name and arguments.
            return redirect(url_for('auth.login'))

        return view(**kwargs)

    return wrapped_view
