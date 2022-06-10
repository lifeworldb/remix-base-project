import type { ActionFunction, DataFunctionArgs, LoaderFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { auth } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";

type LoaderData = {
  error: { message: string } | null;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  await auth.isAuthenticated(request, {
    successRedirect: "/profile",
  });
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const error = session.get(auth.sessionErrorKey) as LoaderData["error"];
  return json<LoaderData>({ error });
};

export const action: ActionFunction = async ({ request }: DataFunctionArgs) => {
  return await auth.authenticate("form-with-request", request, {
    successRedirect: "/profile",
    failureRedirect: "/login",
  });
};

export default () => {
  const { error } = useLoaderData<LoaderData>();

  return (
    <Form method="post">
      {error ? <div>{error.message}</div> : null}
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          defaultValue="sebastianlionwork@gmail.com"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          defaultValue="31051346Sem*"
        />
      </div>

      <button>Log In</button>
    </Form>
  );
};
