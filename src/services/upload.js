const _ = require('lodash');
const multer = require('multer');
const cloudinary = require('cloudinary');

const storage = multer.diskStorage({ destination: '/tmp/uploads' });
const upload = multer({ storage, fileSize: 3e7 });

const brackets = /(\[|\])/;

module.exports = {
  files(name) {
    return upload.fields([{ name, maxCount: 1 }]);
  },
  async parse(req, param) {
    const [name, field] = param.split(brackets).filter(string => !string.match(brackets));
    const attrs = req.body[name];
    const file = req.files && req.files[`${name}[${field}]`];

    if (file) {
      attrs[field] = await this.url(file);
    }

    return attrs;
  },
  url(files) {
    const file = files[0];

    return new Promise((resolve, reject) => {
      try {
        cloudinary.uploader.upload(file.path, (result) => {
          resolve(result.public_id);
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  image(id, options = {}) {
    const defaults = {
      width: 100,
      height: 100,
      crop: 'fill',
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
      sign_url: true,
    };

    return cloudinary.url(id, _.defaults(options, defaults));
  },
  proxy(url, options = {}) {
    const defaults = {
      type: 'fetch',
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
    };

    return cloudinary.url(url, _.defaults(options, defaults));
  },
};
