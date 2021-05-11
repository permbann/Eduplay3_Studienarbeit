# !/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Shop url mapping.
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

bp = Blueprint('shop', __name__, url_prefix='/shop')


@bp.route('/hats', methods=['GET', 'POST'])
@login_required
def shop():
    return render_template("shop/hats.html")


@bp.route('/shoes', methods=['GET', 'POST'])
@login_required
def shoes():
    return render_template("shop/shoes.html")


@bp.route('/shirts', methods=['GET', 'POST'])
@login_required
def shirts():
    return render_template("shop/shirts.html")


@bp.route('/accessories', methods=['GET', 'POST'])
@login_required
def accessories():
    return render_template("shop/accessories.html")
