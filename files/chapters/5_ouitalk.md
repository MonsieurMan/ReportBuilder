# Ouitalk

Ouitalk, initialement train-train, est ma première réel expérience de développement. J'ai travaillé seul et en autonomie sur le sujet ormis pour une refonte du design sur laquelle Kevin m'a aidé.

## Contexte

### Hackathon mobilité

Dans les faits, cette application ne s'inscrit pas dans le cadre métier du technicentre. Les problèmatiques dont elle traite ont été soulevé lors d'un hackathon au début de l'année 2017.  

C'était une initiative de mon tuteur de l'époque, Fabien Chanoit, et de mon chef d'établissement, Sylvain Miguet, que de développer un prototype dans le but d'explorer le champ des possibles et dans l'optique de le proposer pour la nouvelle convention TER BFC 2018.

### Convention TER

L'année 2017 était un contexte particulier pour la SNCF dans la région Bourgogne Franche Comté, celui de la signature d'une nouvelle convention TER.  

J'en ai omis les détails dans la présentation de l'entreprise, mais l'organisation des TER et particulière. Il s'agit d'une convention au niveau régional entre la région et la SNCF qui définit le rôles et mission de chacun. La région est l'autorité organisatrice, elle définit l'offre qu'elle souhaite, dessertes, qualités de services, horaires, tarification, etc... La SNCF en assure ensuite la réalisation.  

### Problématique

Les problèmatiques de Ouitalk sont centrées sur un sujet, la communication, aussi bien entre voyageurs qu'avec l'exploitant. Le hackathon en lui même prévoyait beaucoup plus large mais travaillant seul, il a été choisie de réduire quelques peu.  

C'est donc dans l'optique d'avoir une meilleur visibilité de l'opinion client et de créer une atmosphère d'échange qu'a était développé Ouitalk.  

## Solution choisie

Le choix de la solution technique a été en réalité très rapide, c'est guidé par un de mes collègues alternant Christophe Chuy, que j'ai utiliser Ionic pour développer l'application.

L'objectif étant de développé un prototype le plus rapidement possible, et n'ayant alors aucune éxpérience, utiliser une technologie connue de mes collègues me permettait d'avancer plus rapidement en cas de bloquage. De plus l'avantage de Ionic est qu'il permet de développer aussi bien une application web qu'une application native qu'il est ensuite possible d'installer, j'y voyais la un avantage en souplesse.

## Fonctionnalité

### Client

Voici le diagramme des cas d'utilisation, *simplifié*, de l'application mobile que j'ai donc développé.

![Ouitalk - Application mobile](./assets/usecase/ouitalk-client.png)  

L'application contient en réalité plus de fonctionnalité que je ne détaillerai pas exhaustivement dans ce rapport sachant qu'elle découle de ces fonctionnalités principales.

Un parcours type de l'application:

- L'utilisateur se connecte
- Recherche une gare
- Sélectionne un départ
- Consulte ou Poste avis

Ci-dessous une capture d'écran de l'application vu par un client.

![Ouitalk - Liste des trains au départs de Joigny](./assets/screenshots/ouitalk.png)

### Partie admin

De plus, une partie de supervision de l'application a été imaginé, elle aurait permis, comme le montre le diagramme ci-dessous, de modérer les commentaires, ce qui est une obligation légale, mais aussi une partie pour l'autorité organisatrice.  

Dans l'idée, il s'agissait de donner à la région, un indicateur de santé sur ses lignes en appliquant le résultat des notes des avis sur une carte, de permettre d'afficher un bandeau d'annonce par train et enfin la gestion des demandes de remboursements.

![Ouitalk - Back office](./assets/usecase/ouitalk-admin.png)  

## Réunion du 26/10/18

Le 26 octobre, nous avons eu une réunion de présentation puis de réflexion sur l'application.  

Il s'est avérer, après discussion avec les personnes en charges de la mesure de la satisfaction client et qualité, que l'outil que nous proposions avec les avis n'était en fait pas valable d'un point de vu statistique et que le travail de gestion et de modération qu'il demander n'entrer pas dans le cadre de ce qu'il était possible de faire.

Il restait alors la partie chat par train et le remboursement qui sont resté en question.  

Le fait est qu'il est compliqué pour l'heure de répondre à la question du remboursement du fait de vieux processus ou d'autre inexistant.  

Des échanges par mail on continué à ce sujet par la suite mais rien ne fut concluant. Le projet à donc été suspendu.

## Bilan technique

Pour avoir une vision plus globale du travail que j'ai réalisé, voici un diagramme de l'architecture du projet à la fin.

![Ouitalk - Architecture](./assets/ouitalk-architecture.png)

Tout ce que vous pouvez voir sur ce diagrame était hébergé sur un serveur virtuel chez OVH, ormis gitlab qui à sa propre infrastructure.

### Versionnage

J'ai utilisé git pour le versionnage du code, et plus particuliérement gitlab, qui est, à la manière de github, un serveur github proposant une interface web et toute une palette de fonctionnalité autours.  

Comme le diagramme ci-dessus le montre, je me suis servi d'une en particulier, les web hooks.

Tout simplement, j'ai configuré gitlab, pour envoyer une requète http à chaque fois que j'ajoute du code au repository.

### Déploiement automatique

![Ouitalk - Application mobile](./assets/ouitalk-user-use-case.svg)  

J'ai donc décidé d'en automatiser le processus. Par la création d'un serveur de déploiement automatique qui fonctionnait de la manière suivante.

![Ouitalk - Back office](./assets/ouitalk-admin-use-case.svg)  

Comme je l'ai dit précédemment, j'ai configurer gitlab pour envoyer une requête à chaque changement, la requête est ensuite réceptionner par le serveur de déploiement automatique qui sait qu'il faut mettre à jour le projet pour lequelle il à reçu une requête. La mise à jour se faisant comme suit.

- clonage du code source disponible sur gitlab
- lancement du script `install.sh`
- arrêt de l'ancienne version
- lancement de la nouvelle version

![Ouitalk - Liste départs gare](./assets/ouitalk.png)

<!-- TODO: parcour utilisateur -->
