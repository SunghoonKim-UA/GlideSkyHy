var chai = require('chai')
  , chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);

var expect = chai.expect;

describe('express_request_example', () => {
  it('should fail current glider without params', function() {
    //
    chai.request(app)
      .get('/glider/getCurrGlider')
      .end(function (err, res) {
         expect(res).to.have.status(500);
    });
  });
});
describe('express_request_example2', () => {
  // lat_s: 32, lat_e: 33, lng_s: -112, lng_e: -109
  it('should get current glider list', function() {
    chai.request(app)
      .get('/glider/getCurrGlider?lat_s=32&lat_e=33&lng_s=-112&lng_e=-109')
      .end(function (err, res) {
          console.log("res:"+res);
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.not.be.null;
          expect(res).to.be.an(array);
    });
  });
});
