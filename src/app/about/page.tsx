import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

export const dynamic = "force-dynamic";

const aboutQuery = `*[_type == "about"][0]{
  title,
  photo,
  introduction
}`;

export default async function AboutPage() {
  let aboutData = null;

  try {
    aboutData = await client.fetch(aboutQuery);
  } catch (err) {
    console.error("Sanity fetch failed:", err);
  }

  if (!aboutData) {
    return (
      <main>
        <p className="ps-label">
          About content not found &mdash; add it in Sanity Studio.
        </p>
      </main>
    );
  }

  return (
    <main>
      <div className="ps-work-head mb-10">
        <span className="ps-label" style={{ color: "var(--ink)" }}>
          About
        </span>
        <span className="ps-rule" />
        <span className="ps-label">Detail A</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {aboutData.photo && (
          <figure className="flex-shrink-0 flex flex-col gap-2.5">
            <Image
              src={urlFor(aboutData.photo)?.url() || ""}
              alt="Ashley Margetts"
              width={320}
              height={320}
              className="w-56 h-56 sm:w-72 sm:h-72 object-cover border border-[var(--ink)]"
            />
            <figcaption className="ps-label">
              Ashley Margetts &mdash; MIT
            </figcaption>
          </figure>
        )}

        <div className="flex-1 min-w-0">
          {aboutData.title && (
            <h1 className="ps-h2 mb-5">{aboutData.title}</h1>
          )}
          <div className="ps-prose max-w-[42rem]">
            <PortableText value={aboutData.introduction} />
          </div>
        </div>
      </div>
    </main>
  );
}
