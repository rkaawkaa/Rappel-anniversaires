# Projet LP Dev Mob Tutoré 2023



## Rappels Anniversaires - Application de rappels des anniversaires de ses proches

Ce projet est une application mobile écrite en React Native qui pourra être déployé sur le Play Store d'Android et l'app Store d'IOS. Il a été développé dans le cadre de la Licence professionnelle Développement Mobile en alternance de l'IUT de la Rochelle. Il a été réalisé par KAWKA Robin qui a pu profité de FAUCHER Cyril, tuteur du projet et de LASSUS Annick, accompagnatrice notamment en interface utilisateur et en gestion de projet.

## Installation du projet

1. Tout d'abord, assurez-vous que vous avez installé Node.js et Expo CLI sur votre machine. Si vous n'avez pas encore installé Expo CLI, vous pouvez l'installer en utilisant la commande suivante dans votre terminal :
```
npm install -g expo-cli
```

2. Clonez le projet à partir de Gitab en utilisant par exemple la commande suivante : 
```
git clone https://forge.iut-larochelle.fr/rkawka/rappel-anniversaires.git
```

3. Accédez au répertoire du projet puis lancer la commande suivante pour installer les dépendances :
```
npm install
```

4. Puis lancer l'application avec la commande : 
```
expo start
```

- Pour lancer sur un téléphone réel, installez l'application Expo Go, lancez-la puis scanner le QR Code fourni après avoir executé la commande expo start.
- Pour lancer l'application sur un émulateur, lancez cette émulateur, puis après avoir executé la commande expo start, appuyer par exemple sur "a" si le téléphone est un android.

## Utilisation

L'application RappelAnniversaires permet aux utilisateurs de créer une liste de contacts avec leurs dates d'anniversaire, de recevoir des messages le jour de l'anniversaire de leurs contacts, de stocker des informations sur les préférences de chaque contact, et de pré-écrire des messages de vœux personnalisés. Cette application est utile pour se souvenir des anniversaires de ses proches et pour organiser des célébrations d'anniversaire inoubliables.

## Fonctionnalités

- Ajouter des contacts avec leur date d'anniversaire
- Modifier ou supprimer des contacts
- Recevoir des messages le jour des anniversaires des contacts
- Consulter la liste des contacts et leurs anniversaires
- Programmer l'envoi de messages prédéfinies et personnalisables (à venir)
- Gérer l'organisation d'une célébration d'anniversaire (à venir)
- Importer les dates d'anniversaires de mes contacts à partir des autres plateformes (à venir)
- Créer son compte utilisateur (à venir)

## Technologies utilisées


- React Native ( avec Asyncstorage )
- Expo ( Expo-ClI, EAS, Expo-SDK, Expo-Client)
- Typescript 
- Firebase avec : 
    - RealTime Database
    - Firebase Cloud Messaging
    - FireBase Cloud Functions
- Twilio

## PS :

Pour plus de renseignements sur les différents outils utilisées pour la gestion de projet, ainsi que pour la documentation technique, n'hésitez pas à consulter le wiki de ce projet GitLab.



