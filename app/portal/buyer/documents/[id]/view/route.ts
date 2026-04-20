import { NextResponse, type NextRequest } from "next/server";
import { createBuyerDocumentViewUrl } from "@/lib/application-documents";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const signedUrl = await createBuyerDocumentViewUrl(params.id);

  if (!signedUrl) {
    return NextResponse.redirect(new URL("/portal/buyer/documents?error=Unable%20to%20open%20the%20document.", request.url));
  }

  const response = NextResponse.redirect(signedUrl);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
