export default function BuyerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink-50">
      <nav className="border-b border-ink-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-ink-900">SourcifyLending Buyer Portal</div>
            <div className="text-sm text-ink-600">Review Assets & NDA</div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
