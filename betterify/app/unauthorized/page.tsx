import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-100 dark:bg-red-900/20">
        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
      <h2 className="text-2xl font-semibold mb-6 text-muted-foreground">Unauthorized Access Attempt</h2>
      <p className="text-center max-w-md mb-8 text-muted-foreground">
        You do not have permission to access this page. This access attempt has been logged.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default">
          <Link href="/">Return Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
      <div className="mt-12 flex items-center text-sm text-muted-foreground">
        <Shield className="h-4 w-4 mr-2" />
        <span>This area is restricted to authorized administrators only</span>
      </div>
    </div>
  )
}

