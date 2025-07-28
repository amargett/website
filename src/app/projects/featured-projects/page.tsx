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
      <div className="full-page-gradient">
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center text-[#64748b]">
            <p>Content is currently being loaded...</p>
            <p className="text-sm mt-2">If this persists, please check the Sanity configuration.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="full-page-gradient">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <ProjectsList projects={projects} />
      </main>
    </div>
  );
} 