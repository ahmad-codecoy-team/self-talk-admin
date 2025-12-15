import apiClient from "../apiClient";

export interface Prompt {
	_id: string;
	prompt: string;
	llmModal?: string;
	ttsModal?: string;
	createdAt: string;
	updatedAt: string;
}

export interface PromptResponse {
	prompt: Prompt;
}

// Create a new prompt
const createPrompt = async (data: {
	prompt: string;
	llmModal: string;
	ttsModal: string;
}): Promise<PromptResponse> => {
	return apiClient.post<PromptResponse>({
		url: "/admin/prompt",
		data,
	});
};

// Get the current prompt
const getPrompt = async (): Promise<PromptResponse> => {
	return apiClient.get<PromptResponse>({
		url: "/admin/prompt",
	});
};

// Update the current prompt
const updatePrompt = async (data: {
	prompt?: string;
	llmModal?: string;
	ttsModal?: string;
}): Promise<PromptResponse> => {
	return apiClient.put<PromptResponse>({
		url: "/admin/prompt",
		data,
	});
};

export default {
	createPrompt,
	getPrompt,
	updatePrompt,
};