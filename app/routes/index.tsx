import { Link } from "@remix-run/react";


export default function Index() {
  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2 style={{ marginTop: 20 }}>Welcome to Remix on CodeSandbox!</h2>
      <p>
        <a href="https://docs.remix.run">Check out the docs</a> to get started.
      </p>
      <p>
        <Link to="not-found">Link to 404 not found page.</Link> Clicking this
        link will land you in your root CatchBoundary component.
      </p>
    </div>
  );
}
