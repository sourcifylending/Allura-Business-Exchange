import { redirect } from "next/navigation";

export default function BuyerNdaRedirectPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token?.trim();
  redirect(token ? `/buyer-invite?token=${encodeURIComponent(token)}` : "/buyer-invite");
}
