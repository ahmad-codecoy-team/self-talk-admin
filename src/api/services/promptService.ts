import apiClient from "../apiClient";

export interface Prompt {
	_id: string;
	prompt: string;
	createdAt: string;
	updatedAt: string;
}

export interface PromptResponse {
	prompt: Prompt;
}

// Create a new prompt
const createPrompt = async (promptText: string): Promise<PromptResponse> => {
	return apiClient.post<PromptResponse>({
		url: "/admin/prompt",
		data: { prompt: promptText },
	});
};

// Get the current prompt
const getPrompt = async (): Promise<PromptResponse> => {
	return apiClient.get<PromptResponse>({
		url: "/admin/prompt",
	});
};

// Update the current prompt
const updatePrompt = async (promptText: string): Promise<PromptResponse> => {
	return apiClient.put<PromptResponse>({
		url: "/admin/prompt", 
		data: { prompt: promptText },
	});
};

export default {
	createPrompt,
	getPrompt,
	updatePrompt,
};