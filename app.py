from flask import Flask, render_template, request, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

app = Flask(__name__)
db = SQLAlchemy(app)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database.db"
app.config['SECRET_KEY'] = "!48LawsOfPower"


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(999), nullable=False)


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


# @app.route("/app")
# def user():
#     if "user" in session:
#         usr = session["user"]
#         return render_template("index.html", content=usr)
#     else:
#         return redirect(url_for("login"))
# @app.route("/login", methods=["POST", "GET"])
# def login():
#     if request.method == "POST":
#         usr = request.form["username"]
#         session["user"] = usr
#         return redirect(url_for("user"))
#     else:
#         if "user" in session:
#             return redirect(url_for("user"))
#         else:
#             return render_template("login.html")
# @app.route("/signup")
# def signup():
#     return render_template("signup.html")
# @app.route("/logout")
# def logout():
#     session.pop("user", None)
#     return redirect(url_for("login"))
# @app.route("/")
# def index():
#     return redirect(url_for("login"))
