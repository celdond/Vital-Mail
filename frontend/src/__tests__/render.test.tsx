import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import Login from '../components/loginPage';

test('Login Renders', async () => {
	render(<Login />);
});
