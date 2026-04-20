import { NextResponse, type NextRequest } from "next/server";
import { createBuyerDocumentDownloadUrl } from "@/lib/application-documents";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const signedUrl = await createBuyerDocumentDownloadUrl(params.id);

  if (!signedUrl) {
    return NextResponse.redirect(new URL("/portal/buyer/documents?error=Unable%20to%20download%20the%20document.", request.url));
  }

  const response = NextResponse.redirect(signedUrl);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
