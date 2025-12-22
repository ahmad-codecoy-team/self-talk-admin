import { RotateCcw, SearchX } from "lucide-react";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";

type NoUsersFoundProps = {
	onClearFilters: () => void;
	title?: string;
	description?: string;
	isClearingDisabled?: boolean;
};

export default function NoUsersFound({
	onClearFilters,
	title = "No results found",
	description = "No users match your current filters. Adjust your filters or clear them to see all users.",
	isClearingDisabled = false,
}: NoUsersFoundProps) {
	return (
		<Card className="mx-auto my-10 w-full max-w-xl p-6">
			<div className="flex flex-col items-center text-center gap-3">
				<div className="rounded-full border p-3">
					<SearchX className="h-6 w-6" />
				</div>

				<div className="space-y-1">
					<h3 className="text-base font-semibold">{title}</h3>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>

				<div className="pt-2">
					<Button
						variant="outline"
						onClick={onClearFilters}
						disabled={isClearingDisabled}
						className="gap-2"
					>
						<RotateCcw className="h-4 w-4" />
						Reset filters
					</Button>
				</div>
			</div>
		</Card>
	);
}
