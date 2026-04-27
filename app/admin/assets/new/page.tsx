"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";

export default function AddAssetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    assetType: "",
    status: "for_sale",
    revenueStage: "",
    askingPrice: "",
    shortDescription: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from name
    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name.trim() || !formData.slug.trim()) {
        throw new Error("Asset name is required");
      }

      const response = await fetch("/api/admin/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          assetType: formData.assetType,
          status: formData.status,
          revenueStage: formData.revenueStage,
          askingPrice: formData.askingPrice,
          shortDescription: formData.shortDescription,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create asset");
      }

      const { asset } = await response.json();
      router.push(`/admin/digital-assets/${asset.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create asset");
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Add New Asset"
        description="Create a new digital asset for sale."
      />

      <PageCard title="Asset Information" description="">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-ink-900">Asset Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., SourcifyLending"
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm placeholder-ink-400 focus:outline-none focus:border-accent-500"
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-ink-900">Slug (auto-generated)</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="auto-generated from name"
              className="rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-600"
              disabled
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-ink-900">Asset Type</label>
              <input
                type="text"
                name="assetType"
                value={formData.assetType}
                onChange={handleInputChange}
                placeholder="e.g., SaaS, API, Platform"
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm placeholder-ink-400 focus:outline-none focus:border-accent-500"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-ink-900">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
              >
                <option value="for_sale">For Sale</option>
                <option value="in_build">In Build</option>
                <option value="sold">Sold</option>
                <option value="paused">Paused</option>
                <option value="internal">Internal</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-ink-900">Asking Price ($)</label>
              <input
                type="number"
                name="askingPrice"
                value={formData.askingPrice}
                onChange={handleInputChange}
                placeholder="e.g., 650000"
                min="0"
                step="1000"
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm placeholder-ink-400 focus:outline-none focus:border-accent-500"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-ink-900">Revenue Stage</label>
              <input
                type="text"
                name="revenueStage"
                value={formData.revenueStage}
                onChange={handleInputChange}
                placeholder="e.g., Series B"
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm placeholder-ink-400 focus:outline-none focus:border-accent-500"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-ink-900">Short Description</label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              placeholder="Brief overview of the asset"
              rows={3}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm placeholder-ink-400 focus:outline-none focus:border-accent-500"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-ink-900">Internal Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Private notes visible only to admins"
              rows={2}
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
              disabled={loading}
              className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-700 disabled:opacity-50 transition"
            >
              {loading ? "Creating..." : "Create Asset"}
            </button>
            <Link
              href="/admin/assets"
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
