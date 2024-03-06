import { redirect } from "@remix-run/node";

export const meta = () => {
  return [{ title: "Remix Post App" }];
};

export async function loader() {
  return redirect("/events");
}
