const parseError = (error, accepts) => {
  let messages;

  if (process.env.NODE_ENV === 'development' && accepts !== 'json') {
    messages = error.stack;
  } else if (error.array) {
    messages = error.array().map(item => `${item.param} ${item.msg}`);
  } else {
    messages = [];
  }

  return {
    status: error.status,
    messages,
  };
};

// 500 error handler must have an arity of 4
// eslint-disable-next-line no-unused-vars
const handler = (err, req, res, next) => {
  const accepts = req.accepts(['json', 'html']);
  const params = parseError(err, accepts);

  res.status(err.status || 500);

  if (accepts === 'json') {
    res.json({ status: params.status, errors: params.messages });
  } else {
    res.render('error', params);
  }
};

module.exports = {
  handler,
};
