Voici un guide complet pour installer, configurer et lancer le projet **R6.05-Project** avec Hapi, MySQL via Docker, RabbitMQ, et Swagger. Ce guide inclut également la création d'un utilisateur admin en base de données et l'utilisation de RabbitMQ.

---

# Guide d'installation et de démarrage du projet R6.05-Project

## 1. Cloner le projet
Clonez le projet depuis GitHub en utilisant l'une des commandes suivantes :

### Via SSH :
```bash
git clone git@github.com:RAbdGen/R6.05-Project.git
```

### Via HTTPS :
```bash
git clone https://github.com/RAbdGen/R6.05-Project.git
```

Accédez au dossier du projet :
```bash
cd R6.05-Project
```

---

## 2. Installer les dépendances
Installez toutes les dépendances du projet avec npm :
```bash
npm install
```
Créez un fichier `.env` à la racine du projet et ajoutez les variables d'environnement suivantes :
```env
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=garland.goodwin@ethereal.email
SMTP_PASSWORD=xxz7ZCwskrKK5sddYn
EMAIL_FROM="Project-R6.05 <garland.goodwin@ethereal.email>"
```
---

## 3. Lancer MySQL avec Docker
Le projet utilise MySQL via Docker. Pour démarrer un conteneur MySQL, exécutez la commande suivante :

```bash
docker run -d --name hapi-mysql -p 3307:3306 -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user mysql:8.0 --default-authentication-plugin=mysql_native_password
```

Cela va :
- Créer un conteneur Docker nommé `hapi-mysql`.
- Exposer le port `3307` sur votre machine (MySQL écoute sur le port `3306` dans le conteneur).
- Définir le mot de passe root (`hapi`) et créer une base de données nommée `user`.

---

## 4. Démarrer le projet
Démarrez le serveur Hapi avec la commande suivante :
```bash
npm start
```

Le serveur sera accessible à l'adresse : `http://localhost:3000`.

---

## 5. Accéder à Swagger
Une fois le serveur démarré, accédez à l'interface Swagger pour explorer les routes de l'API :
```
http://localhost:3000/documentation
```

---

## 6. Ajouter un utilisateur admin en base de données
Pour ajouter un utilisateur admin en base de données, connectez-vous au conteneur MySQL et exécutez les commandes SQL suivantes :

1. **Se connecter au conteneur MySQL :**
   ```bash
   docker exec -it hapi-mysql mysql -u root -p
   ```
   Entrez le mot de passe : `hapi`.

2. **Sélectionner la base de données `user` :**
   ```sql
   USE user;
   ```

3. **Insérer l'utilisateur admin :**
   ```sql
   INSERT INTO users (id, firstname, lastname, email, username, password, roles) 
   VALUES (1, 'John', 'Doe', 'john@doe.fr', 'johndoe', 'password', '["admin"]');
   ```

    - `id` : 1
    - `firstname` : John
    - `lastname` : Doe
    - `email` : john@doe.fr
    - `username` : johndoe
    - `password` : password
    - `roles` : `["admin"]`

4. **Vérifier l'insertion :**
   ```sql
   SELECT * FROM users;
   ```

---

## 7. Installer et configurer RabbitMQ

### Sur Linux (ou WSL) :
1. **Mettre à jour les paquets :**
   ```bash
   sudo apt update
   ```

2. **Installer RabbitMQ :**
   ```bash
   sudo apt install rabbitmq-server
   ```

3. **Démarrer et activer RabbitMQ :**
   ```bash
   sudo systemctl enable rabbitmq-server
   sudo systemctl start rabbitmq-server
   ```

4. **Installer Erlang (si nécessaire) :**
   ```bash
   sudo apt install erlang
   ```

5. **Installer la bibliothèque `amqplib` pour Node.js :**
   ```bash
   npm install amqplib
   ```

6. **Démarrer le worker RabbitMQ :**
   ```bash
   node workers/exportWorker.js
   ```

7. **Accéder à l'interface web de RabbitMQ :**
   Ouvrez votre navigateur et allez à l'adresse :
   ```
   http://localhost:15672
   ```
    - Identifiant : `guest`
    - Mot de passe : `guest`

---

## 8. Tester l'API avec Swagger

1. **Connectez-vous avec l'utilisateur admin :**
    - Utilisez la route `POST /user/login` dans Swagger.
    - Entrez les informations de l'utilisateur `john@doe.fr` / `password`.
    - Copiez le token renvoyé dans la réponse.

2. **Ajouter le token dans Swagger :**
    - En haut de la page Swagger, cliquez sur le bouton "Authorize".
    - Entrez `Bearer TOKENXXX` (remplacez `TOKENXXX` par le token copié).

3. **Tester les routes :**
   Vous pouvez maintenant tester toutes les routes de l'API en utilisant Swagger.

---

Si vous avez des questions ou des problèmes, n'hésitez pas à me contacter sur mon adresse e-mail : `renaud.abdellougenestier@etu.unilim.fr`
