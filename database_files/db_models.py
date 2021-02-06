# !/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Main Flask file to start the webserver.
"""

__authors__ = ["Luana Juhl", "Lukas Schult"]
__contact__ = "it16156@lehre.dhbw-stuttgart.de"
__credits__ = ["Luana Juhl", "Lukas Schult"]
__date__ = "2021/02/06"
__deprecated__ = False
__email__ = "it16156@lehre.dhbw-stuttgart.de"
__maintainer__ = "developer"
__status__ = "Released"
__version__ = "1.0"

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    jumps = db.Column(db.Integer, nullable=False)
    currency = db.Column(db.Integer, nullable=False)
    tries = db.Column(db.Float, nullable=False)

    def __init__(self, username, email, password, jumps=5, currency=0, tries=3):
        self.username = username
        self.email = email
        self.password = password
        self.jumps = jumps
        self.currency = currency
        self.tries = tries

    def __str__(self):
        return f"""
        User: {self.username}
        Jumps: {self.jumps}
        Balance: {self.currency}
        Remaining Tries: {self.tries}
        """
