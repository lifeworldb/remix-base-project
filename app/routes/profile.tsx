import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import gql from "graphql-tag";

import { auth } from "~/services/auth.server";
import fetcher from '~/utils/fetcher';

type LoaderData = { email: string };

const ME = gql`
query me {
  me {
      ... on Response {
          developerCode
          message
      }
      ... on User {
          email
          lastName
          name
      }
  }
}
`

export const action: ActionFunction = async ({ request }) => {
  await auth.logout(request, { redirectTo: "/login" });
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
  await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const { graphqlClient } = await fetcher({ request, context, params });

  const { data } = await graphqlClient(ME);

  return json<LoaderData>({ email: data.me.email });
};

export default function Profile() {
  const { email } = useLoaderData<LoaderData>();
  return (
    <>
      <h1>Hello {email}</h1>

      <Form method="post">
        <button>Log Out</button>
      </Form>
    </>
  );
}