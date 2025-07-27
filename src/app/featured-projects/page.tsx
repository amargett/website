export const dynamic = "force-dynamic";

import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
import Image from "next/image";
import Link from "next/link";

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

export default async function ProjectsPage() {
  let projects = [];
  
  try {
    projects = await client.fetch(query);
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center text-gray-500">
          <p>Content is currently being loaded...</p>
          <p className="text-sm mt-2">If this persists, please check the Sanity configuration.</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-8">
        {projects.length === 0 && (
          <div className="text-center text-gray-400">
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
              <article className="flex flex-col sm:flex-row gap-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
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
                    <div className="w-full h-full bg-[#f5f3f0] dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No media</span>
                    </div>
                  )}
                </div>
                
                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-[#2d3748] dark:text-white group-hover:text-[#d2691e] dark:group-hover:text-[#e67e22] transition-colors">
                      {project.title}
                    </h3>
                    <span className="px-3 py-1 bg-[#4a7c59] text-white rounded-full text-xs font-medium flex-shrink-0 ml-4">
                      {project.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                    {project.shortDescription}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {project.institution && (
                      <span className="text-[#d2691e] dark:text-[#e67e22] font-medium">
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
  );
} 