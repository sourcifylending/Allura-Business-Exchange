"use client";

import { useState } from "react";
import { PageCard } from "@/components/page-card";
import type { DigitalAssetBuyerInterestRow } from "@/lib/supabase/database.types";
import { updateBuyerFieldAction } from "@/app/admin/digital-assets/actions";

type BuyerContactCardProps = Readonly<{
  buyer: DigitalAssetBuyerInterestRow;
  assetId: string;
  buyerId: string;
}>;

export function BuyerContactCard({ buyer, assetId, buyerId }: BuyerContactCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(buyer.buyer_name || "");
  const [email, setEmail] = useState(buyer.buyer_email || "");
  const [phone, setPhone] = useState(buyer.buyer_phone || "");

  const handleSave = async () => {
    try {
      await updateBuyerFieldAction(buyerId, {
        buyer_name: name,
        buyer_email: email,
        buyer_phone: phone,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update buyer:", error);
    }
  };

  return (
    <PageCard title="Buyer Contact" description="Prospect information">
      {!isEditing && (
        <div className="grid gap-3">
          <div className="grid gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Name</label>
            <p className="text-sm font-medium text-ink-900">{buyer.buyer_name || "—"}</p>
          </div>
          <div className="grid gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Email</label>
            <p className="text-sm text-ink-700">{buyer.buyer_email ? <a href={`mailto:${buyer.buyer_email}`} className="text-accent-600 hover:text-accent-700">{buyer.buyer_email}</a> : "—"}</p>
          </div>
          <div className="grid gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Phone</label>
            <p className="text-sm text-ink-700">{buyer.buyer_phone ? <a href={`tel:${buyer.buyer_phone}`} className="text-accent-600 hover:text-accent-700">{buyer.buyer_phone}</a> : "—"}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 rounded-lg border border-ink-200 px-3 py-2 text-xs font-medium text-ink-600 hover:bg-ink-50"
          >
            Edit
          </button>
        </div>
      )}

      {isEditing && (
        <div className="grid gap-3">
          <input
            type="text"
            placeholder="Buyer name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="rounded-lg bg-accent-600 px-3 py-2 text-xs font-medium text-white hover:bg-accent-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setName(buyer.buyer_name || "");
                setEmail(buyer.buyer_email || "");
                setPhone(buyer.buyer_phone || "");
              }}
              className="rounded-lg border border-ink-200 px-3 py-2 text-xs font-medium hover:bg-ink-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </PageCard>
  );
}
