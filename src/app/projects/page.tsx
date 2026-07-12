import { client } from "../../sanity/lib/client";
import ProjectsList from "../../components/ProjectsList";

export const dynamic = "force-dynamic";

const projectsQuery = `*[_type == "project"]|order(year desc, title asc){
  _id,
  title,
  slug,
  shortDescription,
  mainMedia,
  category,
  technicalSkills,
  year,
  institution,
  publication,
  courseCode,
  role,
  organization
}`;

export default async function ProjectsPage() {
  let projects = [];

  try {
    projects = await client.fetch(projectsQuery);
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    return (
      <main className="tg-mono max-w-4xl mx-auto px-4 py-16 relative z-10">
        <p className="text-[var(--tg-amber)]">$ ls ~/projects</p>
        <p className="text-[var(--tg-dim)] text-sm mt-2">// content is loading… if this persists, check the Sanity configuration.</p>
      </main>
    );
  }

  return (
    <main className="relative z-10 max-w-5xl mx-auto px-4 py-10 sm:py-14">
      <div className="flex items-baseline gap-3 mb-8 border-b border-[var(--tg-border)] pb-4">
        <h1 className="tg-mono text-lg sm:text-xl text-[var(--tg-fg)]">
          <span className="text-[var(--tg-green)]">$</span> ls ~/projects
        </h1>
        <span className="tg-mono text-[var(--tg-dim)] text-xs sm:text-sm">
          {projects.length} {projects.length === 1 ? "entry" : "entries"}
        </span>
      </div>
      <ProjectsList projects={projects} />
    </main>
  );
} 