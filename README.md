# Sample

## Gestion des applications avec pebbleapp

Il est préférable d'utiliser le script pebbleapp pour créer, mettre à jour, lancer et compiler les projets d'applications basés sur Sample.

### Récupérer le script pebbleapp
```shell
sudo wget https://storage.googleapis.com/pebble-public-cdn/pebbleapp -O /usr/local/sbin/pebbleapp && sudo chmod +x /usr/local/sbin/pebbleapp
```
Cette commande est à exécuter une seule fois par poste. Pour mettre à jour le programme, voir pebbleapp upgrade.

**Dernière version de pebbleapp : 1.1.0**

### Créer un nouveau projet d'application

*Version supportée : 1.0.1*

Vous pouvez créer une application depuis n'importe quel dossier accessible de votre système de fichier local.

Lancez pebbleapp pour créer une nouvelle application basée sur sample.

```shell
pebbleapp create <nom_application>
```

Un nouveau dépôt est initialisé dans le dossier <nom_application>. Par défaut, ce dépôt est local, c'est à dire qu'il n'est lié à aucun serveur sur github. Il sera nécessaire de créer manuellement le dépôt sur github afin de lier au nouveau projet :

```shell
cd <nom_application>
```

```shell
git remote add origin git@github.com:<account_name>/<app_name>.git
```

Vous pouvez contrôler la bonne connexion avec votre dépôt github :

```shell
git remote -v
```

Le résultat doit être le suivant :

```shell
origin git@github.com:<account_name>/<app_name>.git (fetch)
origin git@github.com:<account_name>/<app_name>.git (push)
```

Une fois la connexion établie, il est possible d'envoyer le premier commit sur le dépôt distant.

```shell
git push -u origin main
```

### Cloner une application depuis github

*Version supportée : 1.0.7*

Cette commande va récupérer une application disponible sur github, installer les sous-modules et les dépendances afin qu'elle soit disponible sur votre machine locale.


```shell
pebbleapp clone <depot> <destination>
```

- *depot* doit être l'adresse ssh d'un dépôt existant sur github (ex : git@github.com:pebble-solutions/mon-app.git)
- *destination* doit être le dossier de copie sur votre machine locale (ex : mon-app)

### Mettre à jour les sous modules

*Version supportée : 1.0.4*

L'application utilise des sous-modules distants qui peuvent être mis à jour depuis le dossier de travail :

```shell
cd /chemin/vers/<nom_application>
```

```shell
pebbleapp update
```

### Lancer le serveur

*Version supportée : 1.0*

Depuis le dossier dans lequel est stocké votre application :

```shell
pebbleapp serve
```

### Compiler l'application

*Version supportée : 1.0*

Depuis le dossier dans lequel est stocké votre application :

```shell
pebbleapp build
```

### Version de pebbleapp

*Version supportée : 1.0.3*

```shell
pebbleapp version
```

### Mise à jour de pebbleapp

*Version supportée : 1.0.2*

```shell
pebbleapp upgrade
```

### Déployer l'application

*Version supportée : 1.0.7*

Cette commande nécessite d'avoir créé plusieurs domaines correspondant aux différents environnement d'exécution :

| domaine | dossier serveur | Environnement | Branche |
| ---- | --- | --- | --- |
| [APPNAME].pebble.solutions | APPNAME/prod | Production (prod) | **main** |
| [APPNAME].pebble.recipes | APPNAME/preprod | Pré-production (prod) | **main** |
| [APPNAME]-test.pebble.recipes | APPNAME/test | Test (test) | **testing**, unstable, main |
| [APPNAME]-dev.pebble.recipes | APPNAME/dev | Dévelopement (dev) | **unstable**, testing, main |

La commande compilera l'application depuis la bonne branche et la déploiera sur le serveur, dans le dossier correspondant. Elle sera alors accessible en ligne sur le domaine référencé.

```shell
pebbleapp deploy <env>
```

Env peut être
- dev
- test
- prod

**Pour le déploiement en production**, il vous sera possible de tester l'application sur un domaine intermédiaire (pré-production) avant de procéder à la mise en ligne finale. Pour les autres environnements, le déploiement est immédiat.

Pour les environnements *test* et *dev*, le système va tester l'existence des branches indiquées dans le tableau précédent, par ordre de priorité. Ainsi, pour l'environnement de test, si la branche testing n'existe pas, c'est la branche unstable qui sera utilisée et ainsi de suite jusqu'à la branche main. La présence de branches testing ou unstable n'est donc pas indispensable pour déployer l'environnement test ou dev.

### Importer un environnement

*Version supportée : 1.1.0*

```shell
pebbleapp importenv <nom_environnement>
```

Cette commande récupère un environnement pré-configuré sur un serveur distant et le copie dans le fichier *.env.json*.

Environnements disponibles :

| Nom | Description | Commande |
|-----|-------------|----------|
| devonline | Propose une configuration vers un serveur d'authentification en ligne. | `pebbleapp importenv devonline` |

## Release logs

| Version | Mise à jour                                          |
|---------|------------------------------------------------------|
| 1.0     | Création initiale de l'application.                  |
| 1.0.1   | Ajout des arguments `version`, `upgrade`                       |
|         | Mise à jour de la documentation en lançant le programme sans argument |
|         | Correction de bug : initialisation de l'historique du dépôt avec l'argument `create` afin de pouvoir connecter un serveur github |
| 1.0.2   | Correction de bug : démultiplication des fichiers avec l'argument `upgrade` |
| 1.0.3   | Correction de bug : argument `version` non fonctionnel |
| 1.0.4   | Correction de bug : update ne prenait pas en compte les branches détachées (detached HEAD) |
| 1.0.5   | Correction de bug                                   |
| 1.0.6   | Le serveur npm ne démarre plus par défaut à la création d'une application. |
| 1.0.7   | Ajout des arguments `clone` et `deploy` |
| 1.0.8   | Correction de bug : deploy envoyait les fichiers dans un sous-dossier dist. Les environnements n'étaient pas correctement pris en charge |
| 1.1.0   | Création automatique des fichiers .env.json lors des commandes `create`, `update` et `clone`. Ajout de la commande `importenv` |

## Configuration initiale de l'application

Ouvrir le fichier **src/config.json**.

| Clé de configuration      | Type      | Usage                                                                    | Défaut        |
|---------------------------|-----------|--------------------------------------------------------------------------|---------------|
| `name`                    | String    | Nom unique de l'application en snake-case                                | *sample*      |
| `env`                     | String    | Environnement de travail                                                 | *dev*         |
| `cfg.module`              | String    | Nom du module ou de l'application tel que référencé au niveau du serveur | *sample*      |
| `cfg.moduleLabel`         | String    | Nom du module ou de l'application pour l'affichage                       | *Sample Module* |
| `cfg.aside`               | Boolean   | Affiche ou non la barre latérale des raccourcis                          | *true*        |
| `cfg.app_mode`            | String    | *default* : Affichage de l'application avec l'ensemble des éléments d'interface. *standalone* Affichage de l'application avec une interface n'autorisant pas la navigation vers d'autres modules | *default* |
| `cfg.ppp`                 | String    | Mode de fonctionnement général de l'interface : *private* est l'environnement backoffice, *partner* est un environnement backoffice simplifié nécessitant une authentification, *public* ne nécessite pas d'authentification | *private* |
| `cfg.appMenu`             | Array     | Éléments du menu principal de l'application qui seront affichés dans la barre latérale. |     |
| `cfg.appMenu[].label`     | String    | Libellé de l'élément de menu pour l'affichage. |     |
| `cfg.appMenu[].icon`      | String    | Icon de la librairie boostrap icon (début par *bi bi-*) |     |
| `cfg.appMenu[].key`       | String    | Clé unique de l'élément du menu |     |
| `cfg.appMenu[].href`      | String    | Route de l'élément du menu référencé dans le routeur |     |
| `cfg.logos`               | String    | Chemin vers le logo de l'application. Logo Pebble par défaut             | *null*        |
| `cfg.backAction`          | String    | Route pour la flèche de retour                                           | */*           |
| `cfg.backNavigation`      | Boolean   | Affiche ou non la flèche de retour                                       | *true*        |
| `domains.prod`            | String    | Nom de domaine du point d'entré en environement de production.           | *pebble.solutions* |
| `domains.test`            | String    | Nom de domaine du point d'entré en environement de test.           | *pebble.recipes* |
| `domains.dev`             | String    | Nom de domaine du point d'entré en environement de développement.        | *localhost*   |
| `cfgMenu.href`            | String    | Lien du menu de configuration du module. Si null, le module n'a pas de vue de configuration | *null* |
| `cfgSlots.menu`           | Boolean   | Affiche l'espace Menu | *true* |
| `cfgSlots.list`           | Boolean   | Affiche l'espace Liste des éléments chargés | *true* |
| `cfgSlots.core`           | Boolean   | Affiche l'espace principal de l'application | *true* |
| `cfgSlots.header`         | Boolean   | Affiche la barre d'outil en en-tête de l'application | *true* |
| `api`            | Object    | Configuration de l'autentification à l'API. Chaque environement d'exécution dispose d'une configuration (**prod**, **test** et **dev**) | *object* |
| `api[ENV].pas`            | Boolean    | L'environnement utilise Pebble Authenticator Server | *true* |
| `api[ENV].authServer`     | String    | URL d'accès au serveur d'authentification | *auth.pebble.solutions* |
| `api[ENV].tls`            | String    | Le serveur d'authentification est sécurisé (https) | *true* |
| `firebaseConfig`          | Object    | Configuration publique des comptes firebase. Chaque environement d'exécution dispose d'une configuration (**prod**, **test** et **dev**). L'environement *dev* est déjà préconfiguré sur une application sample. Pour l'environnement de production et de test, il faudra référencer l'application dans la console firebase. | *object* |

## Paramétrage du serveur local

Pour un développement local optimal, voici les pré-requis indispensables :

- Vous devez ajouter votre application dans une licence (dev, test ou prod) sur firebase pour pouvoir la démarrer.
- Le serveur NE DOIT PAS nécessiter un certificat SSL (https désactivé, voir https://github.com/cairnmanagement/docker#d%C3%A9sactiver-le-https-du-serveur-de-production)
- La machine locale doit disposer de git et npm (`sudo apt install git npm`)

## Debug
A l'installation, si erreur *Error: ENOSPC: System limit for number of file watchers reached*  
`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`
