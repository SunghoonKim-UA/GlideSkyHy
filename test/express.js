var chai = require('chai')
  , chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);

var expect = chai.expect;

const mongoose = require('mongoose');
const glider = mongoose.model('glider');

describe('express_request_example', () => {
  it('should fail current glider without params', function(done) {
    //
    chai.request(app)
      .get('/glider/getCurrGlider')
      .end(function (err, res) {
         expect(res).to.have.status(500);
         done();
    });
  });
});
describe('express_request_example2', () => {
  // lat_s: 32, lat_e: 33, lng_s: -112, lng_e: -109
  it('should get current glider list', function(done) {
    chai.request(app)
      .get('/glider/getCurrGlider?lat_s=32&lat_e=33&lng_s=-112&lng_e=-109')
      .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.not.be.null;
          expect(res).to.be.an('object'); // output type is a object
          // expect(res.body).to.have.include('location'); // output's root node is location
          done();
    });
  });
});

describe('signup test', () => {
  it('duplicated id', function(done) {
    chai.request(app)
      .post('/user/signup')
      .type('form')
      .send({
        'new_name': 'sunghoon'
      })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body.msg).to.include('Choose another username');
        done();
    });
  });
  it('success to save new user', function(done) {
    chai.request(app)
        .post('/user/signup')
        .type('form')
        .send({
          'new_name': 'sunghoon_test',
          'new_passwd': 'hoihoi',
          'new_color': '#FFFFFF'
        })
        .end(function (err, res) {
          console.log("log at test scripts?");
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.msg).to.equal('');
          expect(res).to.not.be.null;

          // to test repeatedly, remove test data.
          glider.findOneAndDelete({ user_name: 'sunghoon_test' }, function(err, doc){
            if(!err) {
              expect(doc.user_name).to.equal("sunghoon_test");
            }
            console.log("Data deleted"); // Success
            done();
          });
        });
  });
});
