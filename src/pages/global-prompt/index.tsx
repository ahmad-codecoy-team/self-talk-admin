import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, RefreshCw, MessageSquare, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import promptService from "@/api/services/promptService";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Textarea } from "@/ui/textarea";
import { Separator } from "@/ui/separator";
import { Badge } from "@/ui/badge";

// React Query keys
const QUERY_KEYS = {
	prompt: ["prompt"] as const,
};

export default function GlobalPromptPage() {
	const [promptText, setPromptText] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	const queryClient = useQueryClient();

	// Fetch current prompt
	const {
		data: promptData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: QUERY_KEYS.prompt,
		queryFn: promptService.getPrompt,
		retry: 1, // Only retry once if it fails (might be 404 if no prompt exists)
	});

	// Create prompt mutation
	const createPromptMutation = useMutation({
		mutationFn: promptService.createPrompt,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.prompt });
			setIsEditing(false);
			setHasChanges(false);
		},
	});

	// Update prompt mutation
	const updatePromptMutation = useMutation({
		mutationFn: promptService.updatePrompt,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.prompt });
			setIsEditing(false);
			setHasChanges(false);
		},
	});

	// Initialize prompt text when data loads
	useEffect(() => {
		if (promptData?.prompt?.prompt) {
			setPromptText(promptData.prompt.prompt);
		} else {
			setPromptText("");
			setIsEditing(true); // Auto-start editing if no prompt exists
		}
	}, [promptData]);

	// Check for changes
	useEffect(() => {
		const originalText = promptData?.prompt?.prompt || "";
		setHasChanges(promptText !== originalText);
	}, [promptText, promptData]);

	// Handle save
	const handleSave = () => {
		const trimmedText = promptText.trim();
		
		if (!trimmedText) {
			alert("Prompt cannot be empty");
			return;
		}

		if (promptData?.prompt?._id) {
			// Update existing prompt
			updatePromptMutation.mutate(trimmedText);
		} else {
			// Create new prompt
			createPromptMutation.mutate(trimmedText);
		}
	};

	// Handle cancel
	const handleCancel = () => {
		if (promptData?.prompt?.prompt) {
			setPromptText(promptData.prompt.prompt);
		} else {
			setPromptText("");
		}
		setIsEditing(false);
		setHasChanges(false);
	};

	// Handle edit
	const handleEdit = () => {
		setIsEditing(true);
	};

	// Check if mutations are loading
	const isSaving = createPromptMutation.isPending || updatePromptMutation.isPending;

	// Show loading state
	if (isLoading) {
		return (
			<div className="flex flex-col h-screen overflow-hidden items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p>Loading global prompt...</p>
				</div>
			</div>
		);
	}

	// Show error state (only if it's not a 404 - which is normal for new prompts)
	if (error && !error.message.includes("404") && !error.message.includes("Not Found")) {
		return (
			<div className="flex flex-col h-screen overflow-hidden items-center justify-center">
				<div className="text-center">
					<p className="text-red-500 mb-4">Failed to load global prompt</p>
					<Button onClick={() => refetch()}>Try Again</Button>
				</div>
			</div>
		);
	}

	const currentPrompt = promptData?.prompt;
	const isNewPrompt = !currentPrompt?._id;

	return (
		<div className="flex flex-col h-screen overflow-hidden">
			{/* Header */}
			<div className="flex-shrink-0 p-6">
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<MessageSquare className="h-8 w-8 text-primary" />
							<div>
								<h1 className="text-2xl font-bold">Global Prompt</h1>
								<p className="text-sm text-muted-foreground">
									Manage the global AI assistant prompt for your application
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							{currentPrompt && (
								<Badge variant="secondary" className="text-xs">
									{isNewPrompt ? "New Prompt" : "Active Prompt"}
								</Badge>
							)}
							<Button
								variant="outline"
								size="sm"
								onClick={() => refetch()}
								disabled={isLoading}
								className="flex items-center gap-2"
							>
								<RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
								Refresh
							</Button>
						</div>
					</div>

					{/* Status Information */}
					{currentPrompt && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
							<div>
								<span className="font-medium">Created:</span>{" "}
								{new Date(currentPrompt.createdAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long", 
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</div>
							<div>
								<span className="font-medium">Last Updated:</span>{" "}
								{new Date(currentPrompt.updatedAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric", 
									hour: "2-digit",
									minute: "2-digit",
								})}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col min-h-0 mx-6 mb-6">
				<Card className="flex-1 flex flex-col min-h-0">
					<CardHeader className="flex-shrink-0 pb-4">
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
							<CardTitle className="text-lg font-medium">
								{isNewPrompt ? "Create New Prompt" : "Current Global Prompt"}
							</CardTitle>
							
							{!isEditing ? (
								<Button
									onClick={handleEdit}
									disabled={isSaving}
									className="flex items-center gap-2"
								>
									<Edit className="h-4 w-4" />
									Edit Prompt
								</Button>
							) : (
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										onClick={handleCancel}
										disabled={isSaving}
									>
										Cancel
									</Button>
									<Button
										onClick={handleSave}
										disabled={isSaving || !hasChanges || !promptText.trim()}
										className="flex items-center gap-2"
									>
										{isSaving ? (
											<RefreshCw className="h-4 w-4 animate-spin" />
										) : (
											<Save className="h-4 w-4" />
										)}
										{isNewPrompt ? "Create Prompt" : "Save Changes"}
									</Button>
								</div>
							)}
						</div>
					</CardHeader>
					<Separator />
					<CardContent className="flex-1 min-h-0 p-6 flex flex-col">
						{!isEditing ? (
							// Display Mode
							<div className="flex-1 flex flex-col">
								{promptText ? (
									<div className="space-y-4">
										<div className="p-4 bg-muted/30 rounded-lg border">
											<pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
												{promptText}
											</pre>
										</div>
										<div className="text-xs text-muted-foreground">
											Character count: {promptText.length}
										</div>
									</div>
								) : (
									<div className="flex-1 flex items-center justify-center">
										<div className="text-center space-y-4">
											<MessageSquare className="h-12 w-12 text-muted-foreground mx-auto" />
											<div className="space-y-2">
												<h3 className="text-lg font-medium">No Global Prompt Set</h3>
												<p className="text-sm text-muted-foreground max-w-sm">
													Create a global prompt to provide consistent AI assistant behavior across your application.
												</p>
											</div>
											<Button onClick={handleEdit} className="mt-4">
												Create Global Prompt
											</Button>
										</div>
									</div>
								)}
							</div>
						) : (
							// Edit Mode
							<div className="flex-1 flex flex-col space-y-4">
								<Textarea
									value={promptText}
									onChange={(e) => setPromptText(e.target.value)}
									placeholder="Enter your global AI assistant prompt here..."
									className="flex-1 min-h-[300px] resize-none font-mono text-sm leading-relaxed"
									autoFocus
								/>
								<div className="flex justify-between items-center text-xs text-muted-foreground">
									<div>
										Character count: {promptText.length}
									</div>
									{hasChanges && (
										<div className="text-amber-600">
											Unsaved changes
										</div>
									)}
								</div>
							</div>
						)}

						{/* Error Display */}
						{(createPromptMutation.error || updatePromptMutation.error) && (
							<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
								{createPromptMutation.error?.message || updatePromptMutation.error?.message}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}