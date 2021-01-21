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
