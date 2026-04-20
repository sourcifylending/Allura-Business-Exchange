import { NextResponse, type NextRequest } from "next/server";
import { createAdminDocumentDownloadUrl } from "@/lib/application-documents";
import { isAuthorizedAdminRequest } from "@/lib/admin-route-access";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.redirect(new URL("/login?next=/admin/applications/documents", request.url));
  }

  const signedUrl = await createAdminDocumentDownloadUrl(params.id);

  if (!signedUrl) {
    return NextResponse.redirect(new URL("/admin/applications/documents?error=Unable%20to%20download%20the%20document.", request.url));
  }

  const response = NextResponse.redirect(signedUrl);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
