import { ReactNode } from "react";
import MarketingHeader from "@/components/MarketingHeader";
import MarketingFooter from "@/components/MarketingFooter";
import { SnippetModalProvider } from "@/contexts/SnippetModalContext";

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <SnippetModalProvider>
        <main className="flex-1">{children}</main>
      </SnippetModalProvider>
      <MarketingFooter />
    </div>
  );
}