import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "@remix-run/react";
import styles from "./tailwind.css";
import appStylesHref from "./app.css";
import Nav from "~/components/Nav";
import ThemeProvider from "./components/ThemeProvider";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "stylesheet",
    href: appStylesHref,
  },
];

export function meta() {
  return [{ title: "Event" }];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <ThemeProvider>
        <Nav />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </ThemeProvider>
    </html>
  );
}

export function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  const navigate = useNavigate();

  return (
    <html lang="en" className="h-full">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col items-center justify-center">
        <p className="text-3xl">Whoops!</p>

        {isRouteErrorResponse(error) ? (
          <p>
            {error.status} - {error.statusText}
          </p>
        ) : error instanceof Error ? (
          <p>{error.message}</p>
        ) : (
          <p>Something happened.</p>
        )}
        <button onClick={() => navigate(-1)}>Go back</button>
        <Scripts />
      </body>
    </html>
  );
}
