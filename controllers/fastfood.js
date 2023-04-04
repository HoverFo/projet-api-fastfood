// Recupere le shcéma donc on récupére mangoose ensuite on vérifie les requete, la fonction create construit les requete qu'on a recu , on créer un objet et aprés sauvegarder dans la base de donnée

// Import du modèle student
var Fastfood = require("../models/fastfood");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const fastfoodValidationRules = () => {
    return [   
        body("name")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Name must be specified.")
            .isAlphanumeric()
            .withMessage("Name has non-alphanumeric characters."),

        body("description")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Name must be specified.")
        .isAlphanumeric()
        .withMessage("Name has non-alphanumeric characters."),
    ]
}

const paramIdValidationRule = () => {
    return [
        param("id")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Id must be specified.")
            .isNumeric()
            .withMessage("Id must be a number.")
    ]
};

const bodyIdValidationRule = () => {
    return [
        body("id")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Id must be specified.")
            .isNumeric()
            .withMessage("Id must be a number.")
    ]
};

// Méthode de vérification de la conformité de la requête  
const checkValidity = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(400).json({
        errors: extractedErrors,
    })
}

// Create
exports.create = [bodyIdValidationRule(), fastfoodValidationRules(), checkValidity, (req, res, next) => {
    
    // Création de la nouvelle instance de student à ajouter 
    var fastfood = new Fastfood({
        _id: req.body.id,
        name: req.body.name,
        description: req.body.description,
      });

    // Ajout de student dans la bdd 
    fastfood.save(function (err) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(201).json("Fastfood created successfully !");
    });
}];

// Read
exports.getAll = (req, res, next) => {
    Fastfood.find(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(result);
    });
};

exports.getById = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Fastfood.findById(req.params.id).exec(function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(200).json(result);
    });
}];

// Update
exports.update = [paramIdValidationRule(), fastfoodValidationRules(), checkValidity,(req, res, next) => {
    
    // Création de la nouvelle instance de student à modifier 
    var fastfood = new Fastfood({
        _id: req.body.id,
        name: req.body.name,
        description: req.body.description,
      });

      Fastfood.findByIdAndUpdate(req.params.id, fastfood, function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        if(!result){
            res.status(404).json("Fastfood with id "+req.params.id+" is not found !");
        }
        return res.status(201).json("Fastfood updated successfully !");
      });
}];

// Delete
exports.delete = [paramIdValidationRule(), checkValidity,(req, res, next) => {
    Fastfood.findByIdAndRemove(req.params.id).exec(function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        if(!result){
            res.status(404).json("Fastfood with id "+req.params.id+" is not found !");
        }
        return res.status(200).json("Fastfood deleted successfully !");
      });
}];