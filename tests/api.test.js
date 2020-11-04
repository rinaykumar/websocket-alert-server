const request = require('supertest');

const redis = require('redis');

const publishMock = jest.fn();
const onMock = jest.fn();

redis.createClient = jest
  .fn()
  .mockReturnValue({
    on: onMock,
    quit: jest.fn(),
    get: jest.fn(),
    publish: publishMock,
  });

const app = require('../apiServer.js');

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

describe("Default Route Should be failed code 404", () => {
  const random1 = makeid(4);
  const random2 = makeid(4);
  test("Default response should be 404", done => {
    request(app)
      .get(`/api/doSomething?userId=${random1}&text=${random2}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(publishMock.mock.calls.length).toBe(2);
        expect(publishMock.mock.calls[0][0]).toBe('testPublish');
        const data1 = JSON.parse(publishMock.mock.calls[0][1]);
        expect(data1.userId).toBe(random1);
        expect(data1.text).toBe(random2);
      });
  });
});