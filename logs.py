from os import makedirs, path
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s :: FROM: %(name)s :: %(levelname)s :: %(message)s')

log_name = str(datetime.now().strftime("%Y-%m-%d") + '.log')
defined_folder = './logs/'

if not path.exists(defined_folder):
    makedirs(defined_folder)

file_handler = RotatingFileHandler(
    filename=f'{defined_folder}/{log_name}',
    mode='a',
    maxBytes=1000000,
    backupCount=1
)

file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

if __name__ == '__main__':
    logger.info('INFO')
    logger.error('ERROR')
    logger.error('TEST LOG ERROR')
    """
    ISSUE : Switching to a definition or class create recursion in logging, 
            not sure if staying like scale for multiple file...
    """
