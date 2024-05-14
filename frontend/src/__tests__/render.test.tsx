import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import Login from '../components/loginPage';
import Compose from '../components/composePage';

test('Login Renders', async () => {
	render(
		<BrowserRouter>
			<Login />
		</BrowserRouter>,
	);
});

test('Compose Renders', async () => {
	render(
		<BrowserRouter>
			<Compose />
		</BrowserRouter>,
	);
});
