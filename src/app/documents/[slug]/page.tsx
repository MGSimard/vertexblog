import { BackButton } from "@/components/BackButton";

// THIS WILL BE THE ACTUAL BLOG PATHS (WITHIN THE BLOG FOLDER)

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  return (
    <>
      <div className="fe-options">
        <BackButton />
        <button type="button">File</button>
        <button type="button">Edit</button>
        <button type="button">Go</button>
        <button type="button">Favorites</button>
        {/* SHOW USER'S FAVORITE POSTS? */}
        <button type="button">Help</button>
      </div>
      <div className="fe-content inset">
        <div>WE ARE CURRENTLY WITHIN: DOCUMENTS/{slug}</div>
      </div>
    </>
  );
}
