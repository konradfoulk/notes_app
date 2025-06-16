from flask import Flask, render_template, redirect, url_for, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

# initialize Flask app, database, and flask_login
app = Flask(__name__)
db = SQLAlchemy()

app.config['SECRET_KEY'] = '4'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

db.init_app(app)

login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# create database table for users
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)


# define routes and functions for webpage
@app.route('/')
@login_required
def index():
    return render_template('index.html', content=current_user.username)


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        # get username and password from form on webpage
        username = request.form['username']
        password = request.form['password']

        # query the database for the user under that username
        # if the hashed passwords match, login the user and return the home page
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('index'))

        # WHAT IF PASSWORD IS INCORRECT?
    return render_template('login.html')


@app.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.method == 'POST':
        # get username and password from form on webpage
        username = request.form['username']
        password = request.form['password']

        # WHAT IF USERNAME ALREADY EXISTS?

        # create new user in database using hashed password
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        login_user(new_user)
        return redirect(url_for('index'))
    return render_template('signup.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
