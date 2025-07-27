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
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center text-gray-500">
          <p>Content is currently being loaded...</p>
          <p className="text-sm mt-2">If this persists, please check the Sanity configuration.</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.length === 0 && (
          <div className="col-span-full text-center text-gray-400">
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={project.mainMedia.alt}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : videoUrl ? (
                <video
                  src={videoUrl}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  muted
                  loop
                  autoPlay
                />
              ) : (
                <div className="w-full h-48 bg-[#f5f3f0] dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400">No media</span>
                </div>
              )}
              <h3 className="text-lg font-bold mb-2 text-center text-[#2d3748] dark:text-white">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3 text-center text-sm leading-relaxed">{project.shortDescription}</p>
              <div className="text-xs text-center">
                <span className="px-3 py-1 bg-[#4a7c59] text-white rounded-full text-xs font-medium">
                  {project.category}
                </span>
                {project.institution && <div className="mt-2 text-[#d2691e] dark:text-[#e67e22]">{project.institution}</div>}
                {project.year && <div className="text-gray-500 dark:text-gray-400">{project.year}</div>}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
} 