import { client } from "../../sanity/lib/client";
import { projectId, dataset, apiVersion } from "../../sanity/env";

export default async function DebugPage() {
  let status = "Unknown";
  let error = null;
  let data = null;

  try {
    // Test a simple query
    data = await client.fetch('*[_type == "featuredProject"][0]');
    status = "Success";
  } catch (err) {
    status = "Error";
    error = err instanceof Error ? err.message : String(err);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
          <p><strong>Project ID:</strong> {projectId || "Not set"}</p>
          <p><strong>Dataset:</strong> {dataset || "Not set"}</p>
          <p><strong>API Version:</strong> {apiVersion || "Not set"}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Sanity Connection Test</h2>
          <p><strong>Status:</strong> <span className={status === "Success" ? "text-green-600" : "text-red-600"}>{status}</span></p>
          {error && (
            <div className="mt-2">
              <p><strong>Error:</strong></p>
              <pre className="bg-red-50 p-2 rounded text-sm overflow-auto">{error}</pre>
            </div>
          )}
          {data && (
            <div className="mt-2">
              <p><strong>Test Data:</strong></p>
              <pre className="bg-green-50 p-2 rounded text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 