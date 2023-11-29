import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { http } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

import Login from '../components/loginPage';

test('Login Renders', async () => {});
