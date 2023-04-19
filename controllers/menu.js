// Recupere le shcéma donc on récupére mangoose ensuite on vérifie les requete, la fonction create construit les requete qu'on a recu , on créer un objet et aprés sauvegarder dans la base de donnée

// Import du modèle student
var Menu = require("../models/menu");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const menuValidationRules = () => {
    return [    
            body('name')
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage('Name must be specified.')
            .isAlphanumeric()
            .withMessage('Name has non-alphanumeric characters.'),
          body('frite')
            .isBoolean()
            .withMessage('Frite must be a boolean value.'),
          body('price')
            .isNumeric()
            .withMessage('Price must be a number.')
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
exports.create = [bodyIdValidationRule(), menuValidationRules(), checkValidity, (req, res, next) => {
    
    // Création de la nouvelle instance de student à ajouter 
    var menu = new Menu({
        _id: req.body.id,
        name: req.body.name,
        frite: req.body.frite,
        price: req.body.price,
        fastfood: req.body.fastfood,
      });

    // Ajout de student dans la bdd 
    menu.save(function (err) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(201).json("Menu created successfully !");
    });
}];

// Read
exports.getAll = (req, res, next) => {
  Menu.find()
  .populate("fastfood")
    .then(menus => {
      // Vérifier s'il y a un paramètre de requête `fastFoodId`
      if (req.query.fastFoodId) {
        // Filtrer les menus par `fastFoodId`
        menus = menus.filter(menu => menu.fastFoodId == req.query.fastFoodId);
      }
      res.status(200).json(menus);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: error
      });
    });
};

exports.getById = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Menu.findById(req.params.id)
    .populate("fastfood")
    .exec(function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(200).json(result);
    });
}];

// Update
exports.update = [paramIdValidationRule(), menuValidationRules(), checkValidity,(req, res, next) => {
    
    // Création de la nouvelle instance de student à modifier 
    var menu = new Menu({
        _id: req.body.id,
        name: req.body.name,
        frite: req.body.frite,
        price: req.body.price,
        fastfood: req.body.fastfood,
      });

      Menu.findByIdAndUpdate(req.params.id, menu, function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        if(!result){
            res.status(404).json("Menu with id "+req.params.id+" is not found !");
        }
        return res.status(201).json("Menu updated successfully !");
      });
}];

// Delete
exports.delete = [paramIdValidationRule(), checkValidity,(req, res, next) => {
    Menu.findByIdAndRemove(req.params.id).exec(function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        if(!result){
            res.status(404).json("Menu with id "+req.params.id+" is not found !");
        }
        return res.status(200).json("Menu deleted successfully !");
      });
}];