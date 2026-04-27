"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import type { DigitalAssetRow } from "@/lib/supabase/database.types";

export default function AddBuyerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assets, setAssets] = useState<DigitalAssetRow[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    assetId: "",
    ndaStatus: "not_sent" as "not_sent" | "sent" | "signed" | "declined",
    buyerStage: "new" as "new" | "contacted" | "interested" | "qualified" | "not_fit" | "closed",
    nextFollowUpDate: "",
    notes: "",
  });

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const response = await fetch("/api/admin/data");
      const data = await response.json();
      const forSaleAssets = data.assets.filter((a: any) => a.status === "for_sale");
      setAssets(forSaleAssets);
      if (forSaleAssets.length > 0 && !formData.assetId) {
        setFormData(prev => ({ ...prev, assetId: forSaleAssets[0].id }));
      }
    } catch (err) {
      setError("Failed to load assets");
    } finally {
      setLoadingAssets(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.buyerName.trim()) {
        throw new Error("Buyer name is required");
      }
      if (!formData.assetId) {
        throw new Error("Please select an asset");
      }

      const response = await fetch("/api/admin/buyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: formData.assetId,
          buyerName: formData.buyerName,
          buyerEmail: formData.buyerEmail,
          buyerPhone: formData.buyerPhone,
          ndaStatus: formData.ndaStatus,
          buyerStage: formData.buyerStage,
          nextFollowUpDate: formData.nextFollowUpDate,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create buyer");
      }

      const { buyer } = await response.json();
      router.push(`/admin/digital-assets/${formData.assetId}?tab=buyers&buyerId=${buyer.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create buyer");
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Add New Buyer"
        description="Create a new buyer prospect for a digital asset."
      />

      <PageCard title="Buyer Information" description="">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-ink-900">Interested Asset *</label>
            <select
              name="assetId"
              value={formData.assetId}
              onChange={handleInputChange}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
              required
            >
              {loadingAssets ? (
                <option>Loading assets...</option>
              ) : assets.length === 0 ? (
                <option>No assets available</option>
              ) : (
                <>
                  <option value="">Select an asset...</option>
                  {assets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ${asset.asking_price ? asset.asking_price.toLocaleString() : "—"}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-ink-900">Buyer Name *</label>
            <input
              type="text"
              name="buyerName"
              value={formData.buyerName}
              onChange={handleInputChange}
              placeholder="Full name"
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm placeholder-ink-400 focus:outline-none focus:border-accent-500"
              required
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-ink-900">Email</label>
              <input
                type="email"
                name="buyerEmail"
                value={formData.buyerEmail}
                onChange={handleInputChange}
                placeholder="buyer@company.com"
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm placeholder-ink-400 focus:outline-none focus:border-accent-500"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-ink-900">Phone</label>
              <input
                type="tel"
                name="buyerPhone"
                value={formData.buyerPhone}
                onChange={handleInputChange}
                placeholder="(555) 000-0000"
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm placeholder-ink-400 focus:outline-none focus:border-accent-500"
              />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-ink-900">NDA Status</label>
              <select
                name="ndaStatus"
                value={formData.ndaStatus}
                onChange={handleInputChange}
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
              >
                <option value="not_sent">Not Sent</option>
                <option value="sent">Sent</option>
                <option value="signed">Signed</option>
                <option value="declined">Declined</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-ink-900">Buyer Stage</label>
              <select
                name="buyerStage"
                value={formData.buyerStage}
                onChange={handleInputChange}
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
              >
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="interested">Interested</option>
                <option value="qualified">Qualified</option>
                <option value="not_fit">Not Fit</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-ink-900">Next Follow-Up Date</label>
            <input
              type="date"
              name="nextFollowUpDate"
              value={formData.nextFollowUpDate}
              onChange={handleInputChange}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-ink-900">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Internal notes about this buyer"
              rows={3}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm placeholder-ink-400 focus:outline-none focus:border-accent-500"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || loadingAssets}
              className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-700 disabled:opacity-50 transition"
            >
              {loading ? "Creating..." : "Create Buyer"}
            </button>
            <Link
              href="/admin/buyers"
              className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-900 hover:bg-ink-50 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </PageCard>
    </div>
  );
}
