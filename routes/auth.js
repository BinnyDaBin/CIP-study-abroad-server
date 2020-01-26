const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const _ = require('lodash');

const { User } = require('../sequelize');

const SECOND = 60;
const MINUTE = 60;
const HOUR = SECOND * MINUTE;

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findAll({
      where: {
        id: req.user.id
      },
      attributes: {
        exclude: ['password']
      }
    });

    const userData = _.transform(user[0].dataValues, (normalizedUserData, value, key) => {
      const normalizedKey = _.camelCase(key);
      normalizedUserData[normalizedKey] = value;
      return normalizedUserData;
    }, {});

    res.json(userData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ msg: 'Invalid Credentials' });
      }

      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        return res.status(401).json({ msg: 'Invalid Credentials' });
      }

      if (!user.confirmed) {
        return res.status(400).json({ msg: 'Email Confirmation Error' });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: HOUR
        },
        (error, token) => {
          if (error) {
            throw error;
          }

          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
