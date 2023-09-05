import HomePage from '../components/homePage';
// import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import ViewMail from './mailview';

function Home() {
	return (
		<div>
			<HomePage />

			<Routes>
				<Route path=":id" element={<ViewMail />} />
			</Routes>
		</div>
	);
}

export default Home;
