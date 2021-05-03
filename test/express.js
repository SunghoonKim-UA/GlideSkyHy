var chai = require('chai')
  , chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);

var expect = chai.expect;

const mongoose = require('mongoose');
const glider = mongoose.model('glider');
const flight = mongoose.model('flight');
const location = mongoose.model('location');
const realtime_tracking = mongoose.model('realtime_tracking_db');

describe('express response test_false case', () => {
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

describe('express response test_normal case', () => {
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

describe('/user/flightHistory', () => {
  it('get flight record', function(done) {
    // get a flight arbitrary
    flight.findOne({}, function(err, doc){

        chai.request(app)
          .get('/user/flightHistory?user_id='+doc.user_id)
          .end(function (err, res) {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res).to.not.be.null;
              expect(res).to.be.an('object'); // output type is a object
              expect(res.body).to.have.lengthOf.at.least(1); // 1+ more objects
              done();
        });
    });
  });
});

describe('/user/login', () => {
  it('set cookie', function(done) {
    // get a glider arbitrary
    glider.findOne({}, function(err, doc){

        chai.request(app)
          .post('/user/login')
          .type('form')
          .send({
              'u_name': doc.user_name,
              'pass_wd': doc.password
            })
          .end(function (err, res) {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res).to.not.be.null;
              expect(res).to.have.cookie('_id');
              expect(res).to.have.cookie('user_name');
              expect(res).to.have.cookie('user_type');
              // to test repeatedly, remove test data.
              location.findOneAndDelete({ name: doc.user_name }, function(err1, doc1){
                done();
              });
        });
    });
  });
  it('fake login', function(done) {
    // get a glider arbitrary
    glider.findOne({}, function(err, doc){

        chai.request(app)
          .post('/user/login')
          .type('form')
          .send({
              'u_name': doc.user_name,
              'pass_wd': 'babo'
            })
          .end(function (err, res) {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res).to.not.be.null;
              expect(res).to.not.have.cookie('_id');
              done();
        });
    });
  });
  it('update location when pilot logged in', function(done) {
    // get a glider arbitrary
    glider.findOne({'type':'pilot'}, function(err, doc){

        chai.request(app)
          .post('/user/login')
          .type('form')
          .send({
              'u_name': doc.user_name,
              'pass_wd': doc.password
            })
          .end(function (err, res) {
            // to test repeatedly, remove test data.
            location.findOneAndDelete({ name: doc.user_name }, function(err1, doc1){
              expect(doc1).to.not.be.null;
              done();
            });
        });
    });
  });
});

describe('/glider/Flight_Read', () => {
  it('get flight record', function(done) {
    // get a flight arbitrary
    flight.findOne({}, function(err, doc){

        chai.request(app)
          .get('/glider/Flight_Read')
          .set('Cookie', '_id='+doc.user_id)
          .end(function (err, res) {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res).to.not.be.null;
              expect(res).to.be.an('object'); // output type is a object
              expect(res.body.glider).to.have.lengthOf.at.least(7); // 1+ objects
              expect(res.body.glider).to.have.lengthOf.at.most(7); // max 7 objects
              done();
        });
    });
  });
  it('fake flight record', function(done) {
    chai.request(app)
      .get('/glider/Flight_Read')
      .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.not.be.null;
          expect(res).to.be.an('object'); // output type is a object
          expect(res.body.glider).to.have.lengthOf(0); // no objects
          done();
    });
  });
});

describe('Flight Series (start/record/end)', () => {
  var now_str = Date.now();
  var u_id = "";
  var u_name = "";
  var f_id = "";
  it('/glider/Flight_Write', function(done) {
    // get a glider arbitrary
    glider.findOne({'type':'pilot'}, function(err, doc){
        u_id = doc._id;
        u_name = doc.user_name;
        chai.request(app)
          .post('/glider/Flight_Write')
          .set('Cookie', '_id='+u_id)
          .type('form')
          .send({
              'start': now_str
            })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.not.be.null;
            expect(res).to.be.an('object'); // output type is a object
            // check to save flight record
            flight.findOne({ 'user_id': u_id, 'start':now_str }, function(err1, doc1){
              expect(doc1).to.not.be.null;
              f_id = doc1._id;
              // check to update flight recent_flight_id
              glider.findOne({ _id: u_id, recent_flight_id:f_id }, function(err2, doc2){
                expect(doc2).to.not.be.null;
                done();
              });
            });
        });
    });
  });

  it('/glider/Realtime_Tracking_Write', function(done) {
    console.log("/glider/Realtime_Tracking_Write:"+u_name);
    chai.request(app)
      .post('/glider/Realtime_Tracking_Write')
      .set('Cookie', 'user_name='+u_name)
      .type('form')
      .send({
          'flight_id': f_id+""
        })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.not.be.null;
        expect(res).to.be.an('object'); // output type is a object
        // check to save realtime_tracking record and delete it for repetitive tests
        realtime_tracking.findOneAndDelete({ 'flight_id': f_id+"" }, function(err1, doc1){
          expect(doc1).to.not.be.null;
          done();
        });
      });
  });

  it('/glider/Flight_End', function(done) {
    console.log("f_id:"+f_id);
    chai.request(app)
      .post('/glider/Flight_End')
      .type('form')
      .send({
          'flight_id': f_id+"",
          'end': Date.now(),
          'duration': 1
        })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.not.be.null;
        expect(res).to.be.an('object'); // output type is a object
        // check to save flight record and delete it for repetitive tests
        flight.findOneAndDelete({ 'user_id': u_id, 'start':now_str }, function(err1, doc1){
          expect(doc1.duration).to.equal(1);
          done();
        });
      });
  });
});
