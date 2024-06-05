import { createContext } from 'react';

export type mailListType = {
	id: string;
	from: {
		name: string;
	};
	subject: string;
	preview: string;
	time: string;
	timestamp: string;
	dateValue: Date;
};

export type mailType = {
	id: string;
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

export type composeType = {
	to: string;
	subject: string;
	content: string;
};

export type tokenType = {
	name: string;
	email: string;
	token: string;
};

export type MailListContextType = {
	mail: mailListType[];
	mailbox: string[];
	user: tokenType;
	update: boolean;
	page: number;
};

const defaultMailListContext = {
	mail: [],
	mailbox: [],
	user: {
		name: '',
		email: '',
		token: '',
	},
	update: false,
	page: 0,
};

export const MailListContext = createContext<MailListContextType>(
	defaultMailListContext,
);
