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
      <main className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center">
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Ashley Margetts</h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-2">Mechanical Engineering Graduate Student @ MIT</p>
          <p className="text-base text-gray-500">Robotics | Research | Design | Industry | Coursework | Activities</p>
        </section>
        <section className="w-full">
          <h2 className="text-2xl font-semibold mb-6 text-center">Featured Projects</h2>
          <div className="text-center text-gray-500">
            <p>Content is currently being loaded...</p>
            <p className="text-sm mt-2">If this persists, please check the Sanity configuration.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center">
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Ashley Margetts</h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-2">Mechanical Engineering Graduate Student @ MIT</p>
        <p className="text-base text-gray-500">Robotics | Research | Design | Industry | Coursework | Activities</p>
      </section>
      <section className="w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {featuredProjects.length === 0 && (
            <p className="col-span-full text-center text-gray-400">No featured projects yet.</p>
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
                className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition-shadow"
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={project.mainMedia.alt}
                    width={400}
                    height={160}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                ) : videoUrl ? (
                  <video
                    src={videoUrl}
                    className="w-full h-40 object-cover rounded mb-4"
                    muted
                    loop
                    autoPlay
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded mb-4 flex items-center justify-center">
                    <span className="text-gray-400">No media</span>
                  </div>
                )}
                <h3 className="text-lg font-bold mb-2 text-center">{project.title}</h3>
                <p className="text-gray-600 mb-2 text-center">{project.shortDescription}</p>
                <div className="text-sm text-gray-500 text-center">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {project.category}
                  </span>
                  {project.institution && <div className="mt-1">{project.institution}</div>}
                  {project.year && <div>{project.year}</div>}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
