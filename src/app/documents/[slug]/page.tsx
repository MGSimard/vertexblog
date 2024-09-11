// THIS WILL BE THE ACTUAL BLOG PATHS (WITHIN THE BLOG FOLDER)

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  return <div>WE ARE CURRENTLY WITHIN: DOCUMENTS/{slug}</div>;
}
