import apiClient from "../apiClient";

export interface SupportRequest {
	_id: string;
	message: string;
	user: {
		_id: string;
		username: string;
		email: string;
		profilePicture: string;
		is_suspended: boolean;
		userCreatedAt: string;
	};
	createdAt: string;
	updatedAt: string;
}

// API Response structure after apiClient transformation
export interface SupportResponse {
	supportRequests: SupportRequest[];
	meta: {
		total: number;
		limit: number;
		totalPages: number;
		currentPage: number;
	};
}

const getSupportRequests = async (page = 1, limit = 10): Promise<SupportResponse> => {
	return apiClient.get<SupportResponse>({
		url: `/admin/support?page=${page}&limit=${limit}`,
	});
};

export default {
	getSupportRequests,
};