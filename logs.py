from os import makedirs, path
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime

# Définition du niveau de log à écrire
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Définition du format de sortie côté fichier
formatter = logging.Formatter('%(asctime)s :: FROM: %(name)s :: %(levelname)s :: %(message)s')

# Définition de nos variables nom + dossier
log_name = str(datetime.now().strftime("%Y-%m-%d") + '.log')
defined_folder = './logs/'

if not path.exists(defined_folder):
    makedirs(defined_folder)

# création d'un handler qui va écrire du log et supprimer les fichiers > 7 jours
file_handler = RotatingFileHandler(
    filename=f'{defined_folder}/{log_name}',
    mode='a',
    maxBytes=1000000,
    backupCount=1
)

# on lui met le niveau choisi et lui dit qu'il doit utiliser le formateur
# créé précédement puis on ajoute ce handler au logger
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# création d'un second handler qui va rediriger chaque écriture sur la console
stream_handler = logging.StreamHandler()
logger.addHandler(stream_handler)

if __name__ == '__main__':
    """
    On peut maintenant vérifier que ça fonctionne
    """
    logger.info('INFO')
    logger.error('ERROR')
    logger.error('TEST LOG ERROR')
