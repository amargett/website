import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
import { urlForFile } from "../../sanity/lib/file";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

export const dynamic = "force-dynamic";

const aboutQuery = `*[_type == "about"][0]{
  title,
  photo,
  introduction,
  email,
  linkedin,
  resume{
    asset->{
      url
    }
  },
  github,
  website
}`;

export default async function AboutPage() {
  let aboutData = null;

  try {
    aboutData = await client.fetch(aboutQuery);
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    return (
      <div className="full-page-gradient">
        <main className="relative z-20 min-h-screen bg-gradient-to-bl from-[#f97316] via-[#e0f2fe] via-30% to-[#0a4a5a] shadow-2xl">
          <div className="max-w-6xl mx-auto px-4 pt-6">
            <div className="bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-sm shadow-xl rounded-xl p-8">
              <div className="text-center text-[#64748b]">
                <p>About page content not found.</p>
                <p className="text-sm mt-2">Please add content in Sanity Studio.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="full-page-gradient">
        <main className="relative z-20 bg-gradient-to-bl from-[#f97316] via-[#e0f2fe] via-30% to-[#0a4a5a] shadow-2xl">
          <div className="max-w-6xl mx-auto px-4 pt-6">
            <div className="text-center text-white">
              <p>About page content not found.</p>
              <p className="text-sm mt-2">Please add content in Sanity Studio.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="full-page-gradient">
      <main className="relative z-20 min-h-screen bg-gradient-to-bl from-[#f97316] via-[#e0f2fe] via-30% to-[#0a4a5a] shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 pt-6">
          <div className="bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-sm shadow-xl rounded-xl p-8 min-h-[calc(100vh-200px)] flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-6 text-[#374151] dark:text-[#e5e7eb]">{aboutData.title}</h1>
            
            <div className="flex flex-col lg:flex-row gap-8 mb-8 items-start lg:items-center">
              {/* Profile Photo */}
              <div className="lg:w-1/3">
                {aboutData.photo && (
                  <div className="relative max-w-xs lg:max-w-none">
                    <Image
                      src={urlFor(aboutData.photo)?.url() || ''}
                      alt="Profile Photo"
                      width={300}
                      height={300}
                      className="w-48 h-48 sm:w-64 sm:h-64 lg:w-full lg:h-auto rounded-lg shadow-lg object-cover"
                    />
                  </div>
                )}
              </div>
              
              {/* Introduction */}
              <div className="lg:w-2/3 lg:flex lg:items-center">
                <div className="prose prose-base max-w-none text-[#64748b] text-base leading-relaxed font-light" style={{ fontFamily: 'var(--font-inter)' }}>
                  <PortableText value={aboutData.introduction} />
                </div>
              </div>
            </div>

            {/* Contact Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <a 
                href={`mailto:${aboutData.email}`}
                className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold sm:font-medium text-[#374151] dark:text-[#e5e7eb]">Email</p>
                  <p className="text-sm font-medium sm:font-normal text-[#64748b]">{aboutData.email}</p>
                </div>
              </a>

              {/* LinkedIn */}
              <a 
                href={aboutData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold sm:font-medium text-[#374151] dark:text-[#e5e7eb]">LinkedIn</p>
                  <p className="text-sm font-medium sm:font-normal text-[#64748b]">View Profile</p>
                </div>
              </a>

              {/* Resume Download */}
              <a 
                href={aboutData.resume?.asset?.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold sm:font-medium text-[#374151] dark:text-[#e5e7eb]">Resume</p>
                  <p className="text-sm font-medium sm:font-normal text-[#64748b]">Download PDF</p>
                </div>
              </a>

              {/* GitHub (if provided) */}
              {aboutData.github && (
                <a 
                  href={aboutData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold sm:font-medium text-[#374151] dark:text-[#e5e7eb]">GitHub</p>
                    <p className="text-sm font-medium sm:font-normal text-[#64748b]">View Projects</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
