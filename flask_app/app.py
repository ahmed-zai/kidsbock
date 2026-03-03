from flask import Flask
from routes import bp
from config import Config
import os # Import os module

app = Flask(__name__)
app.config.from_object(Config)

# load_dotenv() # Removed, as environment variables are handled by docker-compose

app.register_blueprint(bp, url_prefix='/api/ai')

@app.route('/health', methods=['GET'])
def health():
    return {'status': 'OK', 'message': 'AI service running'}

if __name__ == '__main__':
    port = int(os.environ.get('FLASK_PORT', 6000)) # Use FLASK_PORT, default to 6000
    app.run(host='0.0.0.0', port=port, debug=Config.DEBUG)
