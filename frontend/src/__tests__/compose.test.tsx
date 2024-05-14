import { render, fireEvent } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

import Compose from '../components/composePage';

const URLLogin = 'http://localhost:3010/login';

const server = setupServer(
	http.post(URLLogin, async ({ request }) => {
		const user = await request.json();
		if (user['email'] === 'Abigail' && user['password'] === 'abigail123') {
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
    const mockedAlert = jest.spyOn(window,'alert').mockImplementation();
	render(
		<BrowserRouter>
			<Compose />
		</BrowserRouter>,
	);
	fireEvent.click(screen.getByRole('button', {name: "submit"}));
	await waitFor(() => {
		expect(mockedAlert).toHaveBeenCalledTimes(0);
	});
});
