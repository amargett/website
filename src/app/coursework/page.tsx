import { client } from "../../sanity/lib/client";

const query = `*[_type == "coursework"]|order(year desc){
  _id,
  courseCode,
  courseName,
  description,
  year,
  institution
}`;

export default async function CourseworkPage() {
  let courses = [];
  
  try {
    courses = await client.fetch(query);
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Coursework</h1>
        <div className="text-center text-gray-500">
          <p>Content is currently being loaded...</p>
          <p className="text-sm mt-2">If this persists, please check the Sanity configuration.</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Coursework</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {courses.length === 0 && (
          <p className="col-span-full text-center text-gray-400">No coursework entries yet.</p>
        )}
        {courses.map((item: any) => (
          <div key={item._id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <h3 className="text-lg font-bold mb-1">{item.courseName}</h3>
            <div className="text-sm text-gray-500 mb-1">{item.courseCode}</div>
            <div className="text-xs text-gray-400 mb-2">{item.year} {item.institution && `| ${item.institution}`}</div>
            <p className="text-gray-600 text-center">{item.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
} 