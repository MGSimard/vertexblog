import Link from "next/link";
import { headers } from "next/headers";

// THIS IS WHERE WE WILL LIST ALL THE CREATED BLOGS AS FOLDERS

export default function Page() {
  const headersList = headers();
  const fullUrl = headersList.get("x-url") || "";
  const pathname = headersList.get("x-pathname") || "";

  return (
    <>
      <div className="fe-controls">
        <div className="fe-options">
          <button type="button">&lt;= BACK</button>
          <button type="button">File</button>
          <button type="button">Edit</button>
          <button type="button">Go</button>
          <button type="button">Favorites</button>
          {/* SHOW USER'S FAVORITE BLOGS? */}
          <button type="button">Help</button>
        </div>
        <label className="fe-address">
          <span>Address</span>
          <input type="search" className="inset" value={fullUrl} disabled />
        </label>
        <label className="fe-address">
          <span>Address</span>
          <input type="search" className="inset" value={pathname} disabled />
        </label>
      </div>

      <div className="fe-content inset">
        <ul className="explorer-icons">
          {[...Array(32)].map((icon, i) => (
            <li key={i}>
              <Link href="/documents/testfolder">Testfolder link</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
