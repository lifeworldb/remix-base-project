import type { SessionStorage } from "@remix-run/server-runtime";
import type { AuthenticateOptions } from "remix-auth";
import type { AppLoadContext } from "@remix-run/node";
import { Strategy } from "remix-auth";

/* Defining the type of the parameters that will be passed to the verify function. */
export interface FormWithRequestStrategyVerifyParams {
  /**
   * A FormData object with the content of the form used to trigger the
   * authentication.
   *
   * Here you can read any input value using the FormData API.
   */
  form: FormData;
  /**
   * The request object that triggered the authentication.
   */
  request: Request;
  /**
   * An object of arbitrary for route loaders and actions provided by the
   * server's `getLoadContext()` function.
   */
  context?: AppLoadContext;
}

/* It's a strategy that authenticates a user by verifying a form */
export class FormWithRequestStrategy<User> extends Strategy<
  User,
  FormWithRequestStrategyVerifyParams
> {
  /* It's the name of the strategy. It's used to identify the strategy when you use it in your app. */
  name = "form-with-request";

 /**
  * It takes a request, a session storage, and some options, and returns a promise of a user
  * @param {Request} request - The request object
  * @param {SessionStorage} sessionStorage - This is the session storage that you've configured in your
  * app.
  * @param {AuthenticateOptions} options - AuthenticateOptions
  * @returns The user object
  */
  async authenticate(
    request: Request,
    sessionStorage: SessionStorage,
    options: AuthenticateOptions
  ): Promise<User> {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"))
    let form = await request.formData();

    let user: User;
    try {
      user = await this.verify({ form, request, context: options.context });
    } catch (error) {
      let message = (error as Error).message;
      return await this.failure(message, request, sessionStorage, options);
    }

    session.set(options.sessionKey, user);

    return this.success(user, request, sessionStorage, options);
  }
}
