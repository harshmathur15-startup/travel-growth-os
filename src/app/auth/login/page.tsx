import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-card border border-border shadow-xl rounded-2xl",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton:
              "border-border bg-muted text-foreground hover:bg-muted/80",
            formFieldLabel: "text-muted-foreground",
            formFieldInput:
              "bg-muted border-border text-foreground rounded-xl focus:ring-indigo-500",
            footerActionLink: "text-indigo-400 hover:text-indigo-300",
            formButtonPrimary:
              "bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-90 rounded-xl",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground",
          },
        }}
      />
    </div>
  );
}
