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

export type mailListContextType = mailType[];

export const mailListContext = createContext<mailListContextType>([]);
