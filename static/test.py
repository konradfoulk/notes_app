from flask import Flask, render_template, url_for
from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import Integer, String
# from sqlalchemy.orm import mapped_column
from flask_login import UserMixin

app = Flask(__name__)
db = SQLAlchemy()
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database.db"
app.config['SECRET_KEY'] = "hello"
db.init_app(app)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    id = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(999), nullable=False)
    # id = mapped_column(Integer, primary_key=True)
    # username = mapped_column(String(20), nullable=False, unique=True)
    # password = mapped_column(String(80), nullable=False)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/signup")
def signup():
    return render_template("signup.html")


if __name__ == "__main__":
    app.run(debug=True)
