import { client } from "../../sanity/lib/client";
import Image from "next/image";

const query = `*[_type == "activity"]|order(year desc){
  _id,
  title,
  organization,
  description,
  year,
  image
}`;

export default async function ActivitiesPage() {
  const activities = await client.fetch(query);
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Activities</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {activities.length === 0 && (
          <p className="col-span-full text-center text-gray-400">No activities yet.</p>
        )}
        {activities.map((item: any) => {
          const imageUrl = item.image?.asset?.url;
          return (
            <div key={item._id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={item.title}
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover rounded mb-4"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded mb-4 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <div className="text-sm text-gray-500 mb-1">{item.organization}</div>
              <div className="text-xs text-gray-400 mb-2">{item.year}</div>
              <p className="text-gray-600 text-center">{item.description}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
} 