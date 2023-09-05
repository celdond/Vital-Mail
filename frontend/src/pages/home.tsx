import HomePage from '../components/homePage';
import { Outlet } from 'react-router-dom';

function Home() {
	return (
		<main>
			<HomePage />

			<Outlet />
		</main>
	);
}

export default Home;
