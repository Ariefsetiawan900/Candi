import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/auth/forgot-password"];
const AUTH_FLOW_ROUTES = ["/auth/reset-password", "/auth/callback"];

export async function updateSession(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Use getSession for routing decisions in middleware (fast, cookie-based).
  // Server Components use getUser() for full server-side validation.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isAuthFlow = AUTH_FLOW_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  // Unauthenticated user trying to hit a protected page → /login
  if (!session && !isPublic && !isAuthFlow) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.search = "";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated user hitting a public auth page → /
  if (session && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
