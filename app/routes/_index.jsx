import { redirect } from "@remix-run/node";

export const meta = () => {
  return [{ title: "Event" }];
};

export async function loader() {
  return redirect("/events");
}
