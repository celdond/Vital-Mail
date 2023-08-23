import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import Register from './pages/register';

const Authentication = ({ children }) => {
	if (localStorage.getItem(`essentialMailToken`)) {
		return children;
	}
	return <Navigate to="/" replace />;
};

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route
					path="/home"
					element={
						<Authentication>
							<Home />
						</Authentication>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}
