import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="full-page-gradient">
      <main className="relative z-20 rounded-t-3xl pt-12 pb-16 bg-gradient-to-bl from-[#f97316] via-[#e0f2fe] via-30% to-[#0a4a5a] shadow-2xl">
        <div className="max-w-4xl mx-auto px-4">
          <div className="cosmic-card rounded-xl p-8 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-sm shadow-xl">
            <h1 className="text-3xl font-bold mb-6 text-[#374151] dark:text-[#e5e7eb]">About Me</h1>
            
            <div className="prose prose-lg max-w-none text-[#64748b]">
              <p className="mb-6">
                I am a Mechanical Engineering graduate student at MIT, passionate about mechanical design, mechatronics, and robotic systems. 
                My research focuses on developing innovative solutions that bridge the gap between theoretical concepts and practical applications.
              </p>
              
              <p className="mb-6">
                With a strong foundation in mechanical engineering principles, I specialize in designing and implementing robotic systems 
                that can operate in complex, real-world environments. My work spans from theoretical research to hands-on prototyping, 
                always with an eye toward practical implementation.
              </p>
              
              <p className="mb-6">
                I believe in the power of interdisciplinary collaboration and enjoy working at the intersection of mechanical engineering, 
                computer science, and control systems. My goal is to contribute to the development of next-generation robotic technologies 
                that can make a meaningful impact on society.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 text-[#374151] dark:text-[#e5e7eb]">Research Interests</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Robotic system design and control</li>
                <li>Mechatronics and embedded systems</li>
                <li>Mechanical design and prototyping</li>
                <li>Autonomous navigation and planning</li>
                <li>Human-robot interaction</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mb-4 text-[#374151] dark:text-[#e5e7eb]">Education</h2>
              <div className="mb-6">
                <p className="font-semibold text-[#374151] dark:text-[#e5e7eb]">Massachusetts Institute of Technology</p>
                <p className="text-[#64748b]">M.S. in Mechanical Engineering (In Progress)</p>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4 text-[#374151] dark:text-[#e5e7eb]">Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-[#374151] dark:text-[#e5e7eb] mb-2">Technical Skills</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>CAD (SolidWorks, Fusion 360)</li>
                    <li>Programming (Python, C++, MATLAB)</li>
                    <li>Control Systems</li>
                    <li>3D Printing & Prototyping</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-[#374151] dark:text-[#e5e7eb] mb-2">Research Methods</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Experimental Design</li>
                    <li>Data Analysis</li>
                    <li>System Integration</li>
                    <li>Technical Writing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 