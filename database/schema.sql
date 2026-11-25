USE MELO;
GO

CREATE TABLE Utilisateur (
    id_utilisateur INT IDENTITY(1,1) PRIMARY KEY,
    pseudo NVARCHAR(50) NOT NULL UNIQUE,
    email NVARCHAR(180) NOT NULL UNIQUE,
    mot_de_passe NVARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    date_inscription DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CHECK (role IN ('ROLE_USER', 'ROLE_ADMIN'))
);

CREATE TABLE Artiste (
    id_artiste INT IDENTITY(1,1) PRIMARY KEY,
    nom_artiste NVARCHAR(100) NOT NULL,
    biographie NVARCHAR(MAX),
    photo_artiste NVARCHAR(255),
    pays NVARCHAR(100)
);

CREATE TABLE Genre (
    id_genre INT IDENTITY(1,1) PRIMARY KEY,
    nom_genre NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Playlist (
    id_playlist INT IDENTITY(1,1) PRIMARY KEY,
    nom_playlist NVARCHAR(100) NOT NULL,
    description_playlist NVARCHAR(MAX),
    date_creation DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    visibilite BIT NOT NULL DEFAULT 0,
    id_utilisateur INT NOT NULL,
    FOREIGN KEY (id_utilisateur)
        REFERENCES Utilisateur(id_utilisateur)
);

CREATE TABLE Album (
    id_album INT IDENTITY(1,1) PRIMARY KEY,
    titre_album NVARCHAR(150) NOT NULL,
    date_sortie DATE,
    pochette NVARCHAR(255),
    description_album NVARCHAR(MAX),
    id_genre INT NOT NULL,
    id_artiste INT NOT NULL,
    FOREIGN KEY (id_genre)
        REFERENCES Genre(id_genre),
    FOREIGN KEY (id_artiste)
        REFERENCES Artiste(id_artiste)
);

CREATE TABLE Avis (
    id_avis INT IDENTITY(1,1) PRIMARY KEY,
    note TINYINT NOT NULL CHECK (note BETWEEN 1 AND 5),
    commentaire NVARCHAR(MAX),
    date_publication DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    id_album INT NOT NULL,
    id_utilisateur INT NOT NULL,
    FOREIGN KEY (id_album)
        REFERENCES Album(id_album),
    FOREIGN KEY (id_utilisateur)
        REFERENCES Utilisateur(id_utilisateur),
    UNIQUE (id_album, id_utilisateur)
);

CREATE TABLE Morceau (
    id_morceau INT IDENTITY(1,1) PRIMARY KEY,
    titre_morceau NVARCHAR(150) NOT NULL,
    duree INT NOT NULL CHECK (duree > 0),
    numero_piste INT NOT NULL CHECK (numero_piste > 0),
    id_album INT NOT NULL,
    FOREIGN KEY (id_album)
        REFERENCES Album(id_album)
);

CREATE TABLE Favoris_Album (
    id_utilisateur INT NOT NULL,
    id_album INT NOT NULL,
    date_ajout DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    PRIMARY KEY (id_utilisateur, id_album),
    FOREIGN KEY (id_utilisateur)
        REFERENCES Utilisateur(id_utilisateur),
    FOREIGN KEY (id_album)
        REFERENCES Album(id_album)
);

CREATE TABLE Favoris_Morceau (
    id_utilisateur INT NOT NULL,
    id_morceau INT NOT NULL,
    date_ajout DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    PRIMARY KEY (id_utilisateur, id_morceau),
    FOREIGN KEY (id_utilisateur)
        REFERENCES Utilisateur(id_utilisateur),
    FOREIGN KEY (id_morceau)
        REFERENCES Morceau(id_morceau)
);

CREATE TABLE Composer (
    id_morceau INT NOT NULL,
    id_playlist INT NOT NULL,
    date_ajout DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    position_ INT NOT NULL CHECK (position_ > 0),
    PRIMARY KEY (id_morceau, id_playlist),
    FOREIGN KEY (id_morceau)
        REFERENCES Morceau(id_morceau),
    FOREIGN KEY (id_playlist)
        REFERENCES Playlist(id_playlist),
    UNIQUE (id_playlist, position_)
);
GO