from flask import Flask, render_template, redirect, url_for, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

# initialize Flask app and database
app = Flask(__name__)
db = SQLAlchemy()

app.config['SECRET_KEY'] = '4'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

db.init_app(app)


# create database table for users
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)


# define routes and functions for webpage
@app.route('/')
def index():
    if 'user' in session:
        user = session['user']
        return render_template('index.html', content=user)
    else:
        return redirect(url_for('login'))


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        user = request.form['username']
        session['user'] = user
        return redirect(url_for('index'))
    elif 'user' in session:
        return redirect(url_for('index'))
    else:
        return render_template('login.html')


@app.route('/signup')
def signup():
    return render_template('signup.html')


@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=True)
