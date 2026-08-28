import { client } from "../sanity/lib/client";

// The sheet's title block: authorship on the left, live contact links from the
// Sanity "about" document on the right.

interface Contact {
  email?: string;
  github?: string;
  linkedin?: string;
  resume?: { asset?: { url?: string } };
}

const contactQuery = `*[_type == "about"][0]{
  email,
  github,
  linkedin,
  resume{ asset->{ url } }
}`;

export default async function TitleBlock() {
  let contact: Contact | null = null;
  try {
    contact = await client.fetch(contactQuery);
  } catch (err) {
    console.error("Sanity fetch failed (title block):", err);
  }

  const githubLabel = contact?.github
    ?.replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  const linkedinLabel = contact?.linkedin
    ?.replace(/^https?:\/\/(www\.)?linkedin\.com\//, "")
    .replace(/\/$/, "");

  return (
    <footer className="ps-titleblock">
      <div className="tb-cell tb-author">
        <span className="tb-key">Drawn by</span>
        <span className="tb-val">ashley margetts</span>
      </div>
      <div className="tb-cell">
        <span className="tb-key">LinkedIn</span>
        <span className="tb-val">
          {contact?.linkedin ? (
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkedinLabel || "profile"}
            </a>
          ) : (
            "—"
          )}
        </span>
      </div>
      <div className="tb-cell">
        <span className="tb-key">Email</span>
        <span className="tb-val">
          {contact?.email ? (
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          ) : (
            "—"
          )}
        </span>
      </div>
      <div className="tb-cell">
        <span className="tb-key">GitHub</span>
        <span className="tb-val">
          {contact?.github ? (
            <a href={contact.github} target="_blank" rel="noopener noreferrer">
              {githubLabel}
            </a>
          ) : (
            "—"
          )}
        </span>
      </div>
      <div className="tb-cell">
        <span className="tb-key">Resume</span>
        <span className="tb-val">
          {contact?.resume?.asset?.url ? (
            <a
              href={contact.resume.asset.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              resume.pdf
            </a>
          ) : (
            "—"
          )}
        </span>
      </div>
    </footer>
  );
}
