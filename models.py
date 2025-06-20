from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

# instantiate database
db = SQLAlchemy()


# create database table for users
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)

    notes = db.relationship('Note')


class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, default='')
    last_save = db.Column(db.DateTime, default=db.func.now())

    user = db.relationship('User')
