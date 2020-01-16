const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const { User } = require('../sequelize');

const api_key = config.get('api_key');
const domain = config.get('domain');
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

const SECOND = 60;
const MINUTE = 60;
const HOUR = SECOND * MINUTE;

router.post(
  '/',
  [
    check('firstName', 'Please enter your first name')
      .not()
      .isEmpty(),
    check('lastName', 'Please enter your last name')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      let user = await User.findOne({ where: { email } });

      if (user) {
        return res.status(403).json({ msg: 'User already exists' });
      }

      user = new User({
        first_name: firstName,
        last_name: lastName,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
        (err, token) => {
          if (err) {
            throw err;
          }

          const url = `http://localhost:3000/confirmation-success/${token}`;

          const data = {
            from: 'Center for International Programs <no-reply@kzoo.edu>',
            // TODO: change this from test email to proper user email address after testing
            to: 'binbinlee918@gmail.com',
            subject: 'Confirm your registration',
            text: `Please confirm your email by clicking this: <a href="${url}">${url}</a>`
          };

          mailgun.messages().send(data, function(error, body) {
            if (error) {
              throw err;
            }
          });

          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send('Server Error');
    }
  }
);

router.put('/confirmation', async (req, res) => {
  try {
    const {
      user: { id }
    } = jwt.verify(req.body.token, config.get('jwtSecret'));

    await User.update({ confirmed: true }, { where: { id } });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
