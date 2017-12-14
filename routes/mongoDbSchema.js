﻿
module.exports = function(mongoose) {
    var Schemas = {
        Utilisateur :  new mongoose.Schema({
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                index: true,
                required: true,
                auto: true,
            },
            "nom" : String,
            "nomAlias" : String,
            "Mail" : String,
            "Tel" : String,
            "Commentaire" : String,
            "Password" : String,
            "Droits" : String,
            "baseUrl" : String,
            "UsrCrt" : String,
            "DatCrt" : { type: Date, default: Date.now },
            "UsrUpd" : String,
            "DatUpd" : { type: Date, default: Date.now },
            "nomCivil" : String,
            "PrenomCivil" : String
        }),
        //archivesFiles: db.collection('archives.files'),
        //SunArchives: db.collection('SunArchives'),
        //SunArchivesKeys: db.collection('SunArchives_keys'),
        //idxTable: db.collection('idxTable'),
        idxTable :  new mongoose.Schema({
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                index: true,
                required: true,
                auto: true,
            },
            "index" : String,
            "group" : String,
            "UsrCrt" : String,
            "DatCrt" : { type: Date, default: Date.now },
            "UsrUpd" : String,
            "DatUpd" : { type: Date, default: Date.now }
        }),
        //Todo: db.collection('todo'),
        Client :  new mongoose.Schema({
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                index: true,
                required: true,
                auto: true,
            },
            "IDClientGroupe" : String,
            "Nom" : String,
            "IDClientContact" : String,
            "Mail" : String,
            "Tel" : String,
            "Adresse" : String,
            "Mobile" : String,
            "Fax" : String,
            "FacturableNon" : Number,
            "Bloquer" : Number,
            "DateLastFacture" : String,
            "DureeCumulee" : String,
            "DureeCumuleeFacturer" : String,
            "PathPiecesJointes" : String,
            "Commentaire" : String,
            "UsrCrt" : String,
            "DatCrt" : { type: Date, default: Date.now },
            "UsrUpd" : String,
            "DatUpd" : { type: Date, default: Date.now }
        }),
        Contact :  new mongoose.Schema({
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                index: true,
                required: true,
                auto: true,
            },
            "IDAgence" : String,
            "DateCreation" : String,
            "Nom" : String,
            "Prenom" : String,
            "DateDeNaissance" : String,
            "Mail" : String,
            "Telephone" : String,
            "Portable" : String,
            "Adresse" : String,
            "CodePostale" : String,
            "Ville" : String,
            "ProjetContact" : [String],
            "ExpToXml" : Number,
            "UsrCrt" : String,
            "DatCrt" : { type: Date, default: Date.now },
            "UsrUpd" : String,
            "DatUpd" : { type: Date, default: Date.now }
        }),
        //ClientContact: db.collection('ClientContact'),
        ClientContact :  new mongoose.Schema({
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                index: true,
                required: true,
                auto: true,
            },
            "Nom" : String,
            "Prenom" : String,
            "Tel" : String,
            "Mobile" : String,
            "Mail" : String,
            "Fax" : String,
            "Adresse" :String,
            "FonctionOccupé" : String,
            "Commentaire" : String,
            "UsrCrt" : String,
            "DatCrt" : { type: Date, default: Date.now },
            "UsrUpd" : String,
            "DatUpd" : { type: Date, default: Date.now }
        }),
        //Projet: db.collection('Projet'),
        Projet :  new mongoose.Schema({
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                index: true,
                required: true,
                auto: true,
            },
            "IDClient" : String,
            "IdClientContact" : String,
            "IdUtilisateur" : String,
            "Nom" : String,
            "Etat" : String,
            "TacheMono" : Number,
            "Description" : String,
            "DateDeDebut" : Date,
            "DateDeFin" : String,
            "Priorite" : Number,
            "DateDeDebutPrevue" : String,
            "DateDeFinPrevue" : String,
            "DureePrevue" : String,
            "DureeCumulee" : String,
            "DureeCumuleeFacturer" : String,
            "DevisSousmisA" : String,
            "DevisNumero" : String,
            "DevisNumeroEngagement" : String,
            "DevisDescription" : String,
            "FactureNonSoumisA" : String,
            "FactureFaite" : Number,
            "FactureNumero" : String,
            "FactureDate" : String,
            "FactureNombreJours" : Number,
            "Bloquer" : Number,
            "HistorisationDate" : String,
            "IDTache" : String,
            "PathPiecesJointes" : "",
            "UsrCrt" : String,
            "DatCrt" : { type: Date, default: Date.now },
            "UsrUpd" : String,
            "DatUpd" : { type: Date, default: Date.now }
        }),
        //SuiviPerso: db.collection('SuiviPerso'),
        SuiviPerso :  new mongoose.Schema({
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                index: true,
                required: true,
                auto: true,
            },
            "IDTache" : String,
            "IDUtilisateur" : String,
            "UsrCrt" : String,
            "DatCrt" : { type: Date, default: Date.now },
            "UsrUpd" : String,
            "DatUpd" : { type: Date, default: Date.now }
        }),
        //Tache: db.collection('Tache'),
        Tache :  new mongoose.Schema({
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                index: true,
                required: true,
                auto: true,
            },
            "IDClient" : String,
            "IDClientContact" : String,
            "IDProjet" : String,
            "Nom" : String,
            "Etat" : String,
            "AffichagePour" : String,
            "Detail" : String,
            "SyncroDB" : Number,
            "DevisSousmisA" : String,
            "DevisNumero" : String,
            "DevisDescription" : String,
            "DevisNumeroEngagement" : String,
            "FactureNonSoumisA" : String,
            "FactureFaite" : String,
            "FactureNumero" : String,
            "FactureDate" : Date,
            "FactureNombreJours" : Number,
            "Bloquer" : Number,
            "PathPiecesJointes" : String,
            "DureeCumulee" : String,
            "DureeCumuleeFacturer" : String,
            "Priorite" : Number,
            "DateDeDebutPrevue" : String,
            "DateDeFinPrevue" : String,
            "DureePrevue" : String,
            "DateDeDebut" : String,
            "DateDeFin" : String,
            "IDUtilisateur" : String,
            "UsrCrt" : String,
            "DatCrt" : { type: Date, default: Date.now },
            "UsrUpd" : String,
            "DatUpd" : { type: Date, default: Date.now }
        }),
        //Temps: db.collection('Temps'),
        Temps :  new mongoose.Schema({
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                index: true,
                required: true,
                auto: true,
            },
            "IDType" : String,
            "IDClient" : String,
            "IDClientContact" : String,
            "IDProjet" : String,
            "IDTache" : String,
            "IDUtilisateur" : String,
            "AffichagePour" : String,
            "Commentaire" : String,
            "Lieu" : String,
            "DateDebut" : String,
            "HeureDebut" : String,
            "DateFin" : String,
            "HeureFin" : String,
            "DureeCalculee" : String,
            "DuréeFacturé" : String,
            "FactureNonSoumisA" : String,
            "FactureFaite" : Number,
            "FactureNumero" : String,
            "DevisNumero" : String,
            "NonSupprimable" : Number,
            "SyncroDB" : Number,
            "ChronoEnCours" : Number,
            "Remarques" : String,
            "UsrCrt" : String,
            "DatCrt" : { type: Date, default: Date.now },
            "UsrUpd" : String,
            "DatUpd" : { type: Date, default: Date.now }
        }),
        //Parametres: db.collection('Parametres'),
        Parametres :  new mongoose.Schema({
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                index: true,
                required: true,
                auto: true,
            },
            "nom" : String,
            "group" : String,
            "valeur" : String,
            "UsrCrt" : String,
            "DatCrt" : { type: Date, default: Date.now },
            "UsrUpd" : String,
            "DatUpd" : { type: Date, default: Date.now }
        }),
        iaTchatLog :  new mongoose.Schema({
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                index: true,
                required: true,
                auto: true,
            },
            "user" : String,
            "texte" : String,
            "date" : { type: Date, default: Date.now },
            "ipAdress" : String
        }),
        //sessions: db.collection('sessions'),
        Sessions :  new mongoose.Schema({
            "_id": String,
            "session" : mongoose.Schema.Types.Mixed,
            "expires" : Date,
            "userid" : String,
            "uuid" : String,
            "timestamp" : Date,
            "state" : String,
            "type" : String,
            "baseUrl" : String,
            "userName" : String
        }),
        //SunArchives: db.collection('SunArchives'),
        SunArchives :  new mongoose.Schema({
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                index: true,
                required: true,
                auto: true,
            },
            "ARCJNAM" : String,
            "ARCJUSR" : String,
            "ARCJNBR" : String,
            "ARCFNAM" : String,
            "ARCSTK" : String,
            "SYSTEM" : String,
            "ARCDATC" : String,
            "ARCTIMC" : String,
            "Type Format" : String,
            "NbPages" : String,
            "Type Archive" : String,
            "Type Extension" : String,
            "ARCDOC" : String,
            "Chemin_acces" : String,
            "file" : String,
            "index" : mongoose.Schema.Types.Mixed,
            "ARCPTAR" : String,
            "INDEXCHECKED" : String,
            "UsrUpd" : String,
            "DatUpd" : { type: Date, default: Date.now }
        }),
        archivesFiles :  new mongoose.Schema({
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                index: true,
                required: true,
                auto: true,
            },
            "contentType" : String,
            "length" : Number,
            "chunkSize" : Number,
            "uploadDate" : Date,
            "md5" : String,
            "aliases" : String,
            "metadata" : String,
            "filename" : String
        })  
      };
      var collections = {
        Utilisateur : mongoose.model('Utilisateur', Schemas.Utilisateur, 'utilisateurs'),
        idxTable : mongoose.model('idxTable', Schemas.idxTable, 'idxTable'),
        Client : mongoose.model('Client', Schemas.Client, 'Client'),
        Contact : mongoose.model('Contact', Schemas.Contact, 'Contact'),
        ClientContact : mongoose.model('ClientContact', Schemas.ClientContact, 'ClientContact'),
        Projet : mongoose.model('Projet', Schemas.Projet, 'Projet'),
        SunArchives : mongoose.model('SunArchives', Schemas.SunArchives, 'SunArchives'),
        archivesFiles : mongoose.model('archivesFiles', Schemas.archivesFiles, 'fs.files'),
        Temps : mongoose.model('Temps', Schemas.Temps, 'Temps'),
        Tache : mongoose.model('Tache', Schemas.Tache, 'Tache'),
        Parametres : mongoose.model('Parametres', Schemas.Parametres, 'Parametres'),
        iaTchatLog : mongoose.model('iaTchatLog', Schemas.iaTchatLog, 'iaTchatLog'),
        Session : mongoose.model('Sessions', Schemas.Sessions, 'sessions')
    };

      return collections;
};