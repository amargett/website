import { client } from "../../sanity/lib/client";
import Image from "next/image";
// import { urlFor } from "../../sanity/lib/image"; // adjust if needed

const query = `*[_type == "industry"]|order(startYear desc){
  _id,
  company,
  role,
  description,
  startYear,
  endYear,
  logo
}`;

export default async function IndustryPage() {
  const industry = await client.fetch(query);
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Industry Experience</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {industry.length === 0 && (
          <p className="col-span-full text-center text-gray-400">No industry experience yet.</p>
        )}
        {industry.map((item: any) => {
          const logoUrl = item.logo?.asset?.url;
          return (
            <div key={item._id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={item.company}
                  width={120}
                  height={120}
                  className="w-24 h-24 object-contain rounded-full mb-4 bg-gray-100"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-gray-400">No logo</span>
                </div>
              )}
              <h3 className="text-lg font-bold mb-1">{item.company}</h3>
              <div className="text-sm text-gray-500 mb-1">{item.role}</div>
              <div className="text-xs text-gray-400 mb-2">{item.startYear}{item.endYear ? `–${item.endYear}` : ''}</div>
              <p className="text-gray-600 text-center">{item.description}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
  console.log(industry);
} 