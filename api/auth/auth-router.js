const bcrypt = require("bcryptjs");
const router = require("express").Router();
const { checkUsernameExists, validateRoleName } = require('./auth-middleware');
const { JWT_SECRET } = require("../secrets"); // use this secret!
const tokenBuilder = require("./token-builder");
const Users = require("../users/users-model");

router.post("/register", validateRoleName, (req, res, next) => {
  const rounds = process.env.BCRYPT_ROUNDS || 8;
  const hash = bcrypt.hashSync(user.password, rounds);

  user.password = hash;
  Users.add(user)
    .then((saved) => {
      res.status(201).json({ message: `great to have you, ${saved.username}` });
    })
    .catch(next);
});


router.post("/login", checkUsernameExists, (req, res, next) => {
  const { username, password } = req.body;
  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = tokenBuilder(user);
        res.status(200).json({ message: `${user.username} is back!`, token });
      } else {
        next({ status: 401, message: "Invalid Credentials" });
      }
    })
    .catch(next);
});

module.exports = router;
