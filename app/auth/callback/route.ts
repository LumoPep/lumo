import { NextResponse } from "next/server";

/**
 * Supabase OAuth callback.
 * After Google auth, Supabase redirects here with ?code=…
 * The browser-side Supabase client exchanges the code on the
 * next page load automatically. We just redirect home.
 */
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  return NextResponse.redirect(origin);
}
