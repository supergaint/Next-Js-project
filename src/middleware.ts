import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    session &&
    [
      "/sign-in",
      "/sign-up",
      "/verify",
      "/",
    ].some((route) => url.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

}


// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path", "/verify/:path"],
};
