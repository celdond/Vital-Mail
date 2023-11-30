import { render, fireEvent } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

import Login from '../components/loginPage';

const URLLogin = 'http://localhost:3010/login';

const server = setupServer(
	http.post(URLLogin, async ({ request }) => {
		const user = await request.json();
		if (user['email'] === 'Abigail' && user['passcode'] === 'abigail123') {
			return HttpResponse.json({
				name: 'Abby',
				accessToken: 'some-old-jwt',
				email: 'Abigail',
			});
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

test('Submission Blocked - Nothing Entered', async () => {
	render(
		<BrowserRouter>
			<Login />
		</BrowserRouter>,
	);
	fireEvent.click(screen.getByText('Submit'));
	await waitFor(() => {
		expect(screen.getByText('Enter your username')).not.toBe(null);
	});
});

test('Submission Blocked - Characters', async () => {
	render(
		<BrowserRouter>
			<Login />
		</BrowserRouter>,
	);
	const email = screen.getByLabelText('Username');
	await userEvent.type(email, '@@@@@@');
	const passwd = screen.getByLabelText('Password');
	await userEvent.type(passwd, '@@@@@@@@@@@@@@');
	fireEvent.click(screen.getByText('Submit'));
	await waitFor(() => {
		expect(screen.getByText('Username includes invalid characters.')).not.toBe(
			null,
		);
		expect(screen.getByText('Passcode includes invalid characters.')).not.toBe(
			null,
		);
	});
});

test('Login Fail', async () => {
	render(
		<BrowserRouter>
			<Login />
		</BrowserRouter>,
	);
	const email = screen.getByLabelText('Username');
	await userEvent.type(email, 'bababababa');
	const passwd = screen.getByLabelText('Password');
	await userEvent.type(passwd, 'abigail123');
	fireEvent.click(screen.getByText('Submit'));
	await waitFor(() => {
		expect(screen.getByText('Login Failed.')).not.toBe(null);
	});
});

test('Login Success', async () => {
	render(
		<BrowserRouter>
			<Login />
		</BrowserRouter>,
	);
	const email = screen.getByLabelText('Username');
	await userEvent.type(email, 'Abigail');
	const passwd = screen.getByLabelText('Password');
	await userEvent.type(passwd, 'abigail123');
	fireEvent.click(screen.getByText('Submit'));
	await waitFor(() => {
		expect(localStorage.getItem('essentialMailToken')).not.toBe(null);
	});
	localStorage.removeItem('user');
});
