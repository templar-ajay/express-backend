const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.role) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];

    console.log("roles Array", rolesArray);
    console.log("req.role", req.role);

    const result = rolesArray.includes(req.role);
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
