import { useFormStatus } from "react-dom"
import { Button } from "./ui/button";

export function OAuthButton({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  const { pending } = useFormStatus()

  return (
    <Button
      variant="outline"
      className="w-full h-10 sm:h-12 bg-background/50 hover:bg-background/80 border-border/50 transition-all hover:scale-[1.02] group"
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <div className="h-4 w-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          Signing in...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
          {label}
        </span>
      )}
    </Button>
  )
}