import apiClient from "../apiClient";

// API User structure (what the backend returns)
export interface ApiUser {
	_id: string;
	username: string;
	email: string;
	profilePicture: string;
	voice_id: string | null;
	model_id: string | null;
	current_subscription: {
		_id: string;
		name: string;
		status: string;
		price: number;
		billing_period: string;
		currency?: string;
		total_minutes: number; // plan minutes + extra_minutes
		available_minutes: number; // combined available (plan + extra)
		extra_minutes: number;
		recordings?: string[];
		subscription_started_at?: string;
		subscription_end_date?: string | null;
		createdAt?: string;
		updatedAt?: string;
	} | null;
	role: {
		_id: string;
		name: string;
		description: string;
		createdAt: string;
		updatedAt: string;
		__v: number;
	};
	is_suspended: boolean;
	createdAt: string;
	updatedAt: string;
}

// API Response structure
export interface ApiUsersResponse {
	success: boolean;
	statusCode: number;
	message: string;
	data: {
		users: ApiUser[];
	};
	meta: {
		total: number;
		limit: number;
		totalPages: number;
		currentPage: number;
	};
}

export interface ApiUserResponse {
	success: boolean;
	statusCode: number;
	message: string;
	data: {
		user: ApiUser;
	};
}

// Frontend User structure (what the frontend expects)
export interface FrontendUser {
	id: string;
	name: string;
	email: string;
	avatar: string;
	currentPackageId: string;
	plan: string;
	status: string;
	joinDate: string;
	lastActive: string;
	minutesUsed: number;
	minutesTotal: number;
	subscription: {
		id: string;
		userId: string;
		packageId: string;
		packageSnapshot: {
			name: string;
			price: number;
			voiceMinutes: number;
			billingCycle: string;
		};
		status: string;
		startDate: string;
		endDate: string | null;
		nextBillingDate: string | null;
		paymentMethod: {
			type: string;
			last4: string;
			brand: string;
		} | null;
		autoRenew: boolean;
		createdAt: string;
		updatedAt: string;
	};
}

export enum AdminUsersApi {
	GetUsers = "/admin/users",
	ToggleSuspension = "/admin/users/suspension",
}

// Generate random avatar background colors
const AVATAR_COLORS = [
	"#ef4444",
	"#f97316",
	"#f59e0b",
	"#eab308",
	"#84cc16",
	"#22c55e",
	"#10b981",
	"#14b8a6",
	"#06b6d4",
	"#0ea5e9",
	"#3b82f6",
	"#6366f1",
	"#8b5cf6",
	"#a855f7",
	"#d946ef",
	"#ec4899",
	"#f43f5e",
];

// Utilities to coerce numbers and infer plan minutes when backend omits totals
const toNum = (v: unknown): number | undefined => {
	const n = typeof v === "string" ? Number(v) : (typeof v === "number" ? v : undefined);
	return Number.isFinite(n as number) ? (n as number) : undefined;
};

const inferPlanMinutes = (planName: string | undefined): number | undefined => {
	switch ((planName || "").toLowerCase()) {
		case "free":
			return 2;
		case "premium":
			return 200;
		case "super":
			return 500;
		default:
			return undefined;
	}
};

// Transform API user to frontend user format
export const transformApiUserToFrontendUser = (apiUser: ApiUser): FrontendUser => {
	// Safely read subscription minutes with sensible fallbacks (Free plan defaults to 2 total minutes)
	const planName = apiUser.current_subscription?.name || "Free";
	// Read minutes from new shape (current_subscription) with backward/alt-shape fallback to root-level
	const totalRaw = apiUser.current_subscription?.total_minutes ?? (apiUser as any).total_minutes;
	const availableRaw = apiUser.current_subscription?.available_minutes ?? (apiUser as any).available_minutes;
	let total = toNum(totalRaw);
	let available = toNum(availableRaw);

	// If totals are missing, try to infer by plan name (doc: Free=2, Premium=200, Super=500)
	if (total === undefined) total = inferPlanMinutes(planName);
	if (available === undefined) available = total; // assume full available if missing

	const minutesUsed = Math.max((total ?? 0) - (available ?? 0), 0);

	// Generate avatar with user initials and random color
	const initials = apiUser.username
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const colorIndex = apiUser._id.charCodeAt(0) % AVATAR_COLORS.length;
	const avatarColor = AVATAR_COLORS[colorIndex];

	// Create avatar URL with initials and background color
	const avatar =
		apiUser.profilePicture ||
		`data:image/svg+xml,${encodeURIComponent(`
			<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 40 40\">
				<rect width=\"40\" height=\"40\" fill=\"${avatarColor}\"/>
				<text x=\"20\" y=\"26\" text-anchor=\"middle\" fill=\"white\" font-family=\"Arial, sans-serif\" font-size=\"14\" font-weight=\"bold\">${initials}</text>
			</svg>
		`)}`;

	// Determine plan name and subscription details
	// planName already computed above
	const planPrice = apiUser.current_subscription?.price || 0;

	// Status mapping
	const status = apiUser.is_suspended ? "Suspended" : "Active";

	// Date formatting
	const joinDate = new Date(apiUser.createdAt).toISOString().split("T")[0];
	const lastActive = new Date(apiUser.updatedAt).toISOString().split("T")[0];

	// Static payment method for now
	const paymentMethod = planPrice > 0
		? { type: "card", last4: "4242", brand: "visa" }
		: null;

	// Create subscription data
	const subscription = {
		id: apiUser.current_subscription?._id || `sub_${apiUser._id}`,
		userId: apiUser._id,
		packageId: apiUser.current_subscription?._id || `pkg_free_${apiUser._id}`,
		packageSnapshot: {
			name: planName,
			price: planPrice,
			voiceMinutes: total ?? 0,
			billingCycle: apiUser.current_subscription?.billing_period || "monthly",
		},
		status: planName === "Free" ? "free" : status === "Active" ? "active" : "cancelled",
		startDate:
			(apiUser.current_subscription?.subscription_started_at || apiUser.createdAt)
				? new Date(apiUser.current_subscription?.subscription_started_at || apiUser.createdAt).toISOString().split("T")[0]
				: joinDate,
		endDate: apiUser.current_subscription?.subscription_end_date || null,
		nextBillingDate:
			planName === "Free" ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
		paymentMethod,
		autoRenew: planName !== "Free" && status === "Active",
		createdAt: apiUser.current_subscription?.createdAt || apiUser.createdAt,
		updatedAt: apiUser.current_subscription?.updatedAt || apiUser.updatedAt,
	};

	return {
		id: apiUser._id,
		name: apiUser.username,
		email: apiUser.email,
		avatar,
		currentPackageId: subscription.packageId,
		plan: planName,
		status,
		joinDate,
		lastActive,
		minutesUsed,
		minutesTotal: total ?? 0,
		subscription,
	};
};

// API service functions
const getUsers = async (
	page: number = 1,
	limit: number = 10,
): Promise<{
	users: FrontendUser[];
	meta: { total: number; limit: number; totalPages: number; currentPage: number };
}> => {
	const response = await apiClient.get<{
		users: ApiUser[];
		meta: { total: number; limit: number; totalPages: number; currentPage: number };
	}>({
		url: AdminUsersApi.GetUsers,
		params: { page, limit },
	});

	return {
		users: response.users.map(transformApiUserToFrontendUser),
		meta: response.meta,
	};
};

const toggleUserSuspension = async (userId: string): Promise<FrontendUser> => {
	const response = await apiClient.put<{ user: ApiUser }>({
		url: `${AdminUsersApi.ToggleSuspension}/${userId}`,
	});

	return transformApiUserToFrontendUser(response.user);
};

// Get single user by ID - for now, we'll get it from the users list
// until we have a dedicated single user endpoint
const getUserById = async (userId: string): Promise<FrontendUser | null> => {
	try {
		const response = await getUsers(1, 100); // Get all users
		const user = response.users.find((u) => u.id === userId);
		return user || null;
	} catch (error) {
		console.error("Error fetching user by ID:", error);
		return null;
	}
};

export default {
	getUsers,
	toggleUserSuspension,
	getUserById,
};
