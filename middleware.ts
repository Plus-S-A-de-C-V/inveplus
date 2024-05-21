// export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth && !req.url.includes("/signin")) {
    return Response.redirect(new URL("/signin", req.url));
  }

  // //signin
  // if (!req.auth) {
  //   const url = req.url.replace(req.nextUrl.pathname, "/login");
  //   return Response.redirect(url);
  // }
});
