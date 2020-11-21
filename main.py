from flask import Flask, render_template
from livereload import Server

app = Flask(__name__)
app.config.from_pyfile('settings/development.conf')

@app.route("/", methods=['GET'])
def index():
    return render_template('index.html')

if __name__ == "__main__":
    server = Server(app.wsgi_app)
    server.serve(host='0.0.0.0', port=5000)
