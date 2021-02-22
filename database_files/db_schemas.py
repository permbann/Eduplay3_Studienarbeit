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
