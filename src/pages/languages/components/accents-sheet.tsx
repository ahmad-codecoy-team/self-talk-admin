import { Button } from "@/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/ui/sheet";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { ScrollArea } from "@/ui/scroll-area";
import { useState } from "react";
import { Language } from "@/api/services/languageService";
import { Accent } from "@/api/services/accentService";
import { Plus, Trash, Edit, Save, X } from "lucide-react";
import { Separator } from "@/ui/separator";

interface AccentsSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	language: Language | null;
	accents: Accent[];
	isLoading: boolean;
	onCreateAccent: (data: { name: string; language_id: string }) => void;
	onUpdateAccent: (id: string, data: { name: string }) => void;
	onDeleteAccent: (id: string) => void;
}

export function AccentsSheet({
	open,
	onOpenChange,
	language,
	accents,
	isLoading,
	onCreateAccent,
	onUpdateAccent,
	onDeleteAccent,
}: AccentsSheetProps) {
	const [newAccentName, setNewAccentName] = useState("");
	const [editingAccentId, setEditingAccentId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");

	if (!language) return null;

	const handleCreate = () => {
		if (!newAccentName.trim()) return;
		onCreateAccent({
			language_id: language._id,
			name: newAccentName.trim(),
		});
		setNewAccentName("");
	};

	const startEditing = (accent: Accent) => {
		setEditingAccentId(accent._id);
		setEditingName(accent.name);
	};

	const cancelEditing = () => {
		setEditingAccentId(null);
		setEditingName("");
	};

	const saveEditing = (id: string) => {
		if (!editingName.trim()) return;
		onUpdateAccent(id, { name: editingName.trim() });
		setEditingAccentId(null);
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full">
				<SheetHeader>
					<SheetTitle>Manage Accents</SheetTitle>
					<SheetDescription>
						Manage accents for {language.name} ({language.code})
					</SheetDescription>
				</SheetHeader>
				
				<div className="mt-6 flex flex-col flex-1 min-h-0">
					{/* Add New Accent */}
					<div className="flex gap-2 items-end mb-6">
						<div className="grid w-full gap-1.5">
							<Label htmlFor="new-accent">New Accent Name</Label>
							<Input
								id="new-accent"
								placeholder="e.g. American"
								value={newAccentName}
								onChange={(e) => setNewAccentName(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleCreate();
								}}
							/>
						</div>
						<Button onClick={handleCreate} disabled={!newAccentName.trim()}>
							<Plus className="h-4 w-4 mr-2" /> Add
						</Button>
					</div>

					<Separator className="mb-4" />

					{/* Accents List */}
					<div className="flex-1 min-h-0">
						<h3 className="text-sm font-medium mb-3">Existing Accents</h3>
						{isLoading ? (
							<div className="flex justify-center p-4">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
							</div>
						) : accents.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-8">
								No accents found for this language.
							</p>
						) : (
							<ScrollArea className="h-full pr-4">
								<div className="space-y-3">
									{accents.map((accent) => (
										<div
											key={accent._id}
											className="flex items-center justify-between p-3 border rounded-md bg-card"
										>
											{editingAccentId === accent._id ? (
												<div className="flex items-center gap-2 flex-1 mr-2">
													<Input
														value={editingName}
														onChange={(e) => setEditingName(e.target.value)}
														className="h-8"
														autoFocus
													/>
													<Button
														size="icon"
														variant="ghost"
														className="h-8 w-8"
														onClick={() => saveEditing(accent._id)}
													>
														<Save className="h-4 w-4 text-green-600" />
													</Button>
													<Button
														size="icon"
														variant="ghost"
														className="h-8 w-8"
														onClick={cancelEditing}
													>
														<X className="h-4 w-4 text-red-600" />
													</Button>
												</div>
											) : (
												<span className="text-sm font-medium">{accent.name}</span>
											)}

											{editingAccentId !== accent._id && (
												<div className="flex items-center gap-1">
													<Button
														size="icon"
														variant="ghost"
														className="h-8 w-8"
														onClick={() => startEditing(accent)}
													>
														<Edit className="h-4 w-4 text-muted-foreground" />
													</Button>
													<Button
														size="icon"
														variant="ghost"
														className="h-8 w-8"
														onClick={() => onDeleteAccent(accent._id)}
													>
														<Trash className="h-4 w-4 text-red-500" />
													</Button>
												</div>
											)}
										</div>
									))}
								</div>
							</ScrollArea>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
