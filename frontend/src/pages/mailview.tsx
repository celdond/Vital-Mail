import ViewMailPage from '../components/viewmail';

function ViewMail() {
	//const router = useRouter();
	const id = '';

	return <ViewMailPage id={typeof(id) == 'string' ? id : null} />;
}

export default ViewMail;
