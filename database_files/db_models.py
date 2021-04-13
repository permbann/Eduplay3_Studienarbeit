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
    active_difficulty = db.Column(db.Integer, nullable=False)
    mascot = db.Column(db.Integer, nullable=False)

    def __init__(self, username, email, password, jumps=5, currency=0, tries=3, active_difficulty=0, mascot=1):
        self.username = username
        self.email = email
        self.password = password
        self.jumps = jumps
        self.currency = currency
        self.tries = tries
        self.active_difficulty = active_difficulty
        self.mascot = mascot

    def __str__(self):
        return f"""
        User: {self.username}
        Jumps: {self.jumps}
        Currency: {self.currency}
        Remaining Tries: {self.tries}
        Active Difficulty: {self.active_difficulty}
        Mascot: {self.mascot}
        """


class Items(db.Model):
    item_id = db.Column(db.String, unique=True, primary_key=True)
    cost = db.Column(db.Integer, nullable=False)

    def __init__(self, item_id, cost):
        self.item_id = item_id
        self.cost = cost


class Inventory(db.Model):
    user_id = db.Column(db.String, primary_key=True)
    item_id = db.Column(db.String, primary_key=True)

    def __init__(self, user_id, item_id):
        self.user_id = user_id
        self.item_id = item_id


class Equipped(db.Model):
    user_id = db.Column(db.String, unique=True, primary_key=True)
    hat = db.Column(db.String, nullable=True)
    shoe = db.Column(db.String, nullable=True)
    shirt = db.Column(db.String, nullable=True)
    accessory = db.Column(db.String, nullable=True)


class Quotes(db.Model):
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    quote = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)

    def __init__(self, quote, category):
        self.quote = quote
        self.category = category
