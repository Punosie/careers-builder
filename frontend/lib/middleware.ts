// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const userId = claims?.sub as string | undefined; // auth.users.id

  // Redirect root and /auth to login
  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/auth"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Skip auth check for public auth routes
  if (
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/api/auth")
  ) {
    return supabaseResponse;
  }

  // Redirect unauthenticated users to login
  if (!userId) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Company slug protection for /[slug]/edit routes
  if (request.nextUrl.pathname.match(/^\/[^/]+\/edit$/)) {
    const slug = request.nextUrl.pathname.split("/")[1];

    const { data: company, error } = await supabase
      .from("company")
      .select("id, user")
      .eq("slug", slug)
      .single();

    console.log("Middleware company check:", {
      path: request.nextUrl.pathname,
      slug,
      userId,
      companyUser: company?.user,
      error: error?.message,
    });

    if (!company || company.user !== userId) {
      const url = request.nextUrl.clone();
      url.pathname = "/403";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
