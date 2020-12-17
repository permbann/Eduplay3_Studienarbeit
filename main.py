from flask import Flask, render_template
from livereload import Server
from . import db



app = Flask(__name__)
app.config.from_pyfile('settings/development.conf')

db.init_app(app)


@app.route("/", methods=['GET'])
def index():
    return render_template('index.html')

if __name__ == "__main__":
    server = Server(app.wsgi_app)
    server.serve(host='0.0.0.0', port=5000)
