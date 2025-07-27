import { client } from "../sanity/lib/client";
import { urlFor } from "../sanity/lib/image";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const featuredProjectsQuery = `*[_type == "project" && featured == true]|order(featuredOrder asc, title asc){
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

export default async function Home() {
  let featuredProjects = [];

  try {
    featuredProjects = await client.fetch(featuredProjectsQuery);
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    // Return a working page even if Sanity fails
    return (
      <div className="full-page-gradient">
        <main className="max-w-6xl mx-auto px-4 py-8 sm:py-16 flex flex-col items-center">
          <section className="text-center mb-12 sm:mb-16 animate-fade-in">
            <div className="space-y-2 max-w-4xl mx-auto">
              <p className="text-lg sm:text-2xl lg:text-3xl text-[#374151] dark:text-[#e5e7eb]">
                Hello, my name is Ashley.
              </p>
              <p className="text-lg sm:text-2xl lg:text-3xl text-[#374151] dark:text-[#e5e7eb] leading-relaxed">
                I am a Mechanical Engineering graduate student @ MIT interested in mechanical design, mechatronics, and robotic systems.
              </p>
            </div>
          </section>
          <section className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center text-[#64748b]">
                <p>Content is currently being loaded...</p>
                <p className="text-sm mt-2">If this persists, please check the Sanity configuration.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="full-page-gradient">
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-16 flex flex-col items-center">
        <section className="text-center mb-12 sm:mb-16 animate-fade-in">
          <div className="space-y-2 max-w-4xl mx-auto">
            <p className="text-lg sm:text-2xl lg:text-3xl text-[#374151] dark:text-[#e5e7eb]">
              Hello, my name is Ashley.
            </p>
            <p className="text-lg sm:text-2xl lg:text-3xl text-[#374151] dark:text-[#e5e7eb] leading-relaxed">
              I am a Mechanical Engineering graduate student @ MIT interested in mechanical design, mechatronics, and robotic systems.
            </p>
          </div>
        </section>
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProjects.length === 0 && (
              <div className="col-span-full text-center text-[#64748b]">
                <p>No featured projects yet.</p>
              </div>
            )}
            {featuredProjects.map((project: any) => {
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
                  className="cosmic-card rounded-xl p-4 sm:p-6 flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={project.mainMedia.alt}
                      width={400}
                      height={200}
                      className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
                    />
                  ) : videoUrl ? (
                    <video
                      src={videoUrl}
                      className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
                      muted
                      loop
                      autoPlay
                    />
                  ) : (
                    <div className="w-full h-40 sm:h-48 bg-[#e2e8f0] dark:bg-[#334155] rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-[#64748b]">No media</span>
                    </div>
                  )}
                  <h3 className="text-base sm:text-lg font-bold mb-2 text-center text-[#374151] dark:text-[#e5e7eb]">{project.title}</h3>
                  <p className="text-[#64748b] mb-3 text-center text-xs sm:text-sm leading-relaxed">{project.shortDescription}</p>
                  <div className="text-xs text-center">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getCategoryColor(project.category)}`}>
                      {project.category}
                    </span>
                    {project.institution && <div className="mt-2 text-[#475569] text-xs sm:text-sm font-medium">{project.institution}</div>}
                    {project.year && <div className="text-[#64748b] text-xs">{project.year}</div>}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
