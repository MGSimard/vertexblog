import Link from "next/link";
import { BackButton } from "@/components/BackButton";

// THIS IS WHERE WE WILL LIST ALL THE CREATED BLOGS AS FOLDERS

export default function Page() {
  return (
    <>
      <div className="fe-options">
        <BackButton />
        <button type="button">File</button>
        <button type="button">Edit</button>
        <button type="button">Go</button>
        <button type="button">Favorites</button>
        {/* SHOW USER'S FAVORITE BLOGS? */}
        <button type="button">Help</button>
      </div>

      <div className="fe-content inset">
        <ul className="explorer-icons">
          {[...Array(32)].map((icon, i) => (
            <li key={i}>
              <Link href={`/documents/testfolder${i}`}>Testfolder link {i}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
