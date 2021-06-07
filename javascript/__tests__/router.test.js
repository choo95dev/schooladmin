
import request from 'supertest';
import app from '../src/app';


describe('GET /api/healthcheck', () => {
  it('healthcheck for app and jest', async () => {
    await request(app).get('/api/healthcheck').expect(200);
  });
});


describe('POST /api/register', () => {
  it('register teacher student ', async () => {
    await request(app).post('/api/register')
      .send({
        'teacher': {
          name: 'Teacher 1',
          email: 'teacher1@gmail.com'
        },
        'students': [{
          name: 'Student 1',
          email: 'student1@gmail.com'
        }, {
          name: 'Student 2',
          email: 'student2@gmail.com'
        }],
        'subject': {
          subjectCode: 'ENG',
          name: 'English'
        },
        'class': {
          classCode: 'P1-1',
          name: 'P1 Integrity'
        }
      }
      )
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(204);
  });

  it('test for required param teacher', async () => {
    var req = await request(app).post('/api/register')
      .send({
        'students': [{
          name: 'Student 1',
          email: 'student1@gmail.com'
        }, {
          name: 'Student 2',
          email: 'student2@gmail.com'
        }],
        'subject': {
          subjectCode: 'ENG',
          name: 'English'
        },
        'class': {
          classCode: 'P1-1',
          name: 'P1 Integrity'
        }
      }
      )
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400);
    var errArr = await JSON.parse(req.text).errors;
    expect(errArr).toEqual(expect.arrayContaining(
      [
        expect.objectContaining({
          msg: 'teacher parameter is required'
        })
      ]
    ));
  });

  it('test for required param subject', async () => {
    var req = await request(app).post('/api/register')
      .send({
        'teacher': {
          name: 'Teacher 1',
          email: 'teacher1@gmail.com'
        },
        'students': [{
          name: 'Student 1',
          email: 'student1@gmail.com'
        }, {
          name: 'Student 2',
          email: 'student2@gmail.com'
        }],
        'class': {
          classCode: 'P1-1',
          name: 'P1 Integrity'
        }
      }
      )
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400);
    var errArr = await JSON.parse(req.text).errors;
    expect(errArr).toEqual(expect.arrayContaining(
      [
        expect.objectContaining({
          msg: 'subject parameter is required'
        })
      ]
    ));
  });

  it('test for required param class', async () => {
    var req = await request(app).post('/api/register')
      .send({
        'teacher': {
          name: 'Teacher 1',
          email: 'teacher1@gmail.com'
        },
        'students': [{
          name: 'Student 1',
          email: 'student1@gmail.com'
        }, {
          name: 'Student 2',
          email: 'student2@gmail.com'
        }],
        'subject': {
          subjectCode: 'ENG',
          name: 'English'
        },
      }
      )
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400);
    var errArr = await JSON.parse(req.text).errors;
    expect(errArr).toEqual(expect.arrayContaining(
      [
        expect.objectContaining({
          msg: 'class parameter is required'
        })
      ]
    ));
  });
});


describe('GET /api/workload', () => {
  it('Test workload', async () => {
    await request(app).get('/api/reports/workload').expect(200);
  });
});
