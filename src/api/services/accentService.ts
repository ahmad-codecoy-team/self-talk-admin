import apiClient from "../apiClient";
import { Language } from "./languageService";

export interface Accent {
	_id: string;
	language_id: string | Language; // Can be ID or populated object depending on endpoint
	name: string;
}

// Get all accents
const getAccents = async (languageId?: string): Promise<Accent[]> => {
	const url = languageId 
		? `/admin/accents?language_id=${languageId}` 
		: "/admin/accents";
		
	const response = await apiClient.get<{ accents: Accent[] }>({
		url,
	});
	return response.accents;
};

// Create a new accent
const createAccent = async (data: { language_id: string; name: string }): Promise<Accent> => {
	const response = await apiClient.post<Accent>({
		url: "/admin/accents",
		data,
	});
	return response;
};

// Update an accent
const updateAccent = async (id: string, data: { name: string; language_id?: string }): Promise<Accent> => {
	const response = await apiClient.put<Accent>({
		url: `/admin/accents/${id}`,
		data,
	});
	return response;
};

// Delete an accent
const deleteAccent = async (id: string): Promise<void> => {
	await apiClient.delete({
		url: `/admin/accents/${id}`,
	});
};

export default {
	getAccents,
	createAccent,
	updateAccent,
	deleteAccent,
};
