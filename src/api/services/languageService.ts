import apiClient from "../apiClient";

export interface Language {
	_id: string;
	name: string;
	code: string;
}

export interface LanguageResponse {
	success: boolean;
	data: {
		languages: Language[];
	} | Language;
}

// Get all languages
const getLanguages = async (): Promise<Language[]> => {
	const response = await apiClient.get<{ languages: Language[] }>({
		url: "/admin/languages",
	});
	return response.languages;
};

// Create a new language
const createLanguage = async (data: { name: string; code: string }): Promise<Language> => {
	const response = await apiClient.post<Language>({
		url: "/admin/languages",
		data,
	});
	return response;
};

// Update a language
const updateLanguage = async (id: string, data: { name: string; code: string }): Promise<Language> => {
	const response = await apiClient.put<Language>({
		url: `/admin/languages/${id}`,
		data,
	});
	return response;
};

// Delete a language
const deleteLanguage = async (id: string): Promise<void> => {
	await apiClient.delete({
		url: `/admin/languages/${id}`,
	});
};

export default {
	getLanguages,
	createLanguage,
	updateLanguage,
	deleteLanguage,
};
