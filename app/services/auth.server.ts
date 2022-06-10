import axios from "axios";
import setCookie from 'set-cookie-parser';
import { Authenticator, AuthorizationError } from "remix-auth";
import { gql } from "graphql-tag";
import { print } from "graphql";
import { sessionStorage } from "~/services/session.server";
import { FormWithRequestStrategy } from "./strategies/FormWithRequest.strategy";

/* Defining the shape of the user object that is returned from the authentication strategy. */
interface AuthUser {
  email: string;
  cookies: {
    'access-token': string;
    'refresh-token': string;
  }
}

/* Creating a new instance of the Authenticator class. */
export const auth = new Authenticator<AuthUser>(sessionStorage);

/* A GraphQL query that is used to authenticate the user. */
const SIGN_IN = gql`
  mutation login ($input: SessionInput!) {
    login (input: $input) {
      developerCode
      message
    }
  }
`

/* Using the FormWithRequestStrategy to authenticate the user. */
auth.use(
  new FormWithRequestStrategy(async ({ form, request }) => {
    const email = form.get("email");
    const password = form.get("password");
    const endpoint = process.env.NODE_ENV === 'production' ? process.env.API_ENDPOINT! : 'http://localhost:4000/graphql'

    // replace the code below with your own authentication logic
    if (!password) throw new AuthorizationError("Password is required");

    if (!email) throw new AuthorizationError("Email is required");

    const { headers, data: { data } } = await axios.post(endpoint, {
      query: print(SIGN_IN),
      variables: {
        input: {
          email,
          password
        }
      }
    });

    if (data.login.developerCode === 'ERROR_QUERY') throw new AuthorizationError(data.login.message)

    const setCookieHeader = headers['set-cookie'];
    const parsedResponseCookies = setCookie.parse(setCookie.splitCookiesString(setCookieHeader))

    return {
      email,
      // @ts-ignore
      // eslint-disable-next-line no-sequences
      cookies: parsedResponseCookies.reduce((obj, item) => (obj[item.name] = item.value, obj) ,{})
    } as AuthUser;
  })
);