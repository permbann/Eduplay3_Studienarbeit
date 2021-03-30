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

from flask_marshmallow import Marshmallow

ma = Marshmallow()


class UserSchema(ma.Schema):
    class Meta:
        fields = [
            'id',
            'username',
            'jumps',
            'currency',
            'tries',
            'active_difficulty',
            'mascot'
        ]


user_schema = UserSchema()
users_schema = UserSchema(many=True)


class ItemsSchema(ma.Schema):
    class Meta:
        fields = [
            "item_id",
            "cost"
        ]


class InventorySchema(ma.Schema):
    class Meta:
        fields = [
            "user_id",
            "item_id"
        ]


class EquippedSchema(ma.Schema):
    class Meta:
        fields = [
            "user_id",
            "hat",
            "shoe",
            "shirt",
            "accessory"
        ]
