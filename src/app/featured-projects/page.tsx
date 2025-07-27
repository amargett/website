import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const query = `*[_type == "project"]|order(year desc, title asc){
  _id,
  title,
  slug,
  shortDescription,
  mainMedia,
  category,
  year,
  institution
}`;

// Function to get category color
const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'research':
      return 'bg-[#3b82f6] text-white'; // Blue
    case 'industry':
      return 'bg-[#10b981] text-white'; // Green
    case 'coursework':
      return 'bg-[#f59e0b] text-white'; // Amber
    case 'activities':
      return 'bg-[#8b5cf6] text-white'; // Purple
    default:
      return 'bg-[#64748b] text-white'; // Gray
  }
};

export default async function ProjectsPage() {
  let projects = [];

  try {
    projects = await client.fetch(query);
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
        <div className="space-y-8">
          {projects.length === 0 && (
            <div className="text-center text-[#64748b]">
              <p>No projects yet.</p>
            </div>
          )}
          {projects.map((project: any) => {
            const imageUrl = project.mainMedia?.type === 'image' && project.mainMedia.image
              ? urlFor(project.mainMedia.image)?.url()
              : null;
            const videoUrl = project.mainMedia?.type === 'video'
              ? project.mainMedia.videoUrl
              : null;

            return (
              <Link
                key={project._id}
                href={`/projects/${project.slug.current}`}
                className="block group"
              >
                <article className="flex flex-col sm:flex-row gap-6 p-6 cosmic-card rounded-xl hover:shadow-xl transition-all duration-300">
                  {/* Image/Media Section */}
                  <div className="flex-shrink-0 w-full sm:w-48 h-32 sm:h-32">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={project.mainMedia.alt}
                        width={192}
                        height={128}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : videoUrl ? (
                      <video
                        src={videoUrl}
                        className="w-full h-full object-cover rounded-lg"
                        muted
                        loop
                        autoPlay
                      />
                    ) : (
                      <div className="w-full h-full bg-[#e2e8f0] dark:bg-[#334155] rounded-lg flex items-center justify-center">
                        <span className="text-[#64748b] text-sm">No media</span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-[#374151] dark:text-[#e5e7eb] group-hover:text-[#475569] transition-colors">
                        {project.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-4 shadow-sm ${getCategoryColor(project.category)}`}>
                        {project.category}
                      </span>
                    </div>

                    <p className="text-[#64748b] mb-3 leading-relaxed">
                      {project.shortDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748b]">
                      {project.institution && (
                        <span className="text-[#475569] font-medium">
                          {project.institution}
                        </span>
                      )}
                      {project.year && (
                        <span>{project.year}</span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
} 