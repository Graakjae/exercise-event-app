import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./tailwind.css";
import appStylesHref from "./app.css";
import Nav from "~/components/Nav";

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
  return [{ title: "Work Journal" }];
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
      <body>
        <h1 className="text-4xl text-center">EVENT</h1>
        <Nav />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
