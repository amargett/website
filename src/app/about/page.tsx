import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

export const dynamic = "force-dynamic";

const aboutQuery = `*[_type == "about"][0]{
  title,
  photo,
  introduction,
  email,
  linkedin,
  resume{
    asset->{
      url
    }
  },
  github,
  website
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

  const githubLabel = aboutData.github
    ?.replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

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

          <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[36rem]">
            <div className="border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5">
              <span className="tb-key">Email</span>
              <span className="tb-val">
                <a href={`mailto:${aboutData.email}`}>{aboutData.email}</a>
              </span>
            </div>
            {aboutData.linkedin && (
              <div className="border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5">
                <span className="tb-key">LinkedIn</span>
                <span className="tb-val">
                  <a
                    href={aboutData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View profile
                  </a>
                </span>
              </div>
            )}
            {aboutData.github && (
              <div className="border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5">
                <span className="tb-key">GitHub</span>
                <span className="tb-val">
                  <a
                    href={aboutData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {githubLabel}
                  </a>
                </span>
              </div>
            )}
            {aboutData.resume?.asset?.url && (
              <div className="border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5">
                <span className="tb-key">Resume</span>
                <span className="tb-val">
                  <a
                    href={aboutData.resume.asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    resume.pdf
                  </a>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
