import Link from "next/link";
import { CurrentPath } from "@/components/CurrentPath";

// THIS IS WHERE WE WILL LIST ALL THE CREATED BLOGS AS FOLDERS

export default function Page() {
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
