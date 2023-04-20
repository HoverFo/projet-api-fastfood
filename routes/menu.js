
// (Étape 1) Import de express
var express = require('express');

// (Étape 1) Définition du router
var router = express.Router();

// Import du Contrôleur menu
var menu_controller = require("../controllers/menu");

// (Étape 2) Ajout de la route qui permet d'ajouter un étudiant
router.post("/", menu_controller.create);

// (Étape 2) Ajout de la route qui permet d'afficher tous les étudiants
router.get("/", menu_controller.getAll);

router.get("/", menu_controller.getFastFoodMenus);


// (Étape 2) Ajout de la route qui permet d'afficher un seul étudiant grâce à son identifant
router.get("/:id", menu_controller.getById);

// (Étape 2) Ajout de la route qui permet de modifier un seul étudiant grâce à son identifant
router.put("/:id", menu_controller.update);

// (Étape 2) Ajout de la route qui permet de supprimer un seul étudiant grâce à son identifant
router.delete("/:id", menu_controller.delete);

// (Étape 1) Export du router
module.exports = router;