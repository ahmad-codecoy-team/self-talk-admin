import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import languageService, { Language } from "@/api/services/languageService";
import accentService from "@/api/services/accentService";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Plus, Edit, Trash, Globe, MapPin } from "lucide-react";
import { LanguageDialog } from "./components/language-dialog";
import { AccentsSheet } from "./components/accents-sheet";
import { Badge } from "@/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/ui/dialog";

// React Query keys
const QUERY_KEYS = {
	languages: ["languages"] as const,
	accents: (languageId: string) => ["accents", languageId] as const,
};

export default function LanguagesPage() {
	const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
	const [isAccentsSheetOpen, setIsAccentsSheetOpen] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
	const [languageToDelete, setLanguageToDelete] = useState<Language | null>(null);

	const queryClient = useQueryClient();

	// --- Queries ---

	const { data: languages = [], isLoading: isLoadingLanguages } = useQuery({
		queryKey: QUERY_KEYS.languages,
		queryFn: languageService.getLanguages,
	});

	const { data: accents = [], isLoading: isLoadingAccents } = useQuery({
		queryKey: QUERY_KEYS.accents(selectedLanguage?._id || ""),
		queryFn: () => accentService.getAccents(selectedLanguage?._id),
		enabled: !!selectedLanguage?._id && isAccentsSheetOpen,
	});

	// --- Mutations ---

	// Language Mutations
	const createLanguageMutation = useMutation({
		mutationFn: languageService.createLanguage,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.languages });
			setIsLanguageDialogOpen(false);
		},
	});

	const updateLanguageMutation = useMutation({
		mutationFn: (data: { id: string; name: string; code: string }) =>
			languageService.updateLanguage(data.id, { name: data.name, code: data.code }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.languages });
			setIsLanguageDialogOpen(false);
			setSelectedLanguage(null);
		},
	});

	const deleteLanguageMutation = useMutation({
		mutationFn: languageService.deleteLanguage,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.languages });
			setLanguageToDelete(null);
		},
		onError: (error: any) => {
			alert(error.message || "Failed to delete language. Ensure it has no accents.");
		},
	});

	// Accent Mutations
	const createAccentMutation = useMutation({
		mutationFn: accentService.createAccent,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accents(variables.language_id) });
		},
	});

	const updateAccentMutation = useMutation({
		mutationFn: (data: { id: string; name: string; language_id?: string }) =>
			accentService.updateAccent(data.id, { name: data.name, language_id: data.language_id }),
		onSuccess: () => {
			if (selectedLanguage) {
				queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accents(selectedLanguage._id) });
			}
		},
	});

	const deleteAccentMutation = useMutation({
		mutationFn: accentService.deleteAccent,
		onSuccess: () => {
			if (selectedLanguage) {
				queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accents(selectedLanguage._id) });
			}
		},
	});

	// --- Handlers ---

	const handleOpenCreateLanguage = () => {
		setSelectedLanguage(null);
		setIsLanguageDialogOpen(true);
	};

	const handleOpenEditLanguage = (language: Language) => {
		setSelectedLanguage(language);
		setIsLanguageDialogOpen(true);
	};

	const handleSaveLanguage = (data: { name: string; code: string }) => {
		if (selectedLanguage) {
			updateLanguageMutation.mutate({ id: selectedLanguage._id, ...data });
		} else {
			createLanguageMutation.mutate(data);
		}
	};

	const handleConfirmDeleteLanguage = () => {
		if (languageToDelete) {
			deleteLanguageMutation.mutate(languageToDelete._id);
		}
	};

	const handleManageAccents = (language: Language) => {
		setSelectedLanguage(language);
		setIsAccentsSheetOpen(true);
	};

	return (
		<div className="flex flex-col h-screen overflow-hidden">
			<div className="flex-shrink-0 p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Globe className="h-8 w-8 text-primary" />
						<div>
							<h1 className="text-2xl font-bold">Languages</h1>
							<p className="text-sm text-muted-foreground">
								Manage supported languages and regional accents
							</p>
						</div>
					</div>
					<Button onClick={handleOpenCreateLanguage} className="flex items-center gap-2">
						<Plus className="h-4 w-4" /> Add Language
					</Button>
				</div>
			</div>

			<div className="flex-1 flex flex-col min-h-0 mx-6 mb-6">
				<Card className="flex-1 flex flex-col min-h-0 overflow-hidden border-none shadow-none bg-transparent">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-auto pb-4">
						{isLoadingLanguages ? (
							<div className="col-span-full flex justify-center p-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
							</div>
						) : languages.length === 0 ? (
							<div className="col-span-full text-center p-8 text-muted-foreground border rounded-lg bg-card">
								<p>No languages found. Add one to get started.</p>
							</div>
						) : (
							languages.map((language) => (
								<Card key={language._id} className="flex flex-col">
									<CardHeader className="pb-2">
										<div className="flex justify-between items-start">
											<div>
												<CardTitle className="text-lg">{language.name}</CardTitle>
												<CardDescription className="font-mono text-xs mt-1">
													{language.code}
												</CardDescription>
											</div>
											<Badge variant="outline" className="font-mono">
												{language.code.split("-")[0]}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="flex-1 flex flex-col justify-end pt-2 gap-3">
										<Button 
											variant="secondary" 
											className="w-full justify-start" 
											onClick={() => handleManageAccents(language)}
										>
											<MapPin className="h-4 w-4 mr-2" /> Manage Accents
										</Button>
										<div className="flex gap-2">
											<Button
												variant="outline"
												size="sm"
												className="flex-1"
												onClick={() => handleOpenEditLanguage(language)}
											>
												<Edit className="h-3 w-3 mr-2" /> Edit
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
												onClick={() => setLanguageToDelete(language)}
											>
												<Trash className="h-3 w-3 mr-2" /> Delete
											</Button>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</div>
				</Card>
			</div>

			{/* Language Dialog */}
			<LanguageDialog
				open={isLanguageDialogOpen}
				onOpenChange={(open) => {
					setIsLanguageDialogOpen(open);
					if (!open) setSelectedLanguage(null);
				}}
				language={selectedLanguage}
				onSave={handleSaveLanguage}
				isSaving={createLanguageMutation.isPending || updateLanguageMutation.isPending}
			/>

			{/* Accents Sheet */}
			<AccentsSheet
				open={isAccentsSheetOpen}
				onOpenChange={(open) => {
					setIsAccentsSheetOpen(open);
					if (!open) setSelectedLanguage(null);
				}}
				language={selectedLanguage}
				accents={accents}
				isLoading={isLoadingAccents}
				onCreateAccent={createAccentMutation.mutate}
				onUpdateAccent={(id, data) => updateAccentMutation.mutate({ id, ...data })}
				onDeleteAccent={deleteAccentMutation.mutate}
			/>

			{/* Delete Confirmation */}
			<Dialog
				open={!!languageToDelete}
				onOpenChange={(open) => !open && setLanguageToDelete(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete the language
							"{languageToDelete?.name}". Note: Languages with associated accents cannot be deleted.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setLanguageToDelete(null)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleConfirmDeleteLanguage}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
