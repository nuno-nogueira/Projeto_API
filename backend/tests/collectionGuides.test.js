const request= require('supertest');
const db= require('../models/db')
const jwt= require('jsonwebtoken');
require('dotenv').config();
const http= require('http');
const express= require('express');

let token;
let server;
jest.setTimeout(20000);

// beforeAll(async () => {
//     const user= {user_id: 5, role:'motorista'};
//     token= jwt.sign(user, process.env.SECRET, {expiresIn: '1h'});

//     try{
//         await db.sequelize.authenticate();
//         console.log('Connected to DB for tests');

//         const app= express();

//        app.use(express.json());
//        app.use('/collection-guides', require('../routes/collection-guides.routes'));



//        server= app.listen(0);
//     } catch (err) {
//         console.error('Unable to connect to DB during tests:', err);
//         throw err;
//     }
// })

beforeAll(async () => {
  const user = { user_id: 5, role: 'motorista' };
  token= jwt.sign(user, process.env.SECRET, { expiresIn: '1h' })

  const maxRetries= 5
  let attempts= 0
  const connectToDB= async () => {
    while (attempts < maxRetries) {
      try {
        await db.sequelize.authenticate()
        console.log('Connected to DB for tests')
        return;
      } catch (err) {
        attempts++;
        console.log(`Connection attempt ${attempts} failed. Retrying..`)
        if (attempts === maxRetries) {
          throw new Error('Unable to connect to DB after multiple attempts')
        }
        await new Promise(resolve => setTimeout(resolve, 10000)); 
      }
    }
  };

  await connectToDB();

  const app = express();
  app.use(express.json());
  app.use('/collection-guides', require('../routes/collection-guides.routes'));

  server = app.listen(0);
});


describe('GET /collection-guides', ()=>{
    it('should return a list of collection guides', async ()=>{
        const res=await request(server)
            .get('/collection-guides')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('POST /collection-guides', ()=>{
    it('should add a new collection guide', async ()=>{
        
        const newCollectionGuide = {
            issue_date: "2025-05-01T08:00:00.000Z",
            waste_id: 5,
            collection_status: "não iniciada",
            route_id: 1
        }

        const res= await request(server)
            .post('/collection-guides')
            .set('Authorization', `Bearer ${token}`)
            .send(newCollectionGuide);
        
        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject({
            msg: "Guide successfully created.",
            links: expect.any(Array)
        });
    });
});

afterAll(async()=>{
    await db.sequelize.close();  
  server.close(); 
})