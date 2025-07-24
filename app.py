from dotenv import load_dotenv
from flask import Flask, render_template, redirect, url_for, flash, jsonify, request
import os
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Note
from forms import LoginForm, SignupForm, LogoutForm

load_dotenv()

# initialize Flask app, database, and flask_login
app = Flask(__name__)

app.config['SECRET_KEY'] = os.environ['Flask_SECRET_KEY']
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

db.init_app(app)

login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))


# define routes and functions for webpage
@app.route('/')
@login_required
def index():
    form = LogoutForm()
    return render_template('index.html', username=current_user.username, form=form)


@app.route('/login', methods=['POST', 'GET'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        # get username and password from form on webpage
        username = form.username.data
        password = form.password.data

        # query the database for the user under that username
        # if the hashed passwords match, login the user and return the home page
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('index'))
        else:
            flash('Username or password was incorrect.', 'error')
    return render_template('login.html', form=form)


@app.route('/signup', methods=['POST', 'GET'])
def signup():
    form = SignupForm()
    if form.validate_on_submit():
        # get username and password from form on webpage
        username = form.username.data
        password = form.password.data

        # handle duplicate usernames
        if User.query.filter_by(username=username).first():
            flash('Username already exists.', 'error')
            return render_template('signup.html', form=form)

        # create new user in database using hashed password
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        login_user(new_user)
        return redirect(url_for('index'))
    return render_template('signup.html', form=form)


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    # logout user and redirect to login page
    logout_user()
    return redirect(url_for('login'))


# define Notes API
@app.route('/notes', methods=['GET'])
@login_required
def get_notes():
    # query database for notes
    notes = Note.query.filter_by(user_id=current_user.id).order_by(
        Note.last_save).all()
    # format notes to send JSON response
    notes_list = [
        {
            'id': note.id,
            'content': note.content
        }
        for note in notes]
    return jsonify(notes_list)


@app.route('/notes', methods=['POST'])
@login_required
def create_note():
    # create note in database
    note = Note(user_id=current_user.id)
    db.session.add(note)
    db.session.commit()
    # return JSON response for note for redundancy
    return jsonify(
        {
            'id': note.id,
            'content': note.content
        }
    )


@app.route('/notes/<note_id>', methods=['PUT'])
@login_required
def save_note(note_id):
    # query database for note
    note = Note.query.filter_by(id=note_id, user_id=current_user.id).first()
    data = request.get_json()
    # update note
    note.content = data.get('content', note.content)
    note.last_save = db.func.now()
    db.session.commit()
    # return JSON  response for note for redundancy
    return jsonify({
        'id': note.id,
        'content': note.content
    })


@app.route('/notes/<note_id>', methods=['DELETE'])
@login_required
def delete_note(note_id):
    # query database for note
    note = Note.query.filter_by(id=note_id, user_id=current_user.id).first()
    # delete note
    db.session.delete(note)
    db.session.commit()
    # redundant JSON response
    return jsonify({
        'status': 'success',
        'id': note_id
    })


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
