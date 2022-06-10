import { createCookieSessionStorage } from "@remix-run/node";

/* Creating a session storage object that is used to store session data. */
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: process.env.NODE_ENV === 'production' ? process.env.SESSION_COOKIE_NAME : '__session-dev',
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET!], // This should be an env variable
    secure: process.env.NODE_ENV === "production",
  },
});

/* Exporting the functions from the sessionStorage object. */
export const { getSession, commitSession, destroySession } = sessionStorage;

