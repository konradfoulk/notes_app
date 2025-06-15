from flask import Flask, render_template, redirect, url_for, request, session

app = Flask(__name__)
app.config['SECRET_KEY'] = '4'


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
    else:
        if 'user' in session:
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
