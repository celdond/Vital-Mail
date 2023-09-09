import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import HomePage from './pages/home';
import RegisterPage from './pages/register';
import ViewMailPage from './pages/mailview';
import ComposePage from './pages/compose';

// Authentication:
//
// Simply checks to ensure there is an available token to use in API requests
// before passing to the page
const Authentication = ({ children }) => {
	if (localStorage.getItem(`essentialMailToken`)) {
		return children;
	}
	return <Navigate to="/" replace />;
};

// App Function:
//
// Contains all routes for the web application
export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route
					path="/mail"
					element={
						<Authentication>
							<HomePage />
						</Authentication>
					}
				/>
				<Route
					path="/mail/:id"
					element={
						<Authentication>
							<ViewMailPage />
						</Authentication>
					}
				/>
				<Route
					path="compose"
					element={
						<Authentication>
							<ComposePage />
						</Authentication>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}
