const express = require("express");
const employeesController = require("../../controllers/employeesController");
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(
    verifyRoles(ROLES_LIST.SuperAdmin, ROLES_LIST.Admin, ROLES_LIST.User),
    employeesController.getAllEmployees
  )
  .post(
    verifyRoles(ROLES_LIST.SuperAdmin, ROLES_LIST.Admin),
    employeesController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.SuperAdmin, ROLES_LIST.Admin),
    employeesController.updateEmployee
  )
  .delete(
    verifyRoles(ROLES_LIST.SuperAdmin, ROLES_LIST.Admin),
    employeesController.deleteEmployee
  );

router
  .route("/:id")
  .get(
    verifyRoles(ROLES_LIST.SuperAdmin, ROLES_LIST.Admin, ROLES_LIST.User),
    employeesController.getEmployee
  );

module.exports = router;
