import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Match all routes EXCEPT static files / images / favicon / api (api handles its own auth)
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
