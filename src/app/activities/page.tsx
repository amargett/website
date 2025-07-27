import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const query = `*[_type == "project" && category == "activities"]|order(year desc){
  _id,
  title,
  slug,
  shortDescription,
  mainMedia,
  year,
  institution,
  organization
}`;

export default async function ActivitiesPage() {
  let projects = [];
  
  try {
    projects = await client.fetch(query);
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Activities</h1>
        <div className="text-center text-gray-500">
          <p>Content is currently being loaded...</p>
          <p className="text-sm mt-2">If this persists, please check the Sanity configuration.</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Activities</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {projects.length === 0 && (
          <p className="col-span-full text-center text-gray-400">No activities yet.</p>
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
                {project.institution && <div>{project.institution}</div>}
                {project.organization && <div>{project.organization}</div>}
                {project.year && <div>{project.year}</div>}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
} 