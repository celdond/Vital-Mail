import ViewMailPage from '../components/viewmail';

function ViewMail() {
	const id = '';

	return <ViewMailPage id={typeof(id) == 'string' ? id : null} />;
}

export default ViewMail;
