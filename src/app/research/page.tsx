import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const query = `*[_type == "project" && category == "research"]|order(year desc){
  _id,
  title,
  slug,
  shortDescription,
  mainMedia,
  year,
  institution,
  publication
}`;

export default async function ResearchPage() {
  let projects = [];
  
  try {
    projects = await client.fetch(query);
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#2d3748]">Research</h1>
        <div className="text-center text-gray-500">
          <p>Content is currently being loaded...</p>
          <p className="text-sm mt-2">If this persists, please check the Sanity configuration.</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#2d3748]">Research</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.length === 0 && (
          <p className="col-span-full text-center text-gray-400">No research projects yet.</p>
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
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
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
                <div className="w-full h-48 bg-[#f5f3f0] rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400">No media</span>
                </div>
              )}
              <h3 className="text-lg font-bold mb-2 text-center text-[#2d3748]">{project.title}</h3>
              <p className="text-gray-600 mb-3 text-center text-sm leading-relaxed">{project.shortDescription}</p>
              <div className="text-xs text-center">
                {project.institution && <div className="text-[#d2691e] font-medium">{project.institution}</div>}
                {project.publication && <div className="text-[#4a7c59]">{project.publication}</div>}
                {project.year && <div className="text-gray-500">{project.year}</div>}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
} 