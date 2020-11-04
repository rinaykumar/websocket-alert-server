const redis = require('redis');
const WebSocket = require('ws');

const publishMock = jest.fn();
const onMock = jest.fn();
const subscribeMock = jest.fn();

redis.createClient = jest.fn()
  .mockReturnValue({
    on: onMock,
    quit: jest.fn(),
    get: jest.fn(),
    publish: publishMock,
    subscribe: subscribeMock,
  });

const wssOnMock = jest.fn();
const wssClients = new Set();

WebSocket.Server = jest.fn()
  .mockReturnValue({
    on: wssOnMock,
    clients: wssClients,
  });

require('../websocketServer.js');

describe("Default Route Should be failed code 404", () => {
  test("Save userId when client connects", done => {
    expect(wssOnMock.mock.calls.length).toBe(1);
    const wssOnCallback = wssOnMock.mock.calls[0][1];
    const redisOnCallback = onMock.mock.calls[0][1];
    const wsOnMock = jest.fn();
    const wsMock = jest.fn()
      .mockReturnValue({
        on: wsOnMock,
        send: jest.fn(),
      });
    const wsMockInstance = wsMock();
    wssClients.clients = new Set();
    wssClients.add(wsMockInstance);
    wssOnCallback(wsMockInstance);
    expect(wsOnMock.mock.calls.length).toBe(1);

    const messageOnCallback = wsOnMock.mock.calls[0][1];
    redisOnCallback(null, JSON.stringify({
      userId: '12345',
      text: 'hello',
    }));
    expect(wsMockInstance.send.mock.calls.length).toBe(0);
    messageOnCallback(JSON.stringify({ userId: '12345' }));
    redisOnCallback(null, JSON.stringify({
      userId: '12345',
      text: 'hello',
    }));
    expect(wsMockInstance.send.mock.calls.length).toBe(1);
    done();
  });
});