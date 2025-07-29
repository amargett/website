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
      <div className="full-page-gradient">
        <main className="relative z-20 pb-16 bg-gradient-to-bl from-[#f97316] via-[#e0f2fe] via-30% to-[#0a4a5a] shadow-2xl">
          <div className="max-w-4xl mx-auto px-4 pt-6">
            <div className="text-center text-white">
              <p>Content is currently being loaded...</p>
              <p className="text-sm mt-2">If this persists, please check the Sanity configuration.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="full-page-gradient">
      <main className="relative z-20 pb-16 bg-gradient-to-bl from-[#f97316] via-[#e0f2fe] via-30% to-[#0a4a5a] shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <ProjectsList projects={projects} />
        </div>
      </main>
    </div>
  );
} 