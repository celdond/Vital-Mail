import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AccountPage() {
	const account = localStorage.getItem(`essentialMailToken`);
	const [changes, setChanges] = useState({
		name: '',
		email: '',
		password: '',
	});

	const handleChange = (event: any) => {
		const { value, name } = event.target;
		const u = changes;
		u[name] = value;
		setChanges(u);
	};

	const user = JSON.parse(account);
	const navigation = useNavigate();
	return <div></div>;
}
