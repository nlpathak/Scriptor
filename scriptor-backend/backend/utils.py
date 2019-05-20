from functools import wraps

from flask import g, jsonify


def login_required(f):
    """
    This is a Python "middleware" for API routes that require a user to be logged in before accessing them.

    Note:   g.current_user will be set to the current User object in the "before_request" middleware that we've defined in app.py
            if a valid auth token was provided in the request.

    Sample unauthenticated response:
    {
        "success" : false,
        "error" : "Unauthorized access."
    }
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not g.current_user:
            return jsonify(success=False, error="Unauthorized access."), 401

        return f(*args, **kwargs)

    return decorated_function
