import { Button } from "@/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Language } from "@/api/services/languageService";

interface LanguageDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	language?: Language | null;
	onSave: (data: { name: string; code: string }) => void;
	isSaving: boolean;
}

interface FormData {
	name: string;
	code: string;
}

export function LanguageDialog({
	open,
	onOpenChange,
	language,
	onSave,
	isSaving,
}: LanguageDialogProps) {
	const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

	useEffect(() => {
		if (open) {
			reset({
				name: language?.name || "",
				code: language?.code || "",
			});
		}
	}, [open, language, reset]);

	const onSubmit = (data: FormData) => {
		onSave(data);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{language ? "Edit Language" : "Add Language"}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							placeholder="e.g. English"
							{...register("name", { required: "Name is required" })}
						/>
						{errors.name && (
							<p className="text-sm text-red-500">{errors.name.message}</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="code">Code</Label>
						<Input
							id="code"
							placeholder="e.g. en-US"
							{...register("code", { required: "Code is required" })}
						/>
						{errors.code && (
							<p className="text-sm text-red-500">{errors.code.message}</p>
						)}
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSaving}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSaving}>
							{isSaving ? "Saving..." : "Save"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
