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
  technicalSkills,
  featuredLayout,
  year,
  institution,
  publication,
  courseCode,
  role,
  organization
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

// Function to get technical skill icon
const getTechnicalSkillIcon = (skill: string) => {
  switch (skill.toLowerCase()) {
    case 'mechanical-design':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'electronics':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      );
    case 'python':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm-1 6v8h2V8h-2zm0-2h2v2h-2V6z"/>
        </svg>
      );
    case 'cpp':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L1.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.271-.616.271-.91V6.91c.003-.587-.412-1.307-.92-1.61zM12 19.11c-3.977 0-7.2-3.318-7.2-7.11S8.023 4.89 12 4.89s7.2 3.318 7.2 7.11S15.977 19.11 12 19.11z"/>
        </svg>
      );
    default:
      return null;
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
    <div className="full-page-gradient min-h-screen">
      {/* Introduction Header */}
      <header className="bg-white dark:bg-white text-[#0a4a5a] pt-20 pb-32 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-80 fixed top-0 left-0 right-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="space-y-3 max-w-4xl animate-fade-in">
            <div className="typewriter-greeting">
              <p className="header-text text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-[#0a4a5a] font-black">
                Hello, my name is Ashley.
              </p>
            </div>
            <p className="header-text text-lg sm:text-2xl lg:text-3xl xl:text-4xl text-[#0a4a5a] leading-relaxed font-black sm:font-semibold lg:font-normal">
              I am a Mechanical Engineering graduate student @ MIT interested in mechanical design, mechatronics, & robotic systems. See below for some of my featured work!
            </p>
          </div>
        </div>
      </header>

      {/* Spacer to account for fixed header */}
      <div className="h-52 sm:h-60 lg:h-120"></div> {/* Adjusted to match reduced header heights */}

      {/* Featured Projects - Overlaps Introduction */}
      <main className="relative z-20 rounded-t-3xl pt-12 pb-32 bg-gradient-to-bl from-[#f97316] via-[#e0f2fe] via-30% to-[#0a4a5a] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12" style={{ gridAutoRows: 'minmax(140px, auto)', gridAutoFlow: 'dense' }}>
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
                  className={`cosmic-card rounded-xl p-6 sm:p-8 flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-sm ${
                    project.featuredLayout === 'wide' ? 'lg:col-span-2' : ''
                  }`}
                >
                  <div className="flex-1">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={project.mainMedia.alt}
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover rounded-lg mb-6"
                        priority={index === 0} // Add priority to first image
                      />
                    ) : videoUrl ? (
                      <HoverVideo
                        src={videoUrl}
                        className="w-full h-auto rounded-lg mb-6"
                      />
                    ) : (
                      <div className="w-full h-64 sm:h-80 lg:h-96 bg-[#e2e8f0] dark:bg-[#334155] rounded-lg mb-6 flex items-center justify-center">
                        <span className="text-[#64748b]">No media</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex-shrink-0 ${project.featuredLayout === 'wide' ? 'lg:max-w-md' : ''}`}>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-[#374151] dark:text-[#e5e7eb]">{project.title}</h3>
                    <p className="text-[#64748b] mb-4 text-sm sm:text-base leading-relaxed">{project.shortDescription}</p>
                    <div>
                      <span className={`px-3 py-2 rounded-full text-sm font-medium shadow-sm ${getCategoryColor(project.category)}`}>
                        {project.category}
                      </span>
                      {project.technicalSkills && project.technicalSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technicalSkills.map((skill: string, skillIndex: number) => (
                            <span
                              key={skillIndex}
                              className="inline-block px-2 py-1 rounded text-xs font-normal bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            >
                              {skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          ))}
                        </div>
                      )}
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