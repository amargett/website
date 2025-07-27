import { client } from "../../sanity/lib/client";
import Image from "next/image";

const query = `*[_type == "research"]|order(year desc){
  _id,
  title,
  summary,
  publication,
  year,
  link,
  image
}`;

export default async function ResearchPage() {
  let research = [];
  
  try {
    research = await client.fetch(query);
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Research</h1>
        <div className="text-center text-gray-500">
          <p>Content is currently being loaded...</p>
          <p className="text-sm mt-2">If this persists, please check the Sanity configuration.</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Research</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {research.length === 0 && (
          <p className="col-span-full text-center text-gray-400">No research entries yet.</p>
        )}
        {research.map((item: any) => {
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
              <p className="text-gray-600 mb-2 text-center">{item.summary}</p>
              <div className="text-sm text-gray-500 mb-2">{item.publication} {item.year && `(${item.year})`}</div>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
} 