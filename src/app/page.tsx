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

export default async function Home() {
  let featuredProjects = [];

  try {
    featuredProjects = await client.fetch(featuredProjectsQuery);
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    // Return a working page even if Sanity fails
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center">
        <section className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-[#2d3748]">Ashley Margetts</h1>
          <p className="text-xl sm:text-2xl text-[#4a7c59] mb-3 font-medium">Mechanical Engineering Graduate Student @ MIT</p>
          <p className="text-lg text-[#d2691e] font-light">Robotics | Research | Design | Industry | Coursework | Activities</p>
        </section>
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center text-gray-500">
              <p>Content is currently being loaded...</p>
              <p className="text-sm mt-2">If this persists, please check the Sanity configuration.</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center">
      <section className="text-center mb-16">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-[#2d3748]">Ashley Margetts</h1>
        <p className="text-xl sm:text-2xl text-[#4a7c59] mb-3 font-medium">Mechanical Engineering Graduate Student @ MIT</p>
        <p className="text-lg text-[#d2691e] font-light">Robotics | Research | Design | Industry | Coursework | Activities</p>
      </section>
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.length === 0 && (
            <div className="col-span-full text-center text-gray-400">
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
                  <span className="px-3 py-1 bg-[#4a7c59] text-white rounded-full text-xs font-medium">
                    {project.category}
                  </span>
                  {project.institution && <div className="mt-2 text-[#d2691e]">{project.institution}</div>}
                  {project.year && <div className="text-gray-500">{project.year}</div>}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
