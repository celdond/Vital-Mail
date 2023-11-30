// validatePassword:
//
// function to check if password is valid
export function validatePassword(password: string) {
	return /^[a-zA-Z0-9!?#$%&_]+$/.test(password);
}

// validateName:
//
// function to check if name is valid
export function validateName(name: string) {
	return /^[a-zA-Z0-9_]+$/.test(name);
}
