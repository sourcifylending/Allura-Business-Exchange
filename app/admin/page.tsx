import { AdminMetricCard } from "@/components/admin-metric-card";
import { AdminPageHeader } from "@/components/admin-page-header";

const cards = [
  "New Ideas",
  "Ideas Approved to Build",
  "AI Assets In Build",
  "AI Assets Ready to List",
  "AI Asset Buyer Inquiries",
  "Active Listings",
  "Offers In Progress",
  "Contracts Pending",
  "Payments Pending",
  "Transfers In Progress",
  "Business Seller Submissions",
  "Tasks Due",
];

export default function AdminPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Dashboard"
        description="A clean command center for Allura's internal operating system, with AI asset flow front and center."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <AdminMetricCard key={card} label={card} />
        ))}
      </section>
      <div className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <div className="text-sm font-semibold tracking-[0.22em] text-accent-700 uppercase">
          Priority Stack
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            "New Ideas",
            "AI Assets In Build",
            "AI Assets Ready to List",
            "AI Asset Buyer Inquiries",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
              <div className="text-sm font-medium text-ink-900">{item}</div>
              <div className="mt-2 text-sm text-ink-600">Pinned to the top of the admin flow.</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
