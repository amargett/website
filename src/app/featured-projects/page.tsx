export const dynamic = "force-dynamic";

import { client } from "../../sanity/lib/client";
import Image from "next/image";
import { urlFor } from "../../sanity/lib/image"; // adjust if needed




const query = `*[_type == "featuredProject"]|order(order asc){
  _id,
  title,
  description,
  image,
  githubUrl,
  demoUrl
}`;


export default async function FeaturedProjectsPage() {
  const projects = await client.fetch(query);
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Featured Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {projects.length === 0 && (
          <p className="col-span-full text-center text-gray-400">No featured projects yet.</p>
        )}
        {projects.map((project: any) => {
          const imageUrl = project.image ? urlFor(project.image).url() : null;
          return (
            <div key={project._id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={project.title}
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover rounded mb-4"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded mb-4 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              <h3 className="text-lg font-bold mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-2 text-center">{project.description}</p>
              <div className="flex gap-4">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Demo</a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
} 