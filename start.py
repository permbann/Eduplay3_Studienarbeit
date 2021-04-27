# !/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Starting screen url mapping.
"""

__authors__ = ["Luana Juhl", "Lukas Schult"]
__contact__ = "it16156@lehre.dhbw-stuttgart.de"
__credits__ = ["Luana Juhl", "Lukas Schult"]
__date__ = "2021/04/27"
__deprecated__ = False
__email__ = "it16156@lehre.dhbw-stuttgart.de"
__maintainer__ = "developer"
__status__ = "Released"
__version__ = "1.0"

from flask import Blueprint, render_template

from Eduplay3_Studienarbeit.auth import login_required

bp = Blueprint('start', __name__, url_prefix='/start')


@bp.route('/start', methods=['GET'])
@login_required
def start():
    return render_template("start.html")
