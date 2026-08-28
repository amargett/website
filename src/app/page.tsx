import { client } from "../sanity/lib/client";
import Link from "next/link";
import Sapling from "../components/Sapling";
import FeaturedItems from "../components/FeaturedItems";

export const dynamic = "force-dynamic";

const featuredProjectsQuery = `*[_type == "project" && featured == true]|order(featuredOrder asc, title asc){
  _id,
  title,
  slug,
  shortDescription,
  mainMedia,
  category,
  technicalSkills,
  featuredLayout,
  year,
  institution,
  publication,
  courseCode,
  role,
  organization
}`;

export default async function Home() {
  let featuredProjects: any[] = [];
  let fetchFailed = false;

  try {
    featuredProjects = await client.fetch(featuredProjectsQuery);
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    fetchFailed = true;
  }

  return (
    <div className="flex flex-col gap-12">
      <header className="ps-header">
        <div>
          <p className="ps-label">Portfolio &mdash; General Arrangement</p>
          <h1 className="ps-h1 mt-2">Ashley Margetts</h1>
          <p className="ps-role">
            Mechanical engineer (M.S., MIT &rsquo;26) working in{" "}
            <em>precision machine design</em>, <em>compliant mechanisms</em>,
            and <em>robotic systems</em>. I like solving tough problems &amp; building
            things.
          </p>
        </div>
        <figure>
          <Sapling />
        </figure>
      </header>

      <section>
        <div className="ps-work-head">
          <span className="ps-label" style={{ color: "var(--ink)" }}>
            Featured Work
          </span>
          <span className="ps-rule" />
          <span className="ps-label">
            {featuredProjects.length > 0
              ? `Items 1–${featuredProjects.length}`
              : "Items"}
          </span>
        </div>

        {fetchFailed ? (
          <p className="ps-label mt-6">
            Content is loading&hellip; if this persists, check the Sanity
            configuration.
          </p>
        ) : featuredProjects.length === 0 ? (
          <p className="ps-label mt-6">No featured projects yet.</p>
        ) : (
          <FeaturedItems projects={featuredProjects} />
        )}

        <p className="mt-7">
          <Link href="/projects" className="ps-index-link">
            Full project index &rarr;
          </Link>
        </p>
      </section>
    </div>
  );
}
