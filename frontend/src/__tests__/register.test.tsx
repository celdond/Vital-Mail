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
		if (user['email'] === "Tested") {
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

test('Register Blocked - Nothing Entered', async () => {
	render(
		<BrowserRouter>
			<Register />
		</BrowserRouter>,
	);
	fireEvent.click(screen.getByText('Register'));
	await waitFor(() => {
		expect(screen.getByText('Enter a username')).not.toBe(null);
	});
});

test('Register Blocked - Passwords Do Not Match', async () => {
	render(
		<BrowserRouter>
			<Register />
		</BrowserRouter>,
	);
	const name = screen.getByPlaceholderText('Name');
	await userEvent.type(name, 'Tested');
    const email = screen.getByPlaceholderText('Username');
	await userEvent.type(email, 'NotTested');
	const passwd = screen.getByPlaceholderText('Password');
	await userEvent.type(passwd, 'mememememe123');
    const confirmPasswd = screen.getByPlaceholderText('Confirm Password');
	await userEvent.type(confirmPasswd, 'mememememe12');
	fireEvent.click(screen.getByText('Register'));
	await waitFor(() => {
		expect(screen.getByText('Passwords do not match.')).not.toBe(
			null,
		);
	});
});

test('Register Success', async () => {
	render(
		<BrowserRouter>
			<Register />
		</BrowserRouter>,
	);
	const name = screen.getByPlaceholderText('Name');
	await userEvent.type(name, 'Tested');
    const email = screen.getByPlaceholderText('Username');
	await userEvent.type(email, 'Tested');
	const passwd = screen.getByPlaceholderText('Password');
	await userEvent.type(passwd, 'mememememe123');
    const confirmPasswd = screen.getByPlaceholderText('Confirm Password');
	await userEvent.type(confirmPasswd, 'mememememe123');
	fireEvent.click(screen.getByText('Register'));
	await waitFor(() => {
		expect(screen.getByText('Register a new account')).not.toBe(
			null,
		);
	});
});
