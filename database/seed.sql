USE MELO;
GO

-- Genres
INSERT INTO Genre (nom_genre)
VALUES
    (N'Rap'),
    (N'Pop'),
    (N'R&B'),
    (N'Rock'),
    (N'Jazz');

-- Artistes
INSERT INTO Artiste (nom_artiste, pays)
VALUES
    (N'PNL', N'France'),
    (N'Damso', N'Belgique'),
    (N'The Weeknd', N'Canada'),
    (N'Frank Ocean', N'États-Unis');

-- Albums
INSERT INTO Album
    (titre_album, date_sortie, id_genre, id_artiste)
VALUES
    (N'Deux frères', '2019-04-05',
        (SELECT id_genre FROM Genre WHERE nom_genre = N'Rap'),
        (SELECT id_artiste FROM Artiste WHERE nom_artiste = N'PNL')),

    (N'Ipséité', '2017-04-28',
        (SELECT id_genre FROM Genre WHERE nom_genre = N'Rap'),
        (SELECT id_artiste FROM Artiste WHERE nom_artiste = N'Damso')),

    (N'After Hours', '2020-03-20',
        (SELECT id_genre FROM Genre WHERE nom_genre = N'Pop'),
        (SELECT id_artiste FROM Artiste WHERE nom_artiste = N'The Weeknd')),

    (N'Blonde', '2016-08-20',
        (SELECT id_genre FROM Genre WHERE nom_genre = N'R&B'),
        (SELECT id_artiste FROM Artiste WHERE nom_artiste = N'Frank Ocean'));

-- Morceaux
INSERT INTO Morceau
    (titre_morceau, duree, numero_piste, id_album)
VALUES
    (N'Au DD', 247, 1,
        (SELECT id_album FROM Album WHERE titre_album = N'Deux frères')),

    (N'Naha', 0 + 240, 1,
        (SELECT id_album FROM Album WHERE titre_album = N'Deux frères'))
;