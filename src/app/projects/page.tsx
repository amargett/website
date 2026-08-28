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
      <main>
        <p className="ps-label">
          Content is loading&hellip; if this persists, check the Sanity
          configuration.
        </p>
      </main>
    );
  }

  return (
    <main>
      <div className="ps-work-head mb-8">
        <span className="ps-label" style={{ color: "var(--ink)" }}>
          Project Index
        </span>
        <span className="ps-rule" />
        <span className="ps-label">
          {projects.length} {projects.length === 1 ? "item" : "items"}
        </span>
      </div>
      <ProjectsList projects={projects} />
    </main>
  );
}
