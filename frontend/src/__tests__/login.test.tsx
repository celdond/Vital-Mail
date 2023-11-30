import { render, fireEvent } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

import Login from '../components/loginPage';

const URLLogin = 'http://localhost:3010/login';

const server = setupServer(
	http.post(URLLogin, async ({ request }) => {
		const user = await request.json();
		if (user['email'] === 'Abigail' && user['passcode'] === 'abigail123') {
			return HttpResponse.json({name: 'Abby', accessToken: 'some-old-jwt', email: 'Abigail'});
		} else {
			return new HttpResponse(null, {status: 400});
		}
	}),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Login Fail', async () => {
	render(<Login />);
	const email = screen.getByLabelText('Username');
	await userEvent.type(email, 'bababababa');
	const passwd = screen.getByLabelText('Password');
	await userEvent.type(passwd, 'abigail123');
	fireEvent.click(screen.getByText('Log In'));
	await waitFor(() => {
		expect(screen.getByText('Login Failed')).not.toBe(null);
	});
});

test('Login Success', async () => {
	render(<Login />);
	const email = screen.getByLabelText('Username');
	await userEvent.type(email, 'Abigail');
	const passwd = screen.getByLabelText('Password');
	await userEvent.type(passwd, 'abigail123');
	fireEvent.click(screen.getByText('Log In'));
	await waitFor(() => {
		expect(localStorage.getItem('essentialMailToken')).not.toBe(null);
	});
	localStorage.removeItem('user');
});
