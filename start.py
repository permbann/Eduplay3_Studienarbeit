from flask import Blueprint, render_template

from Eduplay3_Studienarbeit.auth import login_required

bp = Blueprint('start', __name__, url_prefix='/start')


@bp.route('/start', methods=['GET', 'POST'])
@login_required
def start():
    return render_template("start.html")
