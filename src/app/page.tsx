import { client } from "../sanity/lib/client";
import { urlFor } from "../sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import HoverVideo from "../components/HoverVideo";
import { projectId, dataset } from "../sanity/env";

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

// Function to get category color (kept for featured projects on homepage)
const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'research':
      return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'; // Light gray bg, dark gray text
    case 'industry':
      return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'; // Light gray bg, dark gray text
    case 'coursework':
      return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'; // Light gray bg, dark gray text
    case 'extracurricular': // Updated from 'extracurriculars'
      return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'; // Light gray bg, dark gray text
    default:
      return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'; // Light gray bg, dark gray text
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
        {/* Introduction Header */}
        <header className="bg-[#1e293b] dark:bg-[#0f172a] text-white py-16 sm:py-24 relative z-10">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="space-y-2 max-w-4xl mx-auto animate-fade-in">
              <p className="text-lg sm:text-2xl lg:text-3xl text-white">
                Hello, my name is Ashley.
              </p>
              <p className="text-lg sm:text-2xl lg:text-3xl text-white leading-relaxed">
                I am a Mechanical Engineering graduate student @ MIT interested in mechanical design, mechatronics, and robotic systems.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-20 rounded-t-3xl -mt-8 pt-12 pb-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center text-[#64748b]">
                <p>Content is currently being loaded...</p>
                <p className="text-sm mt-2">If this persists, please check the Sanity configuration.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="full-page-gradient">
      {/* Introduction Header */}
      <header className="bg-gray-700 dark:bg-gray-800 text-white py-16 sm:py-24 lg:py-32 pb-32 sm:pb-48 lg:pb-64 fixed top-0 left-0 right-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-3 max-w-4xl animate-fade-in">
            <div className="typewriter-greeting">
              <p className="header-text text-xl sm:text-3xl lg:text-4xl xl:text-5xl text-white">
                Hello, my name is Ashley.
              </p>
            </div>
            <p className="header-text text-lg sm:text-2xl lg:text-3xl xl:text-4xl text-white leading-relaxed">
              I am a Mechanical Engineering graduate student @ MIT interested in mechanical design, mechatronics, & robotic systems. See below for some of my featured work!
            </p>
          </div>
        </div>
      </header>

      {/* Spacer to account for fixed header */}
      <div className="h-64 sm:h-80 lg:h-96"></div>

      {/* Featured Projects - Overlaps Introduction */}
      <main className="relative z-20 rounded-t-3xl pt-12 pb-16 bg-gradient-to-bl from-[#f97316] via-[#e0f2fe] via-30% to-[#0a4a5a] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {featuredProjects.length === 0 && (
              <div className="col-span-full text-center text-white">
                <p>No featured projects yet.</p>
              </div>
            )}
            {featuredProjects.map((project: any, index: number) => {
              const imageUrl = project.mainMedia?.type === 'image' && project.mainMedia.image 
                ? urlFor(project.mainMedia.image)?.url() 
                : null;
                      
              let videoUrl = null;
              if (project.mainMedia?.type === 'video') {
                if (project.mainMedia.videoFile?.asset?.url) {
                  videoUrl = project.mainMedia.videoFile.asset.url;
                } else if (project.mainMedia.videoFile?.asset?._ref) {
                  const assetRef = project.mainMedia.videoFile.asset._ref;
                  // Extract the file ID from the asset reference
                  const fileId = assetRef.replace('file-', '').split('-').slice(0, -1).join('-');
                  videoUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileId}.mp4`;
                } else if (project.mainMedia.videoUrl) {
                  videoUrl = project.mainMedia.videoUrl;
                }
              }
            
              return (
                <Link 
                  key={project._id} 
                  href={`/projects/${project.slug.current}`}
                  className="cosmic-card rounded-xl p-6 sm:p-8 flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-sm"
                >
                  <div className="flex-1">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={project.mainMedia.alt}
                        width={600}
                        height={400}
                        className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg mb-6"
                        priority={index === 0} // Add priority to first image
                      />
                    ) : videoUrl ? (
                      <HoverVideo
                        src={videoUrl}
                        className="w-full h-64 sm:h-80 lg:h-96 rounded-lg mb-6"
                      />
                    ) : (
                      <div className="w-full h-64 sm:h-80 lg:h-96 bg-[#e2e8f0] dark:bg-[#334155] rounded-lg mb-6 flex items-center justify-center">
                        <span className="text-[#64748b]">No media</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-[#374151] dark:text-[#e5e7eb]">{project.title}</h3>
                    <p className="text-[#64748b] mb-4 text-sm sm:text-base leading-relaxed flex-1">{project.shortDescription}</p>
                    <div className="mt-auto">
                      <span className={`px-3 py-2 rounded-full text-sm font-medium shadow-sm ${getCategoryColor(project.category)}`}>
                        {project.category}
                      </span>
                      {project.institution && <div className="mt-3 text-[#475569] text-sm sm:text-base font-medium">{project.institution}</div>}
                      {project.year && <div className="text-[#64748b] text-sm">{project.year}</div>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
} 