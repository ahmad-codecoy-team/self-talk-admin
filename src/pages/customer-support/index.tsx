import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Mail, Search, Users } from "lucide-react";
import { memo, useMemo, useState } from "react";
import supportService, { type SupportRequest } from "@/api/services/supportService";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { ScrollArea } from "@/ui/scroll-area";
import { Separator } from "@/ui/separator";

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

// Helper functions - moved to the top
const getProfilePictureUrl = (avatarPath: string | null | undefined) => {
	if (!avatarPath || avatarPath.trim() === "") {
		return "";
	}

	// If the path already includes the base URL, return as is
	if (avatarPath.startsWith("http")) {
		return avatarPath;
	}

	// Remove leading slash if present to avoid double slashes
	const cleanPath = avatarPath.startsWith("/") ? avatarPath.slice(1) : avatarPath;

	return `${PROFILE_PICTURE_BASE_URL}/${cleanPath}`;
};

// Generate consistent avatar background color based on user ID
const getAvatarBgColor = (userId: string) => {
	let hash = 0;
	for (let i = 0; i < userId.length; i++) {
		const char = userId.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	const index = Math.abs(hash) % AVATAR_COLORS.length;
	return AVATAR_COLORS[index];
};

// Expandable Message Component
const ExpandableMessage = memo(
	({ message, maxLength = 100, className = "" }: { message: string; maxLength?: number; className?: string }) => {
		const [isExpanded, setIsExpanded] = useState(false);

		if (message.length <= maxLength) {
			return <p className={`text-sm text-foreground break-words ${className}`}>{message}</p>;
		}

		return (
			<p className={`text-sm text-foreground break-words ${className}`}>
				{isExpanded ? (
					<>
						{message}{" "}
						<span
							className="text-yellow-600 cursor-pointer hover:text-yellow-700 text-sm"
							onClick={() => setIsExpanded(false)}
						>
							show less
						</span>
					</>
				) : (
					<>
						{message.slice(0, maxLength)}{" "}
						<span
							className="text-yellow-600 cursor-pointer hover:text-yellow-700 text-sm"
							onClick={() => setIsExpanded(true)}
						>
							see more...
						</span>
					</>
				)}
			</p>
		);
	},
);

ExpandableMessage.displayName = "ExpandableMessage";

// Mobile-optimized SupportCard component
const SupportCard = memo(
	({ supportRequest, onSendEmail }: { supportRequest: SupportRequest; onSendEmail: (email: string) => void }) => {
		return (
			<Card className="p-4">
				<div className="space-y-4">
					{/* User Info */}
					<div className="flex items-center space-x-3">
						<Avatar className="h-10 w-10">
							<AvatarImage
								src={getProfilePictureUrl(supportRequest.user.profilePicture)}
								alt={supportRequest.user.username}
								className="object-cover"
							/>
							<AvatarFallback className={`text-xs font-medium text-white ${getAvatarBgColor(supportRequest.user._id)}`}>
								{supportRequest.user.username
									.split(" ")
									.map((n: string) => n[0])
									.join("")
									.toUpperCase()
									.slice(0, 2)}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<p className="font-medium text-sm leading-none truncate">{supportRequest.user.username}</p>
							<p className="text-xs text-muted-foreground truncate">{supportRequest.user.email}</p>
						</div>
					</div>

					{/* Message */}
					<div className="space-y-2">
						<p className="text-xs font-medium text-muted-foreground">Message:</p>
						<ExpandableMessage message={supportRequest.message} maxLength={150} />
					</div>

					{/* Actions */}
					<div className="flex justify-end">
						<Button
							size="sm"
							onClick={() => onSendEmail(supportRequest.user.email)}
							className="flex items-center gap-2"
						>
							<Mail className="h-4 w-4" />
							Send Email
						</Button>
					</div>
				</div>
			</Card>
		);
	},
);

SupportCard.displayName = "SupportCard";

// Desktop SupportRow component
const SupportRow = memo(
	({
		supportRequest,
		index,
		onSendEmail,
	}: {
		supportRequest: SupportRequest;
		index: number;
		onSendEmail: (email: string) => void;
	}) => {
		return (
			<tr className={`border-b hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-muted/20" : ""}`}>
				{/* User Column */}
				<td className="py-6 px-6 relative">
					<div className="flex items-center space-x-3 relative z-0">
						<Avatar className="h-11 w-11 relative z-0">
							<AvatarImage
								src={getProfilePictureUrl(supportRequest.user.profilePicture)}
								alt={supportRequest.user.username}
								className="object-cover"
							/>
							<AvatarFallback className={`text-xs font-medium text-white ${getAvatarBgColor(supportRequest.user._id)}`}>
								{supportRequest.user.username
									.split(" ")
									.map((n: string) => n[0])
									.join("")
									.toUpperCase()
									.slice(0, 2)}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-1">
							<p className="font-medium text-sm leading-none">{supportRequest.user.username}</p>
							<p className="text-xs text-muted-foreground">{supportRequest.user.email}</p>
						</div>
					</div>
				</td>

				{/* Message Column */}
				<td className="py-6 px-6">
					<div className="max-w-md">
						<ExpandableMessage message={supportRequest.message} maxLength={100} />
					</div>
				</td>

				{/* Actions Column */}
				<td className="py-6 px-6">
					<Button size="sm" onClick={() => onSendEmail(supportRequest.user.email)} className="flex items-center gap-2">
						<Mail className="h-4 w-4" />
						Send Email
					</Button>
				</td>
			</tr>
		);
	},
);

SupportRow.displayName = "SupportRow";

// React Query keys
const QUERY_KEYS = {
	supportRequests: ["supportRequests"] as const,
};

// Pagination component
const Pagination = memo(
	({
		currentPage,
		totalPages,
		totalItems,
		itemsPerPage,
		onPageChange,
	}: {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		itemsPerPage: number;
		onPageChange: (page: number) => void;
	}) => {
		if (totalPages <= 1) return null;

		const startItem = (currentPage - 1) * itemsPerPage + 1;
		const endItem = Math.min(currentPage * itemsPerPage, totalItems);

		const getPageNumbers = () => {
			const pages: (number | string)[] = [];
			const maxVisiblePages = 5;

			if (totalPages <= maxVisiblePages) {
				for (let i = 1; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				pages.push(1);

				if (currentPage > 3) {
					pages.push("...");
				}

				const start = Math.max(2, currentPage - 1);
				const end = Math.min(totalPages - 1, currentPage + 1);

				for (let i = start; i <= end; i++) {
					pages.push(i);
				}

				if (currentPage < totalPages - 2) {
					pages.push("...");
				}

				if (totalPages > 1) {
					pages.push(totalPages);
				}
			}

			return pages;
		};

		return (
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t bg-background">
				<div className="text-sm text-muted-foreground">
					Showing {startItem} to {endItem} of {totalItems} results
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="flex items-center gap-1"
					>
						<ChevronLeft className="h-4 w-4" />
						Previous
					</Button>

					<div className="flex items-center gap-1">
						{getPageNumbers().map((page, index) => (
							<Button
								key={index}
								variant={page === currentPage ? "default" : "outline"}
								size="sm"
								onClick={() => typeof page === "number" && onPageChange(page)}
								disabled={typeof page === "string"}
								className="min-w-[40px]"
							>
								{page}
							</Button>
						))}
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="flex items-center gap-1"
					>
						Next
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		);
	},
);

Pagination.displayName = "Pagination";

export default function CustomerSupportPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// Fetch support requests with React Query
	const {
		data: supportData,
		isLoading,
		error,
	} = useQuery({
		queryKey: [...QUERY_KEYS.supportRequests, currentPage],
		queryFn: () => supportService.getSupportRequests(currentPage, itemsPerPage),
	});

	const supportRequests = supportData?.supportRequests || [];
	const meta = supportData?.meta || { total: 0, totalPages: 1, currentPage: 1 };

	// Filter support requests based on search term
	const filteredSupportRequests = useMemo(() => {
		if (!searchTerm.trim()) {
			return supportRequests;
		}

		return supportRequests.filter(
			(request) =>
				request.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
				request.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				request.message.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [supportRequests, searchTerm]);

	// Handle sending email
	const handleSendEmail = (email: string) => {
		// const subject = encodeURIComponent("Support Response - SelfTalk");
		// const body = encodeURIComponent(
		// 	"Dear Customer,\n\nThank you for contacting our support team.\n\nBest regards,\nSelfTalk Support Team",
		// );
		// const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

		// // Simple and reliable method for mailto links
		// window.location.href = mailtoUrl;
		const subject = "Support Response - SelfTalk";
		const body = "Dear Customer,\n\nThank you for contacting our support team.\n\nBest regards,\nSelfTalk Support Team";

		const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
			email,
		)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

		window.open(gmailUrl, "_blank", "noopener,noreferrer");
	};

	// Show loading state
	if (isLoading) {
		return (
			<div className="flex flex-col h-screen overflow-hidden items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p>Loading support requests...</p>
				</div>
			</div>
		);
	}

	// Show error state
	if (error) {
		return (
			<div className="flex flex-col h-screen overflow-hidden items-center justify-center">
				<div className="text-center">
					<p className="text-red-500 mb-4">Failed to load support requests</p>
					<Button onClick={() => window.location.reload()}>Try Again</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-screen overflow-hidden">
			{/* Header Statistics */}
			<div className="flex-shrink-0 p-6 py-2">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<p className="text-sm font-medium text-muted-foreground">Total Requests</p>
									<p className="text-2xl font-semibold">{meta.total}</p>
								</div>
								<Users className="h-8 w-8 text-muted-foreground" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<p className="text-sm font-medium text-muted-foreground">Current Page</p>
									<p className="text-2xl font-semibold">{meta.currentPage}</p>
								</div>
								<Users className="h-8 w-8 text-muted-foreground" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<p className="text-sm font-medium text-muted-foreground">Total Pages</p>
									<p className="text-2xl font-semibold">{meta.totalPages}</p>
								</div>
								<Users className="h-8 w-8 text-muted-foreground" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Scrollable Support Requests Content */}
			<div className="flex-1 flex flex-col min-h-0 mx-6 mb-6">
				<Card className="flex-1 flex flex-col min-h-0">
					<CardHeader className="flex-shrink-0 pb-4">
						<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
							<CardTitle className="text-lg font-medium">
								Customer Support Requests ({filteredSupportRequests.length})
							</CardTitle>
							<div className="relative w-full md:w-72">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
								<Input
									placeholder="Search by username, email, or message..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>
					</CardHeader>
					<Separator />
					<CardContent className="flex-1 min-h-0 p-0 flex flex-col">
						{filteredSupportRequests.length === 0 ? (
							<div className="flex-1 flex items-center justify-center p-8">
								<div className="text-center space-y-4">
									<Users className="h-12 w-12 text-muted-foreground mx-auto" />
									<div className="space-y-2">
										<h3 className="text-lg font-medium">No support requests found</h3>
										<p className="text-sm text-muted-foreground max-w-sm">
											{searchTerm
												? "No requests match your search criteria. Try adjusting your search terms."
												: "There are currently no customer support requests."}
										</p>
									</div>
									{searchTerm && (
										<Button variant="outline" onClick={() => setSearchTerm("")} className="mt-4">
											Clear Search
										</Button>
									)}
								</div>
							</div>
						) : (
							<>
								<ScrollArea className="flex-1">
									{/* Mobile Card Layout */}
									<div className="md:hidden p-4 space-y-4">
										{filteredSupportRequests.map((request) => (
											<SupportCard key={request._id} supportRequest={request} onSendEmail={handleSendEmail} />
										))}
									</div>

									{/* Desktop Table Layout */}
									<div className="hidden md:block min-w-full">
										<table className="w-full">
											<thead className="sticky top-0 bg-background border-b z-10">
												<tr>
													<th className="text-left py-5 px-6 font-medium text-sm">User</th>
													<th className="text-left py-5 px-6 font-medium text-sm">Message</th>
													<th className="text-left py-5 px-6 font-medium text-sm min-w-[150px]">Actions</th>
												</tr>
											</thead>
											<tbody>
												{filteredSupportRequests.map((request, index) => (
													<SupportRow
														key={request._id}
														supportRequest={request}
														index={index}
														onSendEmail={handleSendEmail}
													/>
												))}
											</tbody>
										</table>
									</div>
								</ScrollArea>

								{/* Pagination */}
								{meta.totalPages > 1 && (
									<Pagination
										currentPage={currentPage}
										totalPages={meta.totalPages}
										totalItems={meta.total}
										itemsPerPage={itemsPerPage}
										onPageChange={setCurrentPage}
									/>
								)}
							</>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
