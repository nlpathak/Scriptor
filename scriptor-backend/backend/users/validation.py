from validate_email import validate_email


def is_email_valid(email):
    return validate_email(email=email)


def is_password_valid(password):
    return len(password) > 0
