/**
 * This file is used to define the route for the draft mode enable page, which will load Visual Editing
 * and query draft content and preview the content as it will appear once everything is published.
 */
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { client } from "@/sanity/lib/client";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

const token = process.env.SANITY_API_READ_TOKEN;

export async function GET(request: Request) {
  const { isValid, redirectTo = "/" } = await validatePreviewUrl(
    client.withConfig({ token }),
    request.url
  );
  if (!isValid) {
    return new Response("Invalid Secret", { status: 401 });
  }

  (await draftMode()).enable();

  redirect(redirectTo);
}


