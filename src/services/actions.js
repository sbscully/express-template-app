const _ = require('./utils');

// express middleware adds the `action` function to the response to cut down on
// rendering boilerplate
const actions = ({ views, layout }) =>
  (req, res, next) => {
    res.action = (name, options = {}) => {
      const defaults = {
        layout,
        router: _.last(views.split('/')),
        view: name,
      };

      res.render(`${views}/${name}`, Object.assign(defaults, options));
    };

    next();
  };

module.exports = actions;
