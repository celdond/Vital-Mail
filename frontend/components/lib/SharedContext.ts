import { createContext } from 'react';

export type mailType = {
	id: string;
	from: {
		name: string;
	};
	subject: string;
	preview: string;
	time: string;
};

export type tokenType = {
	name: string;
	email: string;
	token: string;
};

export type MailListContextType = mailType[];

export const MailListContext = createContext<MailListContextType>([]);
