// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { ArrowUpDown, Calendar, Clock, Crown, Euro, Eye, Filter, Search, Shield, ShieldOff, Trash2, UserCheck, Users } from "lucide-react";
// import { memo, useCallback, useMemo, useState } from "react";
// import { useNavigate } from "react-router";
// import { toast } from "sonner";
// import type { FrontendUser } from "@/api/services/adminUsersService";
// import adminUsersService from "@/api/services/adminUsersService";
// import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
// import { Badge } from "@/ui/badge";
// import { Button } from "@/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
// import { Input } from "@/ui/input";
// import { ScrollArea } from "@/ui/scroll-area";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
// import { Separator } from "@/ui/separator";
// import { Checkbox } from "@/ui/checkbox";

// // Base URL for profile pictures
// const PROFILE_PICTURE_BASE_URL = "https://selftalk-backend-yw3r.onrender.com";

// // Avatar background colors for fallbacks
// const AVATAR_COLORS = [
// 	"bg-red-500",
// 	"bg-orange-500",
// 	"bg-amber-500",
// 	"bg-yellow-500",
// 	"bg-lime-500",
// 	"bg-green-500",
// 	"bg-emerald-500",
// 	"bg-teal-500",
// 	"bg-cyan-500",
// 	"bg-sky-500",
// 	"bg-blue-500",
// 	"bg-indigo-500",
// 	"bg-violet-500",
// 	"bg-purple-500",
// 	"bg-fuchsia-500",
// 	"bg-pink-500",
// 	"bg-rose-500",
// ];

// // Mobile-optimized UserCard component
// const UserCard = memo(
// 	({
// 		user,
// 		loadingUserId,
// 		onViewUser,
// 		onToggleStatus,
// 	}: {
// 		user: FrontendUser;
// 		loadingUserId: string | null;
// 		onViewUser: (userId: string) => void;
// 		onToggleStatus: (userId: string) => void;
// 	}) => {
// 		return (
// 			<Card className="p-4 hover:shadow-sm transition-shadow border border-border/40">
// 				<div className="space-y-3">
// 					{/* Header with Avatar and Badges */}
// 					<div className="flex items-center justify-between">
// 						<div className="flex items-center space-x-3 flex-1 min-w-0">
// 							<Avatar className="h-11 w-11 flex-shrink-0">
// 								<AvatarImage src={getProfilePictureUrl(user.avatar)} alt={user.name} className="object-cover" />
// 								<AvatarFallback className={`text-xs font-medium text-white ${getAvatarBgColor(user.id)}`}>
// 									{user.name
// 										.split(" ")
// 										.map((n: string) => n[0])
// 										.join("")
// 										.toUpperCase()
// 										.slice(0, 2)}
// 								</AvatarFallback>
// 							</Avatar>
// 							<div className="space-y-1 flex-1 min-w-0">
// 								<p className="font-medium text-sm leading-none truncate">{user.name}</p>
// 								<p className="text-xs text-muted-foreground truncate">{user.email}</p>
// 								<div className="flex items-center gap-1.5 mt-1">
// 									<Badge variant={getPlanBadgeVariant(user.plan)} className="text-[10px] px-1.5 py-0.5 h-auto">
// 										{user.plan}
// 									</Badge>
// 									<Badge variant={getStatusBadgeVariant(user.status)} className="text-[10px] px-1.5 py-0.5 h-auto">
// 										{user.status}
// 									</Badge>
// 								</div>
// 							</div>
// 						</div>
// 					</div>

// 					{/* Usage Progress */}
// 					<div className="space-y-2">
// 						<div className="flex items-center justify-between text-xs">
// 							<span className="text-muted-foreground">Usage</span>
// 							<span className="font-medium">
// 								{user.minutesUsed}/{user.minutesTotal} min
// 							</span>
// 						</div>
// 						<div className="w-full bg-muted rounded-full h-1.5">
// 							<div
// 								className="bg-primary h-1.5 rounded-full transition-all duration-300"
// 								style={{ width: `${Math.min((user.minutesUsed / user.minutesTotal) * 100, 100)}%` }}
// 							/>
// 						</div>
// 					</div>

// 					{/* Footer with Join Date and Actions */}
// 					<div className="flex items-center justify-between pt-1">
// 						<span className="text-xs text-muted-foreground">
// 							Joined{" "}
// 							{new Date(user.joinDate).toLocaleDateString("en-US", {
// 								month: "short",
// 								day: "numeric",
// 								year: "2-digit",
// 							})}
// 						</span>
// 						<div className="flex items-center gap-2">
// 							<Button
// 								variant="outline"
// 								size="sm"
// 								className="h-7 px-2.5 text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
// 								onClick={() => onViewUser(user.id)}
// 							>
// 								<Eye className="h-3 w-3 mr-1" />
// 								View
// 							</Button>
// 							<Button
// 								variant="outline"
// 								size="sm"
// 								className={`h-7 px-2.5 text-xs transition-colors ${
// 									user.status === "Active"
// 										? "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
// 										: "hover:bg-green-50 hover:text-green-600 hover:border-green-200"
// 								}`}
// 								onClick={() => onToggleStatus(user.id)}
// 								disabled={loadingUserId === user.id}
// 							>
// 								{loadingUserId === user.id ? (
// 									<div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
// 								) : user.status === "Active" ? (
// 									<ShieldOff className="h-3 w-3" />
// 								) : (
// 									<Shield className="h-3 w-3" />
// 								)}
// 							</Button>
// 						</div>
// 					</div>
// 				</div>
// 			</Card>
// 		);
// 	},
// );

// UserCard.displayName = "UserCard";

// // Desktop UserRow component (updated with new features)
// const UserRow = memo(
// 	({
// 		user,
// 		index,
// 		loadingUserId,
// 		selectedUsers,
// 		onViewUser,
// 		onToggleStatus,
// 		onDeleteElevenLabs,
// 		onSelectUser,
// 	}: {
// 		user: FrontendUser;
// 		index: number;
// 		loadingUserId: string | null;
// 		selectedUsers: Set<string>;
// 		onViewUser: (userId: string) => void;
// 		onToggleStatus: (userId: string) => void;
// 		onDeleteElevenLabs: (userId: string) => void;
// 		onSelectUser: (userId: string, checked: boolean) => void;
// 	}) => {
// 		return (
// 			<tr className={`border-b hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-muted/20" : ""}`}>
// 				<td className="py-6 px-3">
// 					<Checkbox
// 						checked={selectedUsers.has(user.id)}
// 						onCheckedChange={(checked) => onSelectUser(user.id, checked as boolean)}
// 						aria-label={`Select ${user.name}`}
// 					/>
// 				</td>
// 				<td className="py-6 px-4 relative">
// 					<div className="flex items-center space-x-2 relative z-0">
// 						<Avatar className="h-9 w-9 relative z-0">
// 							<AvatarImage src={getProfilePictureUrl(user.avatar)} alt={user.name} className="object-cover" />
// 							<AvatarFallback className={`text-xs font-medium text-white ${getAvatarBgColor(user.id)}`}>
// 								{user.name
// 									.split(" ")
// 									.map((n: string) => n[0])
// 									.join("")
// 									.toUpperCase()
// 									.slice(0, 2)}
// 							</AvatarFallback>
// 						</Avatar>
// 						<div className="space-y-1">
// 							<p className="font-medium text-sm leading-none">{user.name}</p>
// 							<p className="text-xs text-muted-foreground">{user.email}</p>
// 						</div>
// 					</div>
// 				</td>
// 				<td className="py-6 px-3">
// 					<Badge variant={getPlanBadgeVariant(user.plan)} className="text-xs">
// 						{user.plan}
// 					</Badge>
// 				</td>
// 				<td className="py-6 px-3">
// 					<Badge variant={getStatusBadgeVariant(user.status)} className="text-xs">
// 						{user.status}
// 					</Badge>
// 				</td>
// 				<td className="py-6 px-3">
// 					<div className="space-y-1 w-full">
// 						<div className="text-xs font-medium">
// 							{user.minutesUsed.toFixed(1)}/{user.minutesTotal}
// 						</div>
// 						<div className="w-full bg-muted rounded-full h-1.5">
// 							<div
// 								className="bg-primary h-1.5 rounded-full transition-all duration-300"
// 								style={{ width: `${user.minutesTotal > 0 ? Math.min((user.minutesUsed / user.minutesTotal) * 100, 100) : 0}%` }}
// 							/>
// 						</div>
// 					</div>
// 				</td>
// 				<td className="py-6 px-3 text-xs text-muted-foreground">
// 					{new Date(user.joinDate).toLocaleDateString("en-US", {
// 						month: "short",
// 						day: "numeric",
// 						year: "numeric",
// 					})}
// 				</td>
// 				<td className="py-6 px-3 text-xs text-muted-foreground">
// 					{user.lastAccess ? (
// 						new Date(user.lastAccess).toLocaleDateString("en-US", {
// 							month: "short",
// 							day: "numeric",
// 							year: "numeric",
// 						})
// 					) : (
// 						new Date().toLocaleDateString("en-US", {
// 							month: "short",
// 							day: "numeric",
// 							year: "numeric",
// 						})
// 					)}
// 				</td>
// 				<td className="py-6 px-3">
// 					<div className="flex items-center gap-1 w-full">
// 						<Button
// 							variant="outline"
// 							size="sm"
// 							className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 flex-shrink-0"
// 							title="View Details"
// 							onClick={() => onViewUser(user.id)}
// 						>
// 							<Eye className="h-3 w-3" />
// 						</Button>
// 						<Button
// 							variant="outline"
// 							size="sm"
// 							className={`h-7 w-7 p-0 transition-colors flex-shrink-0 ${
// 								user.status === "Active" || user.status === "Active (Comped)"
// 									? "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
// 									: "hover:bg-green-50 hover:text-green-600 hover:border-green-200"
// 							}`}
// 							onClick={() => onToggleStatus(user.id)}
// 							disabled={loadingUserId === user.id}
// 							title={user.status === "Active" || user.status === "Active (Comped)" ? "Suspend User" : "Activate User"}
// 						>
// 							{loadingUserId === user.id ? (
// 								<div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
// 							) : user.status === "Active" || user.status === "Active (Comped)" ? (
// 								<ShieldOff className="h-3 w-3" />
// 							) : (
// 								<Shield className="h-3 w-3" />
// 							)}
// 						</Button>
// 						<Button
// 							variant="destructive"
// 							size="sm"
// 							className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-700 hover:border-red-300 flex-shrink-0"
// 							title="Delete ElevenLabs Data"
// 							onClick={() => onDeleteElevenLabs(user.id)}
// 						>
// 							<Trash2 className="h-3 w-3" />
// 						</Button>
// 					</div>
// 				</td>
// 			</tr>
// 		);
// 	},
// );

// UserRow.displayName = "UserRow";

// // Helper functions moved outside component to prevent re-creation
// const getPlanBadgeVariant = (plan: string) => {
// 	switch (plan) {
// 		case "Free":
// 			return "secondary" as const;
// 		case "Premium":
// 			return "default" as const;
// 		case "Super":
// 			return "destructive" as const;
// 		default:
// 			return "secondary" as const;
// 	}
// };

// const getStatusBadgeVariant = (status: string) => {
// 	if (status.includes("Suspended")) {
// 		return "destructive" as const;
// 	} else if (status.includes("Active")) {
// 		return "default" as const;
// 	}
// 	return "secondary" as const;
// };

// // Get complete profile picture URL
// const getProfilePictureUrl = (avatarPath: string | null | undefined) => {
// 	if (!avatarPath || avatarPath.trim() === "") {
// 		return "";
// 	}

// 	// If the path already includes the base URL, return as is
// 	if (avatarPath.startsWith("http")) {
// 		return avatarPath;
// 	}

// 	// Remove leading slash if present to avoid double slashes
// 	const cleanPath = avatarPath.startsWith("/") ? avatarPath.slice(1) : avatarPath;

// 	return `${PROFILE_PICTURE_BASE_URL}/${cleanPath}`;
// };

// // Generate consistent avatar background color based on user ID
// const getAvatarBgColor = (userId: string) => {
// 	let hash = 0;
// 	for (let i = 0; i < userId.length; i++) {
// 		const char = userId.charCodeAt(i);
// 		hash = (hash << 5) - hash + char;
// 		hash = hash & hash; // Convert to 32bit integer
// 	}
// 	const index = Math.abs(hash) % AVATAR_COLORS.length;
// 	return AVATAR_COLORS[index];
// };

// // React Query keys
// const QUERY_KEYS = {
// 	users: ["users"] as const,
// };

// export default function UsersPage() {
// 	const navigate = useNavigate();
// 	const queryClient = useQueryClient();
// 	const [searchTerm, setSearchTerm] = useState("");
// 	const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
	
// 	// Filter states
// 	const [statusFilter, setStatusFilter] = useState<string>("all");
// 	const [planFilter, setPlanFilter] = useState<string>("all");
// 	const [sortBy, setSortBy] = useState<string>("name");
// 	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
// 	const [inactivityFilter, setInactivityFilter] = useState<string>("all");
// 	const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
// 	const [showBulkActions, setShowBulkActions] = useState(false);

// 	// Fetch users with React Query
// 	const {
// 		data: usersData,
// 		isLoading,
// 		error,
// 	} = useQuery({
// 		queryKey: QUERY_KEYS.users,
// 		queryFn: () => adminUsersService.getUsers(1, 200), // Get first 200 users
// 	});

// 	const users = usersData?.users || [];
// 	// console.log("Users data fetched from index users page---->",usersData);

// 	// Helper function to calculate days since last access
// 	const getDaysSinceLastAccess = (user: FrontendUser) => {
// 		const lastAccess = user.lastAccess || user.lastActive;
// 		if (!lastAccess) return 0;
// 		const lastAccessDate = new Date(lastAccess);
// 		const today = new Date();
// 		const diffTime = Math.abs(today.getTime() - lastAccessDate.getTime());
// 		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// 	};

// 	// Filter and sort users
// 	const filteredUsers = useMemo(() => {
// 		let filtered = users.filter((user) => {
// 			// Text search
// 			const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// 				user.email.toLowerCase().includes(searchTerm.toLowerCase());
			
// 			// Status filter
// 			const matchesStatus = statusFilter === "all" || 
// 				(statusFilter === "active" && (user.status === "Active" || user.status === "Active (Comped)") ) ||
// 				(statusFilter === "suspended" && user.status === "Suspended");
			
// 			// Plan filter
// 			const matchesPlan = planFilter === "all" ||
// 				(planFilter === "free" && user.plan === "Free") ||
// 				(planFilter === "premium" && user.plan === "Premium") ||
// 				(planFilter === "super" && user.plan === "Super");
			
// 			// Inactivity filter
// 			let matchesInactivity = true;
// 			if (inactivityFilter !== "all") {
// 				const daysSinceLastAccess = getDaysSinceLastAccess(user);
// 				const threshold = parseInt(inactivityFilter);
// 				matchesInactivity = daysSinceLastAccess >= threshold;
// 			}
			
// 			return matchesSearch && matchesStatus && matchesPlan && matchesInactivity;
// 		});

// 		// Sort users
// 		filtered.sort((a, b) => {
// 			let aValue: any = a[sortBy as keyof FrontendUser];
// 			let bValue: any = b[sortBy as keyof FrontendUser];
			
// 			// Handle special sorting cases
// 			if (sortBy === "joinDate" || sortBy === "lastAccess") {
// 				aValue = new Date(aValue || 0).getTime();
// 				bValue = new Date(bValue || 0).getTime();
// 			} else if (typeof aValue === 'string') {
// 				aValue = aValue.toLowerCase();
// 				bValue = bValue.toLowerCase();
// 			}
			
// 			if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
// 			if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
// 			return 0;
// 		});

// 		return filtered;
// 	}, [users, searchTerm, statusFilter, planFilter, inactivityFilter, sortBy, sortOrder]);

// 	// Toggle user suspension mutation
// 	const toggleSuspensionMutation = useMutation({
// 		mutationFn: adminUsersService.toggleUserSuspension,
// 		onMutate: (userId) => {
// 			setLoadingUserId(userId);
// 		},
// 		onSuccess: (updatedUser) => {
// 			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
// 			console.log("Updated user status from users index file--->",updatedUser);
// 			const action = updatedUser.status === "Suspended" || "Suspended (Comped)" ? "suspended" : "activated";
// 			if (updatedUser.status === "Suspended" || updatedUser.status === "Suspended (Comped)") {
// 				toast.error(`${updatedUser.name} has been ${action}`);
// 			} else {
// 				toast.success(`${updatedUser.name} has been ${action}`);
// 			}
// 		},
// 		onError: (error: Error) => {
// 			toast.error(error.message || "Failed to update user status");
// 		},
// 		onSettled: () => {
// 			setLoadingUserId(null);
// 		},
// 	});

// 	// Delete user ElevenLabs data mutation
// 	const deleteElevenLabsMutation = useMutation({
// 		mutationFn: adminUsersService.deleteUserElevenLabsData,
// 		onSuccess: (updatedUser) => {
// 			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
// 			toast.success(`${updatedUser.name}'s ElevenLabs data has been deleted`);
// 		},
// 		onError: (error: Error) => {
// 			toast.error(error.message || "Failed to delete ElevenLabs data");
// 		},
// 	});

// 	// Bulk actions mutation
// 	const bulkActionsMutation = useMutation({
// 		mutationFn: adminUsersService.bulkActions,
// 		onSuccess: (response) => {
// 			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
// 			setSelectedUsers(new Set());
// 			setShowBulkActions(false);
			
// 			// const { successful = 0, failed = 0, totalProcessed } = response.data;
// 			const { totalProcessed } = response;
// 			if (!totalProcessed || totalProcessed===0) {
// 				toast.error(`Total Processed: ${totalProcessed}`);
// 			} else {
// 				toast.success(`Bulk action completed successfully: ${totalProcessed} users processed`);
// 			}
// 			// toast.success(`Bulk action completed successfully: ${totalProcessed} users processed`);
// 		},
// 		onError: (error: Error) => {
// 			toast.error(error.message || "Failed to perform bulk action");
// 		},
// 	});

// 	// Memoized callback functions to prevent unnecessary re-renders
// 	const handleViewUser = useCallback(
// 		(userId: string) => {
// 			navigate(`/users/${userId}`);
// 		},
// 		[navigate],
// 	);

// 	const handleToggleStatus = useCallback(
// 		(userId: string) => {
// 			toggleSuspensionMutation.mutate(userId);
// 		},
// 		[toggleSuspensionMutation],
// 	);

// 	const handleDeleteElevenLabs = useCallback(
// 		(userId: string) => {
// 			deleteElevenLabsMutation.mutate(userId);
// 		},
// 		[deleteElevenLabsMutation],
// 	);

// 	const handleSelectUser = useCallback((userId: string, checked: boolean) => {
// 		setSelectedUsers(prev => {
// 			const newSet = new Set(prev);
// 			if (checked) {
// 				newSet.add(userId);
// 			} else {
// 				newSet.delete(userId);
// 			}
// 			return newSet;
// 		});
// 	}, []);

// 	const handleSelectAll = useCallback((checked: boolean) => {
// 		if (checked) {
// 			setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
// 		} else {
// 			setSelectedUsers(new Set());
// 		}
// 	}, [filteredUsers]);

// 	const handleBulkAction = useCallback((action: 'suspend' | 'unsuspend' | 'delete') => {
// 		if (selectedUsers.size === 0) {
// 			toast.error("Please select users first");
// 			return;
// 		}

// 		const userIds = Array.from(selectedUsers);
// 		bulkActionsMutation.mutate({ userIds, action });
// 	}, [selectedUsers, bulkActionsMutation]);

// 	const handleSortChange = useCallback((field: string) => {
// 		if (sortBy === field) {
// 			setSortOrder(prev => prev === "asc" ? "desc" : "asc");
// 		} else {
// 			setSortBy(field);
// 			setSortOrder("asc");
// 		}
// 	}, [sortBy]);

// const totalRevenue = users
// 		.filter((u) => u.subscription && u.subscription.packageSnapshot.price > 0 && (u.status === "Active" || u.status === "Active (Comped)"))
// 		.reduce((sum, u) => sum + (u.subscription?.packageSnapshot.price || 0), 0);

// 	// Show loading state
// 	if (isLoading) {
// 		return (
// 			<div className="flex flex-col h-screen overflow-hidden items-center justify-center">
// 				<div className="text-center">
// 					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
// 					<p>Loading users...</p>
// 				</div>
// 			</div>
// 		);
// 	}

// 	// Show error state
// 	if (error) {
// 		return (
// 			<div className="flex flex-col h-screen overflow-hidden items-center justify-center">
// 				<div className="text-center">
// 					<p className="text-red-500 mb-4">Failed to load users</p>
// 					<Button onClick={() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users })}>Try Again</Button>
// 				</div>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="flex flex-col h-screen overflow-hidden">
// 			{/* Mobile Header - Show only on mobile */}
// 			<div className="md:hidden p-4 border-b bg-background">
// 				<div className="flex items-center justify-between">
// 					<h1 className="text-xl font-semibold">Users</h1>
// 					<div className="text-sm text-muted-foreground">{filteredUsers.length} total</div>
// 				</div>
// 			</div>

// 			{/* Fixed Stats Cards - Hidden on mobile */}
// 			<div className="flex-shrink-0 p-6 hidden md:block">
// 				<div className="grid gap-4 md:grid-cols-4">
// 					<Card className="p-4">
// 						<div className="flex items-center justify-between">
// 							<div className="space-y-1">
// 								<p className="text-sm font-medium text-muted-foreground">Total Users</p>
// 								<p className="text-2xl font-semibold">{users.length}</p>
// 							</div>
// 							<Users className="h-8 w-8 text-muted-foreground" />
// 						</div>
// 					</Card>

// 					<Card className="p-4">
// 						<div className="flex items-center justify-between">
// 							<div className="space-y-1">
// 								<p className="text-sm font-medium text-muted-foreground">Active Users</p>
// 								<p className="text-2xl font-semibold">{users.filter((u) => u.status === "Active" || u.status === "Active (Comped)").length}</p>
// 							</div>
// 							<UserCheck className="h-8 w-8 text-muted-foreground" />
// 						</div>
// 					</Card>

// 					<Card className="p-4">
// 						<div className="flex items-center justify-between">
// 							<div className="space-y-1">
// 								<p className="text-sm font-medium text-muted-foreground">Premium Users</p>
// 								<p className="text-2xl font-semibold">{users.filter((u) => u.plan !== "Free").length}</p>
// 							</div>
// 							<Crown className="h-8 w-8 text-muted-foreground" />
// 						</div>
// 					</Card>

// 					<Card className="p-4">
// 						<div className="flex items-center justify-between">
// 							<div className="space-y-1">
// 								<p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
// 								<p className="text-2xl font-semibold">
// 									€{totalRevenue.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
// 								</p>
// 							</div>
// 							<Euro className="h-8 w-8 text-muted-foreground" />
// 						</div>
// 					</Card>
// 				</div>
// 			</div>

// 			{/* Scrollable Users Content */}
// 			<div className="flex-1 flex flex-col min-h-0 mx-6 mb-6">
// 				<Card className="flex-1 flex flex-col min-h-0">
// 					<CardHeader className="flex-shrink-0 pb-4">
// 						<div className="space-y-4">
// 							<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
// 								<CardTitle className="text-lg font-medium">All Users ({filteredUsers.length})</CardTitle>
// 								<div className="relative w-full md:w-72">
// 									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
// 									<Input
// 										placeholder="Search users by name or email..."
// 										value={searchTerm}
// 										onChange={(e) => setSearchTerm(e.target.value)}
// 										className="pl-10"
// 									/>
// 								</div>
// 							</div>
							
// 							{/* Filters Row */}
// 							<div className="flex flex-wrap gap-3 items-center">
// 								<div className="flex items-center gap-2">
// 									<Filter className="h-4 w-4 text-muted-foreground" />
// 									<span className="text-sm font-medium">Filters:</span>
// 								</div>
								
// 								<Select value={statusFilter} onValueChange={setStatusFilter}>
// 									<SelectTrigger className="w-32">
// 										<SelectValue placeholder="Status" />
// 									</SelectTrigger>
// 									<SelectContent>
// 										<SelectItem value="all">All Status</SelectItem>
// 										<SelectItem value="active">Active</SelectItem>
// 										<SelectItem value="suspended">Suspended</SelectItem>
// 									</SelectContent>
// 								</Select>
								
// 								<Select value={planFilter} onValueChange={setPlanFilter}>
// 									<SelectTrigger className="w-32">
// 										<SelectValue placeholder="Plan" />
// 									</SelectTrigger>
// 									<SelectContent>
// 										<SelectItem value="all">All Plans</SelectItem>
// 										<SelectItem value="free">Free</SelectItem>
// 										<SelectItem value="premium">Premium</SelectItem>
// 										<SelectItem value="super">Super</SelectItem>
// 									</SelectContent>
// 								</Select>
								
// 								<Select value={inactivityFilter} onValueChange={setInactivityFilter}>
// 									<SelectTrigger className="w-40">
// 										<SelectValue placeholder="Inactivity" />
// 									</SelectTrigger>
// 									<SelectContent>
// 										<SelectItem value="all">All Users</SelectItem>
// 										<SelectItem value="30">30+ days inactive</SelectItem>
// 										<SelectItem value="60">60+ days inactive</SelectItem>
// 										<SelectItem value="90">90+ days inactive</SelectItem>
// 									</SelectContent>
// 								</Select>
								
// 								<div className="flex items-center gap-2 ml-auto">
// 									<Button
// 										variant="outline"
// 										size="sm"
// 										onClick={() => setShowBulkActions(!showBulkActions)}
// 										disabled={selectedUsers.size === 0}
// 										className="gap-2"
// 									>
// 										<Users className="h-4 w-4" />
// 										Bulk Actions ({selectedUsers.size})
// 									</Button>
// 								</div>
// 							</div>
							
// 							{/* Bulk Actions Panel */}
// 							{showBulkActions && selectedUsers.size > 0 && (
// 								<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
// 									<span className="text-sm font-medium">
// 										{selectedUsers.size} user(s) selected:
// 									</span>
// 									<Button
// 										variant="outline"
// 										size="sm"
// 										onClick={() => handleBulkAction('suspend')}
// 										disabled={bulkActionsMutation.isPending}
// 										className="gap-1"
// 									>
// 										<Shield className="h-3 w-3" />
// 										Suspend
// 									</Button>
// 									<Button
// 										variant="outline"
// 										size="sm"
// 										onClick={() => handleBulkAction('unsuspend')}
// 										disabled={bulkActionsMutation.isPending}
// 										className="gap-1"
// 									>
// 										<UserCheck className="h-3 w-3" />
// 										Unsuspend
// 									</Button>
// 									<Button
// 										variant="destructive"
// 										size="sm"
// 										onClick={() => handleBulkAction('delete')}
// 										disabled={bulkActionsMutation.isPending}
// 										className="gap-1"
// 									>
// 										<Trash2 className="h-3 w-3" />
// 										Delete
// 									</Button>
// 									<Button
// 										variant="ghost"
// 										size="sm"
// 										onClick={() => {
// 											setSelectedUsers(new Set());
// 											setShowBulkActions(false);
// 										}}
// 									>
// 										Cancel
// 									</Button>
// 								</div>
// 							)}
// 						</div>
// 					</CardHeader>
// 					<Separator />
// 					<CardContent className="flex-1 min-h-0 p-0">
// 						<ScrollArea className="h-full">
// 							{/* Mobile Card Layout */}
// 							<div className="md:hidden p-4 space-y-4">
// 								{filteredUsers.map((user) => (
// 									<UserCard
// 										key={user.id}
// 										user={user}
// 										loadingUserId={loadingUserId}
// 										onViewUser={handleViewUser}
// 										onToggleStatus={handleToggleStatus}
// 									/>
// 								))}
// 							</div>

// 							{/* Desktop Table Layout */}
// 							<div className="hidden md:block overflow-x-auto">
// 								<div className="min-w-[1000px]">
// 									<table className="w-full">
// 									<thead className="sticky top-0 bg-background border-b z-10">
// 										<tr>
// 											<th className="py-5 px-3 w-8">
// 												<Checkbox
// 													checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
// 													onCheckedChange={handleSelectAll}
// 													aria-label="Select all users"
// 												/>
// 											</th>
// 											<th className="text-left py-5 px-4 font-medium text-sm w-[200px]">
// 												<button
// 													className="flex items-center gap-1 hover:text-primary"
// 													onClick={() => handleSortChange('name')}
// 												>
// 													User
// 													<ArrowUpDown className="h-3 w-3" />
// 												</button>
// 											</th>
// 											<th className="text-left py-5 px-3 font-medium text-sm w-[80px]">Plan</th>
// 											<th className="text-left py-5 px-3 font-medium text-sm w-[90px]">Status</th>
// 											<th className="text-left py-5 px-3 font-medium text-sm w-[100px]">Usage</th>
// 											<th className="text-left py-5 px-3 font-medium text-sm w-[110px]">
// 												<button
// 													className="flex items-center gap-1 hover:text-primary"
// 													onClick={() => handleSortChange('joinDate')}
// 												>
// 													<Calendar className="h-3 w-3" />
// 													Joined
// 													<ArrowUpDown className="h-3 w-3" />
// 												</button>
// 											</th>
// 											<th className="text-left py-5 px-3 font-medium text-sm w-[110px]">
// 												<button
// 													className="flex items-center gap-1 hover:text-primary"
// 													onClick={() => handleSortChange('lastAccess')}
// 												>
// 													<Clock className="h-3 w-3" />
// 													Last Access
// 													<ArrowUpDown className="h-3 w-3" />
// 												</button>
// 											</th>
// 											<th className="text-left py-5 px-3 font-medium text-sm w-[140px]">Actions</th>
// 										</tr>
// 									</thead>
// 									<tbody>
// 										{filteredUsers.map((user, index) => (
// 											<UserRow
// 												key={user.id}
// 												user={user}
// 												index={index}
// 												loadingUserId={loadingUserId}
// 												selectedUsers={selectedUsers}
// 												onViewUser={handleViewUser}
// 												onToggleStatus={handleToggleStatus}
// 												onDeleteElevenLabs={handleDeleteElevenLabs}
// 												onSelectUser={handleSelectUser}
// 											/>
// 										))}
// 									</tbody>
// 									</table>
// 								</div>
// 							</div>
// 						</ScrollArea>
// 					</CardContent>
// 				</Card>
// 			</div>
// 		</div>
// 	);
// }

import NoUsersFound from "@/pages/users/components/NoUsersFound";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	ArrowUpDown,
	Calendar,
	Clock,
	Crown,
	Euro,
	Eye,
	Filter,
	Search,
	Shield,
	ShieldOff,
	Trash2,
	UserCheck,
	Users,
	RotateCcw,
} from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { FrontendUser } from "@/api/services/adminUsersService";
import adminUsersService from "@/api/services/adminUsersService";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { ScrollArea } from "@/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Separator } from "@/ui/separator";
import { Checkbox } from "@/ui/checkbox";

// Base URL for profile pictures
const PROFILE_PICTURE_BASE_URL = "https://selftalk-backend-yw3r.onrender.com";

// Avatar background colors for fallbacks
const AVATAR_COLORS = [
	"bg-red-500",
	"bg-orange-500",
	"bg-amber-500",
	"bg-yellow-500",
	"bg-lime-500",
	"bg-green-500",
	"bg-emerald-500",
	"bg-teal-500",
	"bg-cyan-500",
	"bg-sky-500",
	"bg-blue-500",
	"bg-indigo-500",
	"bg-violet-500",
	"bg-purple-500",
	"bg-fuchsia-500",
	"bg-pink-500",
	"bg-rose-500",
];

// Mobile-optimized UserCard component
const UserCard = memo(
	({
		user,
		loadingUserId,
		onViewUser,
		onToggleStatus,
	}: {
		user: FrontendUser;
		loadingUserId: string | null;
		onViewUser: (userId: string) => void;
		onToggleStatus: (userId: string) => void;
	}) => {
		return (
			<Card className="p-4 hover:shadow-sm transition-shadow border border-border/40">
				<div className="space-y-3">
					{/* Header with Avatar and Badges */}
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3 flex-1 min-w-0">
							<Avatar className="h-11 w-11 flex-shrink-0">
								<AvatarImage src={getProfilePictureUrl(user.avatar)} alt={user.name} className="object-cover" />
								<AvatarFallback className={`text-xs font-medium text-white ${getAvatarBgColor(user.id)}`}>
									{user.name
										.split(" ")
										.map((n: string) => n[0])
										.join("")
										.toUpperCase()
										.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div className="space-y-1 flex-1 min-w-0">
								<p className="font-medium text-sm leading-none truncate">{user.name}</p>
								<p className="text-xs text-muted-foreground truncate">{user.email}</p>
								<div className="flex items-center gap-1.5 mt-1">
									<Badge variant={getPlanBadgeVariant(user.plan)} className="text-[10px] px-1.5 py-0.5 h-auto">
										{user.plan}
									</Badge>
									<Badge variant={getStatusBadgeVariant(user.status)} className="text-[10px] px-1.5 py-0.5 h-auto">
										{user.status}
									</Badge>
								</div>
							</div>
						</div>
					</div>

					{/* Usage Progress */}
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">Usage</span>
							<span className="font-medium">
								{user.minutesUsed}/{user.minutesTotal} min
							</span>
						</div>
						<div className="w-full bg-muted rounded-full h-1.5">
							<div
								className="bg-primary h-1.5 rounded-full transition-all duration-300"
								style={{ width: `${Math.min((user.minutesUsed / user.minutesTotal) * 100, 100)}%` }}
							/>
						</div>
					</div>

					{/* Footer with Join Date and Actions */}
					<div className="flex items-center justify-between pt-1">
						<span className="text-xs text-muted-foreground">
							Joined{" "}
							{new Date(user.joinDate).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "2-digit",
							})}
						</span>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								className="h-7 px-2.5 text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
								onClick={() => onViewUser(user.id)}
							>
								<Eye className="h-3 w-3 mr-1" />
								View
							</Button>
							<Button
								variant="outline"
								size="sm"
								className={`h-7 px-2.5 text-xs transition-colors ${
									user.status === "Active" || user.status === "Active (Comped)"
										? "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
										: "hover:bg-green-50 hover:text-green-600 hover:border-green-200"
								}`}
								onClick={() => onToggleStatus(user.id)}
								disabled={loadingUserId === user.id}
							>
								{loadingUserId === user.id ? (
									<div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
								) : user.status === "Active" || user.status === "Active (Comped)" ? (
									<ShieldOff className="h-3 w-3" />
								) : (
									<Shield className="h-3 w-3" />
								)}
							</Button>
						</div>
					</div>
				</div>
			</Card>
		);
	},
);

UserCard.displayName = "UserCard";

// Desktop UserRow component
const UserRow = memo(
	({
		user,
		index,
		loadingUserId,
		selectedUsers,
		onViewUser,
		onToggleStatus,
		onDeleteElevenLabs,
		onSelectUser,
	}: {
		user: FrontendUser;
		index: number;
		loadingUserId: string | null;
		selectedUsers: Set<string>;
		onViewUser: (userId: string) => void;
		onToggleStatus: (userId: string) => void;
		onDeleteElevenLabs: (userId: string) => void;
		onSelectUser: (userId: string, checked: boolean) => void;
	}) => {
		const lastAccess = user.lastAccess || user.lastActive;

		return (
			<tr className={`border-b hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-muted/20" : ""}`}>
				<td className="py-6 px-3">
					<Checkbox
						checked={selectedUsers.has(user.id)}
						onCheckedChange={(checked) => onSelectUser(user.id, checked as boolean)}
						aria-label={`Select ${user.name}`}
					/>
				</td>
				<td className="py-6 px-4 relative">
					<div className="flex items-center space-x-2 relative z-0">
						<Avatar className="h-9 w-9 relative z-0">
							<AvatarImage src={getProfilePictureUrl(user.avatar)} alt={user.name} className="object-cover" />
							<AvatarFallback className={`text-xs font-medium text-white ${getAvatarBgColor(user.id)}`}>
								{user.name
									.split(" ")
									.map((n: string) => n[0])
									.join("")
									.toUpperCase()
									.slice(0, 2)}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-1">
							<p className="font-medium text-sm leading-none">{user.name}</p>
							<p className="text-xs text-muted-foreground">{user.email}</p>
						</div>
					</div>
				</td>
				<td className="py-6 px-3">
					<Badge variant={getPlanBadgeVariant(user.plan)} className="text-xs">
						{user.plan}
					</Badge>
				</td>
				<td className="py-6 px-3">
					<Badge variant={getStatusBadgeVariant(user.status)} className="text-xs">
						{user.status}
					</Badge>
				</td>
				<td className="py-6 px-3">
					<div className="space-y-1 w-full">
						<div className="text-xs font-medium">
							{user.minutesUsed.toFixed(1)}/{user.minutesTotal}
						</div>
						<div className="w-full bg-muted rounded-full h-1.5">
							<div
								className="bg-primary h-1.5 rounded-full transition-all duration-300"
								style={{ width: `${user.minutesTotal > 0 ? Math.min((user.minutesUsed / user.minutesTotal) * 100, 100) : 0}%` }}
							/>
						</div>
					</div>
				</td>
				<td className="py-6 px-3 text-xs text-muted-foreground">
					{new Date(user.joinDate).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})}
				</td>
				<td className="py-6 px-3 text-xs text-muted-foreground">
					{lastAccess ? (
						new Date(lastAccess).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})
					) : (
						"-"
					)}
				</td>
				<td className="py-6 px-3">
					<div className="flex items-center gap-1 w-full">
						<Button
							variant="outline"
							size="sm"
							className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 flex-shrink-0"
							title="View Details"
							onClick={() => onViewUser(user.id)}
						>
							<Eye className="h-3 w-3" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							className={`h-7 w-7 p-0 transition-colors flex-shrink-0 ${
								user.status === "Active" || user.status === "Active (Comped)"
									? "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
									: "hover:bg-green-50 hover:text-green-600 hover:border-green-200"
							}`}
							onClick={() => onToggleStatus(user.id)}
							disabled={loadingUserId === user.id}
							title={user.status === "Active" || user.status === "Active (Comped)" ? "Suspend User" : "Activate User"}
						>
							{loadingUserId === user.id ? (
								<div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
							) : user.status === "Active" || user.status === "Active (Comped)" ? (
								<ShieldOff className="h-3 w-3" />
							) : (
								<Shield className="h-3 w-3" />
							)}
						</Button>
						<Button
							variant="destructive"
							size="sm"
							className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-700 hover:border-red-300 flex-shrink-0"
							title="Delete ElevenLabs Data"
							onClick={() => onDeleteElevenLabs(user.id)}
						>
							<Trash2 className="h-3 w-3" />
						</Button>
					</div>
				</td>
			</tr>
		);
	},
);

UserRow.displayName = "UserRow";

// Helper functions
const getPlanBadgeVariant = (plan: string) => {
	switch (plan) {
		case "Free":
			return "secondary" as const;
		case "Premium":
			return "default" as const;
		case "Super":
			return "destructive" as const;
		default:
			return "secondary" as const;
	}
};

const getStatusBadgeVariant = (status: string) => {
	if (status.includes("Suspended")) {
		return "destructive" as const;
	} else if (status.includes("Active")) {
		return "default" as const;
	}
	return "secondary" as const;
};

const getProfilePictureUrl = (avatarPath: string | null | undefined) => {
	if (!avatarPath || avatarPath.trim() === "") {
		return "";
	}
	if (avatarPath.startsWith("http")) {
		return avatarPath;
	}
	const cleanPath = avatarPath.startsWith("/") ? avatarPath.slice(1) : avatarPath;
	return `${PROFILE_PICTURE_BASE_URL}/${cleanPath}`;
};

const getAvatarBgColor = (userId: string) => {
	let hash = 0;
	for (let i = 0; i < userId.length; i++) {
		const char = userId.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	const index = Math.abs(hash) % AVATAR_COLORS.length;
	return AVATAR_COLORS[index];
};

// React Query keys
const QUERY_KEYS = {
	users: ["users"] as const,
};

export default function UsersPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const DEFAULT_SORT_BY = "name";
	const DEFAULT_SORT_ORDER: "asc" | "desc" = "asc";

	const [searchTerm, setSearchTerm] = useState("");
	const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

	// Filter states
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [planFilter, setPlanFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<string>(DEFAULT_SORT_BY);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">(DEFAULT_SORT_ORDER);
	const [inactivityFilter, setInactivityFilter] = useState<string>("all");
	const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
	const [showBulkActions, setShowBulkActions] = useState(false);

	const {
		data: usersData,
		isLoading,
		error,
	} = useQuery({
		queryKey: QUERY_KEYS.users,
		queryFn: () => adminUsersService.getUsers(1, 200),
	});

	const users = usersData?.users || [];

	const getDaysSinceLastAccess = (user: FrontendUser) => {
		const lastAccess = user.lastAccess || user.lastActive;
		if (!lastAccess) return 0;
		const lastAccessDate = new Date(lastAccess);
		const today = new Date();
		const diffTime = Math.abs(today.getTime() - lastAccessDate.getTime());
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	};

	const filteredUsers = useMemo(() => {
		let filtered = users.filter((user) => {
			const matchesSearch =
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "active" && (user.status === "Active" || user.status === "Active (Comped)")) ||
				(statusFilter === "suspended" && (user.status === "Suspended" || user.status === "Suspended (Comped)"));

			const matchesPlan =
				planFilter === "all" ||
				(planFilter === "free" && user.plan === "Free") ||
				(planFilter === "premium" && user.plan === "Premium") ||
				(planFilter === "super" && user.plan === "Super");

			let matchesInactivity = true;
			if (inactivityFilter !== "all") {
				const daysSinceLastAccess = getDaysSinceLastAccess(user);
				const threshold = parseInt(inactivityFilter, 10);
				matchesInactivity = daysSinceLastAccess >= threshold;
			}

			return matchesSearch && matchesStatus && matchesPlan && matchesInactivity;
		});

		filtered.sort((a, b) => {
			let aValue: any = a[sortBy as keyof FrontendUser];
			let bValue: any = b[sortBy as keyof FrontendUser];

			if (sortBy === "joinDate") {
				aValue = new Date(a.joinDate || 0).getTime();
				bValue = new Date(b.joinDate || 0).getTime();
			} else if (sortBy === "lastAccess") {
				const aLast = (a.lastAccess || a.lastActive || 0) as any;
				const bLast = (b.lastAccess || b.lastActive || 0) as any;
				aValue = new Date(aLast || 0).getTime();
				bValue = new Date(bLast || 0).getTime();
			} else if (typeof aValue === "string") {
				aValue = aValue.toLowerCase();
				bValue = bValue.toLowerCase();
			}

			if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
			if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});

		return filtered;
	}, [users, searchTerm, statusFilter, planFilter, inactivityFilter, sortBy, sortOrder]);

	const isDefaultFilters = useMemo(() => {
		return (
			searchTerm === "" &&
			statusFilter === "all" &&
			planFilter === "all" &&
			inactivityFilter === "all" &&
			sortBy === DEFAULT_SORT_BY &&
			sortOrder === DEFAULT_SORT_ORDER
		);
	}, [searchTerm, statusFilter, planFilter, inactivityFilter, sortBy, sortOrder]);

	// NEW: clear all filters handler
	const handleClearFilters = useCallback(() => {
		setSearchTerm("");
		setStatusFilter("all");
		setPlanFilter("all");
		setInactivityFilter("all");
		setSortBy(DEFAULT_SORT_BY);
		setSortOrder(DEFAULT_SORT_ORDER);

		// also reset selection/bulk UI so state is consistent after clearing filters
		setSelectedUsers(new Set());
		setShowBulkActions(false);
	}, [DEFAULT_SORT_BY, DEFAULT_SORT_ORDER]);

	const toggleSuspensionMutation = useMutation({
		mutationFn: adminUsersService.toggleUserSuspension,
		onMutate: (userId) => {
			setLoadingUserId(userId);
		},
		onSuccess: (updatedUser) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });

			const isSuspended =
				updatedUser.status === "Suspended" || updatedUser.status === "Suspended (Comped)";
			const action = isSuspended ? "suspended" : "activated";

			if (isSuspended) {
				toast.error(`${updatedUser.name} has been ${action}`);
			} else {
				toast.success(`${updatedUser.name} has been ${action}`);
			}
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update user status");
		},
		onSettled: () => {
			setLoadingUserId(null);
		},
	});

	const deleteElevenLabsMutation = useMutation({
		mutationFn: adminUsersService.deleteUserElevenLabsData,
		onSuccess: (updatedUser) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
			toast.success(`${updatedUser.name}'s ElevenLabs data has been deleted`);
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete ElevenLabs data");
		},
	});

	const bulkActionsMutation = useMutation({
		mutationFn: adminUsersService.bulkActions,
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
			setSelectedUsers(new Set());
			setShowBulkActions(false);

			const { totalProcessed } = response;
			if (!totalProcessed || totalProcessed === 0) {
				toast.error(`Total Processed: ${totalProcessed}`);
			} else {
				toast.success(`Bulk action completed successfully: ${totalProcessed} users processed`);
			}
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to perform bulk action");
		},
	});

	const handleViewUser = useCallback(
		(userId: string) => {
			navigate(`/users/${userId}`);
		},
		[navigate],
	);

	const handleToggleStatus = useCallback(
		(userId: string) => {
			toggleSuspensionMutation.mutate(userId);
		},
		[toggleSuspensionMutation],
	);

	const handleDeleteElevenLabs = useCallback(
		(userId: string) => {
			deleteElevenLabsMutation.mutate(userId);
		},
		[deleteElevenLabsMutation],
	);

	const handleSelectUser = useCallback((userId: string, checked: boolean) => {
		setSelectedUsers((prev) => {
			const newSet = new Set(prev);
			if (checked) {
				newSet.add(userId);
			} else {
				newSet.delete(userId);
			}
			return newSet;
		});
	}, []);

	const handleSelectAll = useCallback(
		(checked: boolean) => {
			if (checked) {
				setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
			} else {
				setSelectedUsers(new Set());
			}
		},
		[filteredUsers],
	);

	const handleBulkAction = useCallback(
		(action: "suspend" | "unsuspend" | "delete") => {
			if (selectedUsers.size === 0) {
				toast.error("Please select users first");
				return;
			}
			const userIds = Array.from(selectedUsers);
			bulkActionsMutation.mutate({ userIds, action });
		},
		[selectedUsers, bulkActionsMutation],
	);

	const handleSortChange = useCallback(
		(field: string) => {
			if (sortBy === field) {
				setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
			} else {
				setSortBy(field);
				setSortOrder("asc");
			}
		},
		[sortBy],
	);

	const totalRevenue = users
		.filter(
			(u) =>
				u.subscription &&
				u.subscription.packageSnapshot.price > 0 &&
				(u.status === "Active" || u.status === "Active (Comped)"),
		)
		.reduce((sum, u) => sum + (u.subscription?.packageSnapshot.price || 0), 0);

	if (isLoading) {
		return (
			<div className="flex flex-col h-screen overflow-hidden items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p>Loading users...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col h-screen overflow-hidden items-center justify-center">
				<div className="text-center">
					<p className="text-red-500 mb-4">Failed to load users</p>
					<Button onClick={() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users })}>Try Again</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-screen overflow-hidden">
			<div className="md:hidden p-4 border-b bg-background">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-semibold">Users</h1>
					<div className="text-sm text-muted-foreground">{filteredUsers.length} total</div>
				</div>
			</div>

			<div className="flex-shrink-0 p-6 hidden md:block">
				<div className="grid gap-4 md:grid-cols-4">
					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">Total Users</p>
								<p className="text-2xl font-semibold">{users.length}</p>
							</div>
							<Users className="h-8 w-8 text-muted-foreground" />
						</div>
					</Card>

					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">Active Users</p>
								<p className="text-2xl font-semibold">
									{users.filter((u) => u.status === "Active" || u.status === "Active (Comped)").length}
								</p>
							</div>
							<UserCheck className="h-8 w-8 text-muted-foreground" />
						</div>
					</Card>

					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">Premium Users</p>
								<p className="text-2xl font-semibold">{users.filter((u) => u.plan !== "Free").length}</p>
							</div>
							<Crown className="h-8 w-8 text-muted-foreground" />
						</div>
					</Card>

					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
								<p className="text-2xl font-semibold">
									€{totalRevenue.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</p>
							</div>
							<Euro className="h-8 w-8 text-muted-foreground" />
						</div>
					</Card>
				</div>
			</div>

			<div className="flex-1 flex flex-col min-h-0 mx-6 mb-6">
				<Card className="flex-1 flex flex-col min-h-0">
					<CardHeader className="flex-shrink-0 pb-4">
						<div className="space-y-4">
							<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
								<CardTitle className="text-lg font-medium">All Users ({filteredUsers.length})</CardTitle>
								<div className="relative w-full md:w-72">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
									<Input
										placeholder="Search users by name or email..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10"
									/>
								</div>
							</div>

							{/* Filters Row */}
							<div className="flex flex-wrap gap-3 items-center">
								<div className="flex items-center gap-2">
									<Filter className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm font-medium">Filters:</span>
								</div>

								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="w-32">
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Status</SelectItem>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="suspended">Suspended</SelectItem>
									</SelectContent>
								</Select>

								<Select value={planFilter} onValueChange={setPlanFilter}>
									<SelectTrigger className="w-32">
										<SelectValue placeholder="Plan" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Plans</SelectItem>
										<SelectItem value="free">Free</SelectItem>
										<SelectItem value="premium">Premium</SelectItem>
										<SelectItem value="super">Super</SelectItem>
									</SelectContent>
								</Select>

								<Select value={inactivityFilter} onValueChange={setInactivityFilter}>
									<SelectTrigger className="w-40">
										<SelectValue placeholder="Inactivity" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Users</SelectItem>
										<SelectItem value="30">30+ days inactive</SelectItem>
										<SelectItem value="60">60+ days inactive</SelectItem>
										<SelectItem value="90">90+ days inactive</SelectItem>
									</SelectContent>
								</Select>

								{/* NEW: Clear Filters Button */}
								<Button
									variant="outline"
									size="sm"
									onClick={handleClearFilters}
									disabled={isDefaultFilters}
									className="gap-2"
									title="Clear all filters and reset sorting"
								>
									<RotateCcw className="h-4 w-4" />
									Clear
								</Button>

								<div className="flex items-center gap-2 ml-auto">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setShowBulkActions(!showBulkActions)}
										disabled={selectedUsers.size === 0}
										className="gap-2"
									>
										<Users className="h-4 w-4" />
										Bulk Actions ({selectedUsers.size})
									</Button>
								</div>
							</div>

							{/* Bulk Actions Panel */}
							{showBulkActions && selectedUsers.size > 0 && (
								<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
									<span className="text-sm font-medium">{selectedUsers.size} user(s) selected:</span>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleBulkAction("suspend")}
										disabled={bulkActionsMutation.isPending}
										className="gap-1"
									>
										<Shield className="h-3 w-3" />
										Suspend
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleBulkAction("unsuspend")}
										disabled={bulkActionsMutation.isPending}
										className="gap-1"
									>
										<UserCheck className="h-3 w-3" />
										Unsuspend
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleBulkAction("delete")}
										disabled={bulkActionsMutation.isPending}
										className="gap-1"
									>
										<Trash2 className="h-3 w-3" />
										Delete
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											setSelectedUsers(new Set());
											setShowBulkActions(false);
										}}
									>
										Cancel
									</Button>
								</div>
							)}
						</div>
					</CardHeader>
					<Separator />
					<CardContent className="flex-1 min-h-0 p-0">
						<ScrollArea className="h-full">
							{/* <div className="md:hidden p-4 space-y-4">
								{filteredUsers.map((user) => (
									<UserCard
										key={user.id}
										user={user}
										loadingUserId={loadingUserId}
										onViewUser={handleViewUser}
										onToggleStatus={handleToggleStatus}
									/>
								))}
							</div>

							<div className="hidden md:block overflow-x-auto">
								<div className="min-w-[1000px]">
									<table className="w-full">
										<thead className="sticky top-0 bg-background border-b z-10">
											<tr>
												<th className="py-5 px-3 w-8">
													<Checkbox
														checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
														onCheckedChange={handleSelectAll}
														aria-label="Select all users"
													/>
												</th>
												<th className="text-left py-5 px-4 font-medium text-sm w-[200px]">
													<button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSortChange("name")}>
														User
														<ArrowUpDown className="h-3 w-3" />
													</button>
												</th>
												<th className="text-left py-5 px-3 font-medium text-sm w-[80px]">Plan</th>
												<th className="text-left py-5 px-3 font-medium text-sm w-[90px]">Status</th>
												<th className="text-left py-5 px-3 font-medium text-sm w-[100px]">Usage</th>
												<th className="text-left py-5 px-3 font-medium text-sm w-[110px]">
													<button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSortChange("joinDate")}>
														<Calendar className="h-3 w-3" />
														Joined
														<ArrowUpDown className="h-3 w-3" />
													</button>
												</th>
												<th className="text-left py-5 px-3 font-medium text-sm w-[110px]">
													<button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSortChange("lastAccess")}>
														<Clock className="h-3 w-3" />
														Last Access
														<ArrowUpDown className="h-3 w-3" />
													</button>
												</th>
												<th className="text-left py-5 px-3 font-medium text-sm w-[140px]">Actions</th>
											</tr>
										</thead>
										<tbody>
											{filteredUsers.map((user, index) => (
												<UserRow
													key={user.id}
													user={user}
													index={index}
													loadingUserId={loadingUserId}
													selectedUsers={selectedUsers}
													onViewUser={handleViewUser}
													onToggleStatus={handleToggleStatus}
													onDeleteElevenLabs={handleDeleteElevenLabs}
													onSelectUser={handleSelectUser}
												/>
											))}
										</tbody>
									</table>
								</div>
							</div> */}
							{filteredUsers.length === 0 ? (
	<div className="p-4">
		<NoUsersFound
			onClearFilters={handleClearFilters}
			isClearingDisabled={isDefaultFilters}
		/>
	</div>
) : (
	<>
		{/* Mobile Card Layout */}
		<div className="md:hidden p-4 space-y-4">
			{filteredUsers.map((user) => (
				<UserCard
					key={user.id}
					user={user}
					loadingUserId={loadingUserId}
					onViewUser={handleViewUser}
					onToggleStatus={handleToggleStatus}
				/>
			))}
		</div>

		{/* Desktop Table Layout */}
		<div className="hidden md:block overflow-x-auto">
			<div className="min-w-[1000px]">
				<table className="w-full">
					<thead className="sticky top-0 bg-background border-b z-10">
						<tr>
							<th className="py-5 px-3 w-8">
								<Checkbox
									checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
									onCheckedChange={handleSelectAll}
									aria-label="Select all users"
								/>
							</th>
							<th className="text-left py-5 px-4 font-medium text-sm w-[200px]">
								<button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSortChange("name")}>
									User
									<ArrowUpDown className="h-3 w-3" />
								</button>
							</th>
							<th className="text-left py-5 px-3 font-medium text-sm w-[80px]">Plan</th>
							<th className="text-left py-5 px-3 font-medium text-sm w-[90px]">Status</th>
							<th className="text-left py-5 px-3 font-medium text-sm w-[100px]">Usage</th>
							<th className="text-left py-5 px-3 font-medium text-sm w-[110px]">
								<button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSortChange("joinDate")}>
									<Calendar className="h-3 w-3" />
									Joined
									<ArrowUpDown className="h-3 w-3" />
								</button>
							</th>
							<th className="text-left py-5 px-3 font-medium text-sm w-[110px]">
								<button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSortChange("lastAccess")}>
									<Clock className="h-3 w-3" />
									Last Access
									<ArrowUpDown className="h-3 w-3" />
								</button>
							</th>
							<th className="text-left py-5 px-3 font-medium text-sm w-[140px]">Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredUsers.map((user, index) => (
							<UserRow
								key={user.id}
								user={user}
								index={index}
								loadingUserId={loadingUserId}
								selectedUsers={selectedUsers}
								onViewUser={handleViewUser}
								onToggleStatus={handleToggleStatus}
								onDeleteElevenLabs={handleDeleteElevenLabs}
								onSelectUser={handleSelectUser}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	</>
)}

						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
