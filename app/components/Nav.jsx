import { Link } from "@remix-run/react";

export default function Nav() {
  return (
    <nav>
      <ul className="flex">
        <li>
          <Link to="/" className="text-red-500">
            Home
          </Link>
        </li>
        <li>
          <Link to="/events">Events</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/add-event">Add event</Link>
        </li>
      </ul>
    </nav>
  );
}
