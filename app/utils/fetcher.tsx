import type { DataFunctionArgs } from "@remix-run/server-runtime";
import type { AxiosPromise, AxiosRequestConfig } from "axios"
import type { DocumentNode } from "graphql";
import { print } from "graphql";
import { sendGraphQLRequest } from "remix-graphql/index.server";
import axios from "axios";
import { getSession } from "~/services/session.server";

export declare type Variables = Record<string, unknown>

interface IuseFetcher {
  graphqlClient: <T>(query: DocumentNode, variables?: Variables) => Promise<T>
  fetch: <T>(url: string, options?: AxiosRequestConfig) => AxiosPromise<T>
}

export default async (args?: DataFunctionArgs): Promise<IuseFetcher> => {
  const session = await getSession(args!.request.headers.get("Cookie"));
  const endpoint = process.env.NODE_ENV === 'production' ? process.env.API_ENDPOINT! : 'http://localhost:4000/graphql'
  const headers = true ? {
    'Content-Type': 'application/json',
    Cookie: Object.entries(session.get("user").cookies).map(([key, value]) => `${key}=${value}`).join('; '),
  } : undefined;

  const fetch =  <T,> (url: string, config?: AxiosRequestConfig): AxiosPromise<T> => axios(url, config);

  const graphqlClient = async <T,>(query: DocumentNode, variables?: Variables): Promise<T> => {
    try {
      return sendGraphQLRequest({
        args: args!,
        endpoint,
        headers,
        query: print(query),
        variables,
      }).then(res => res.json())
    } catch {
      throw new Response("Something went wrong while loading the data :(");
    }
  }

  return {
    graphqlClient,
    fetch,
  }
}