module.exports = {
  "extends": "airbnb-base",
  "env": {
    "jest": true,
  },
  "rules": {
    "no-use-before-define": ["error", { "functions": false, "classes": true }],
    "no-underscore-dangle": ["error", { "allow": ["_id"] }],
    "max-len": ["error", { "code": 130 }],
    "import/prefer-default-export": 0,
  }
};
