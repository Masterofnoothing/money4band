from flask import Flask, jsonify,render_template,request
from flask_cors import CORS

import json
import random
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

@app.route('/')
def home():
    return render_template('main.html')

@app.route('/onbording')
def onbording():
    return render_template('onbording.html')

@app.route('/save', methods=['POST'])
def save():
    try:
        data = request.get_json()
        print(data)

        # Open and update the configuration file
        with open('./config/user-config.json', 'r+') as file:
            config = json.load(file)
            config['apps'] = data  # Update 'apps' field with the new data
            file.seek(0)  # Move the file pointer to the beginning of the file
            json.dump(config, file, indent=4)  # Write updated data to the file
            file.truncate()  # Remove any extra content after the new data

        return jsonify({"message": "Apps updated successfully"})
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to decode JSON from the config file."}), 400
    except FileNotFoundError:
        return jsonify({"error": "Configuration file not found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/supported_apps', methods=['GET'])
def supportedapps():
    try:
        with open('./config/user-config.json') as file:
            data = json.load(file)
        return jsonify(data["apps"])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/restart')
def restart():
    pass





if __name__ == '__main__':
    app.run(debug=True)
