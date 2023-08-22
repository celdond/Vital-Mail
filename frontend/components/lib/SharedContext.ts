import { createContext } from 'react';

export type mailListType = {
	mid: string;
	from: {
		name: string;
	};
	subject: string;
	preview: string;
	time: string;
	timestamp: string;
};

export type mailType = {
	mid: string;
	from: {
		name: string;
		email: string;
	};
	to: {
		name: string;
		email: string;
	};
	subject: string;
	content: string;
	time: string;
	timestamp: string;
};

export type tokenType = {
	name: string;
	email: string;
	token: string;
};

export type MailListContextType = mailListType[];

export const MailListContext = createContext<MailListContextType>([]);
