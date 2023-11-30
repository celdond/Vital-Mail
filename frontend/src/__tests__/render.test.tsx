import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import Login from '../components/loginPage';

test('Login Renders', async () => {
	render(
		<BrowserRouter>
			<Login />
		</BrowserRouter>,
	);
});
