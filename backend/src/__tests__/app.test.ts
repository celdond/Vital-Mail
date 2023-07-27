import app from '../app';
import http from 'http';
import supertest from 'supertest';

let request: supertest.SuperTest<supertest.Test>;
let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

beforeAll(() => {
    server = http.createServer(app);
    server.listen();
	request = supertest(server);
});

afterAll((done) => {
	server.close(done);
});

test('GET Invalid URL', async () => {
	await request.get('/DefinitelyReal/').expect(404);
});

test('GET Steam', async () => {
	await request.get('/steam').expect(200);
});
