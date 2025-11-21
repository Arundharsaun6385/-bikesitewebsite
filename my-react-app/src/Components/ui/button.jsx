// Compatibility wrapper so imports using `@/components/ui/button` resolve.
// Re-exports the project's existing Button component at `src/Components/Button`.
import { Button as ProjectButton } from "@/Components/Button";

export const Button = ProjectButton;
export default ProjectButton;
