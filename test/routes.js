process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const server = require('../server')
const chaiHttp = require('chai-http')
const { knex } = require('../db/config')
chai.use(chaiHttp)

describe(`Root route`, function() {
  describe(`GET /api`, function() {
    it(`should return an object`, function() {
      return chai.request(server)
        .get('/api')
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
        })
    })
  })
})

describe('Dataset routes', () => {
  // does a rollback on test db and then migration and seed before each test run so we know what is in db
  beforeEach(() => {
    return knex.migrate.rollback()
      .then (()=> {
        return knex.migrate.latest()
      })
      .then (()=> {
        return knex.seed.run()
      })
  });

  describe('GET /api/datasets', ()=>{
    it('should return all datasets',() =>{
      return chai.request(server)
        .get('/api/datasets/')
        .then((res) => {
          res.should.have.status(200)
          res.should.be.json
          res.should.be.a.object
          res.body.should.have.key('datasets')
          res.body.datasets.should.be.a.array
        })
    })
  })

  describe(`GET /api/datasets?userid={userid}`, function() {
    it('should return all datasets for a user', () => {
      return chai.request(server)
        .get('/api/datasets?userid=1')
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.should.be.a.object
          res.body.should.have.key('datasets')
          res.body.datasets.should.be.a.array
          res.body.datasets.forEach(dataset => {
            chai.assert.equal(dataset.user_id, 1)
          })
        })
    })
  })

  describe(`POST /api/datasets`, function() {
    it(`should add a dataset to the database`, function() {
      return chai.request(server)
        .post('/api/datasets')
        .send({"name": "Test2.csv",
          "file_type": "text/csv",
          "size": "500",
          "user_id": "2",
          "data": "[{name: \"Lucas\", age: 50}]"})
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.should.be.a.object
          res.body.should.have.key('id')
          chai.assert.isNumber(res.body.id)
        })
    })
  })
})











