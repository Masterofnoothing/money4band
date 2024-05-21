import requests
import logging
import os
import argparse
import json
from typing import Any, Dict

def download_file(url: str, dest_path: str):
    """
    Download a file from a given URL and save it to the specified destination path.

    Parameters:
    url (str): The URL of the file to download.
    dest_path (str): The local path where the file will be saved.

    Raises:
    requests.RequestException: If there is an issue with the request.
    """
    try:
        logging.info(f"Starting download from {url}")
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(dest_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    file.write(chunk)
        logging.info(f"File downloaded successfully from {url} to {dest_path}")
    except requests.RequestException as e:
        logging.error(f"An error occurred while downloading the file from {url}: {str(e)}")
        raise

def main(app_config: Dict[str, Any], m4b_config: Dict[str, Any], user_config: Dict[str, Any]):
    """
    Main function to demonstrate downloading a file based on provided configurations.

    Parameters:
    app_config (dict): The application configuration dictionary.
    m4b_config (dict): The m4b configuration dictionary.
    user_config (dict): The user configuration dictionary.
    """
    try:
        logging.info("Starting main function for download_file")
        download_url = app_config.get('download_url')
        destination_path = m4b_config.get('destination_path', '/tmp/downloaded_file')

        if not download_url:
            logging.error("Download URL not provided in app_config")
            raise ValueError("Download URL not provided in app_config")

        download_file(download_url, destination_path)
        logging.info("Download completed successfully")
    except Exception as e:
        logging.error(f"An error occurred in main function: {str(e)}")
        raise

if __name__ == '__main__':
    # Get the script absolute path and name
    script_dir = os.path.dirname(os.path.abspath(__file__))
    script_name = os.path.basename(__file__)

    # Parse command-line arguments
    parser = argparse.ArgumentParser(description='Run the module standalone.')
    parser.add_argument('--app-config', type=str, required=True, help='Path to app_config JSON file')
    parser.add_argument('--m4b-config', type=str, required=False, help='Path to m4b_config JSON file')
    parser.add_argument('--user-config', type=str, required=False, help='Path to user_config JSON file')
    parser.add_argument('--log-dir', default=os.path.join(script_dir, 'logs'), help='Set the logging directory')
    parser.add_argument('--log-file', default=f"{script_name}.log", help='Set the logging file name')
    parser.add_argument('--log-level', choices=['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'], default='INFO', help='Set the logging level')
    args = parser.parse_args()

    # Set logging level based on command-line arguments
    log_level = getattr(logging, args.log_level.upper(), None)
    if not isinstance(log_level, int):
        raise ValueError(f'Invalid log level: {args.log_level}')

    # Start logging
    os.makedirs(args.log_dir, exist_ok=True)
    logging.basicConfig(
        filename=os.path.join(args.log_dir, args.log_file),
        format='%(asctime)s - [%(levelname)s] - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S',
        level=log_level
    )

    logging.info(f"Starting {script_name} script...")

    try:
        # Load the app_config JSON file
        app_config = {}
        if args.app_config:
            logging.debug("Loading app_config JSON file")
            with open(args.app_config, 'r') as f:
                app_config = json.load(f)
            logging.info("app_config JSON file loaded successfully")

        # Load the m4b_config JSON file if provided
        m4b_config = {}
        if args.m4b_config:
            logging.debug("Loading m4b_config JSON file")
            with open(args.m4b_config, 'r') as f:
                m4b_config = json.load(f)
            logging.info("m4b_config JSON file loaded successfully")
        else:
            logging.info("No m4b_config JSON file provided, proceeding without it")

        # Load the user_config JSON file if provided
        user_config = {}
        if args.user_config:
            logging.debug("Loading user_config JSON file")
            with open(args.user_config, 'r') as f:
                user_config = json.load(f)
            logging.info("user_config JSON file loaded successfully")
        else:
            logging.info("No user_config JSON file provided, proceeding without it")

        # Call the main function
        main(app_config=app_config, m4b_config=m4b_config, user_config=user_config)

        logging.info(f"{script_name} script completed successfully")
    except FileNotFoundError as e:
        logging.error(f"File not found: {str(e)}")
        print(f"File not found: {str(e)}")
    except json.JSONDecodeError as e:
        logging.error(f"Error decoding JSON: {str(e)}")
        print(f"Error decoding JSON: {str(e)}")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {str(e)}")
        print(f"An unexpected error occurred: {str(e)}")