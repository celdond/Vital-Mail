import { render, fireEvent } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

import Register from '../components/registerPage';

const URLRegister = 'http://localhost:3010/register';

const server = setupServer(
	http.post(URLRegister, async ({ request }) => {
		const user = await request.json();
		if (user['email']) {
			return HttpResponse.json(null, { status: 201 });
		} else {
			return new HttpResponse(null, { status: 400 });
		}
	}),
);

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
	...(jest.requireActual('react-router-dom') as any),
	useNavigate: () => mockedUsedNavigate,
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
