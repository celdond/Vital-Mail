import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Login from './pages/login';

const Authenticatation = ({children}) => {
    if (localStorage.getItem(`essentialMailToken`)) {
      return children;
    }
    return <Navigate to='/' replace />;
};

export default function App() {
	return (
		<BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
            </Routes>
		</BrowserRouter>
	);
}
