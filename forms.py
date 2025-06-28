from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length


# define flask forms for CSRF protection
class LoginForm(FlaskForm):
    username = StringField(validators=[
                           DataRequired(), Length(min=3, max=30)], render_kw={'placeholder': 'Enter Username'})
    password = PasswordField(validators=[
                             DataRequired(), Length(min=3, max=30)], render_kw={'placeholder': 'Enter Password'})
    submit = SubmitField('Log In')


class SignupForm(FlaskForm):
    username = StringField(validators=[
                           DataRequired(), Length(min=3, max=30)], render_kw={'placeholder': 'Enter Username'})
    password = PasswordField(validators=[
                             DataRequired(), Length(min=3, max=30)], render_kw={'placeholder': 'Enter Password'})
    submit = SubmitField('Sign Up')


class LogoutForm(FlaskForm):
    submit = SubmitField('Log Out')
