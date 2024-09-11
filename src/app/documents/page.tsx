import Link from "next/link";

// THIS IS WHERE WE WILL LIST ALL THE CREATED BLOGS AS FOLDERS

export default function Page() {
  return (
    <ul className="explorer-icons">
      {[...Array(32)].map((icon, i) => (
        <li key={i}>
          <Link href="/documents/testfolder">Testfolder link</Link>
        </li>
      ))}
    </ul>
  );
}
