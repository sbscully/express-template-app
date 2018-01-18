const {
  request,
  app,
  expect,
  cheerio,
} = require('../../helper');

describe('Hello World!', () => {
  beforeEach(async () => {
    this.app = app();
  });

  describe('GET /', () => {
    it('display "Hello World!"', async () => {
      const response = await request(this.app)
        .get('/')
        .expect(200);
      const $ = cheerio.load(response.text);

      expect($('h1').text()).to.include('Hello World!');
    });
  });
});
