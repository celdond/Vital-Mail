import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import Register from './pages/register';
import ViewMail from './pages/mailview';
import Compose from './pages/compose';

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
				<Route path="/" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route
					path="/mail"
					element={
						<Authentication>
							<Home />
						</Authentication>
					}
				/>
				<Route
					path="/mail/:id"
					element={
						<Authentication>
							<ViewMail />
						</Authentication>
					}
				/>
				<Route
					path="compose"
					element={
						<Authentication>
							<Compose />
						</Authentication>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}
