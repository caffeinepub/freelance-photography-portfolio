import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, LogIn, LogOut } from "lucide-react";
import AboutTab from "../components/admin/AboutTab";
import CategoriesTab from "../components/admin/CategoriesTab";
import ContactTab from "../components/admin/ContactTab";
import MediaTab from "../components/admin/MediaTab";
import SubGalleriesTab from "../components/admin/SubGalleriesTab";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

export default function AdminPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async () => {
    try {
      await login();
    } catch (err: any) {
      if (err?.message === "User is already authenticated") {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">
            Admin
          </h1>
          <p className="font-sans text-sm text-[oklch(0.60_0_0)] mb-8">
            Sign in to manage your portfolio content.
          </p>
          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="gap-2 cta-button"
            data-ocid="admin.login.primary_button"
          >
            {isLoggingIn ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <LogIn size={14} />
            )}
            {isLoggingIn ? "Signing in..." : "Sign In"}
          </Button>
          <div className="mt-6">
            <a
              href="/"
              className="font-sans text-xs text-[oklch(0.45_0_0)] hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft size={12} /> Back to site
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Loading admin check
  if (adminLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="animate-spin text-[oklch(0.60_0_0)]" size={24} />
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <h1 className="font-display text-3xl text-foreground mb-3">
            Access Denied
          </h1>
          <p className="font-sans text-sm text-[oklch(0.60_0_0)] mb-6">
            You don't have admin privileges for this portfolio.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
              data-ocid="admin.logout.secondary_button"
            >
              <LogOut size={14} /> Sign Out
            </Button>
            <a href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft size={14} /> Back to site
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const tabs = ["sub-galleries", "media", "categories", "about", "contact"];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="bg-[oklch(0.09_0_0)] border-b border-border">
        <div className="max-w-content mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="font-sans text-xs text-[oklch(0.45_0_0)] hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft size={12} /> Site
            </a>
            <span className="text-border">|</span>
            <span className="font-display text-sm text-foreground tracking-wide">
              Portfolio Admin
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 text-[oklch(0.60_0_0)] hover:text-foreground"
            data-ocid="admin.logout.button"
          >
            <LogOut size={13} /> Sign Out
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-content mx-auto px-6 md:px-10 py-10">
        <Tabs defaultValue="sub-galleries">
          <TabsList
            className="mb-8 border border-border bg-transparent h-auto p-0 gap-0 flex-wrap"
            data-ocid="admin.tabs"
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="font-sans text-xs tracking-[0.12em] uppercase px-5 py-2.5 rounded-none border-r border-border last:border-r-0 data-[state=active]:bg-[oklch(0.18_0_0)] data-[state=active]:text-foreground text-[oklch(0.55_0_0)]"
                data-ocid={`admin.${tab}.tab`}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="sub-galleries">
            <SubGalleriesTab />
          </TabsContent>
          <TabsContent value="media">
            <MediaTab />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>
          <TabsContent value="about">
            <AboutTab />
          </TabsContent>
          <TabsContent value="contact">
            <ContactTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
