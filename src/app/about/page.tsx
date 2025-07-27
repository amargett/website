import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="full-page-gradient">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="cosmic-card rounded-xl p-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-[#374151] dark:text-[#e5e7eb]">
            About Me
          </h1>
          
          <div className="space-y-6 text-[#374151] dark:text-[#e5e7eb]">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#475569]">Background</h2>
              <p className="text-[#64748b] leading-relaxed">
                I am a Mechanical Engineering graduate student at MIT, passionate about mechanical design, 
                mechatronics, and robotic systems. My research focuses on developing innovative solutions 
                that bridge the gap between theoretical engineering and practical applications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#475569]">Research Interests</h2>
              <ul className="list-disc list-inside space-y-2 text-[#64748b]">
                <li>Robotic systems and automation</li>
                <li>Mechatronics and control systems</li>
                <li>Mechanical design and prototyping</li>
                <li>Human-robot interaction</li>
                <li>Sustainable engineering solutions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#475569]">Education</h2>
              <div className="space-y-3 text-[#64748b]">
                <div>
                  <h3 className="font-medium text-[#374151] dark:text-[#e5e7eb]">Massachusetts Institute of Technology</h3>
                  <p>M.S. in Mechanical Engineering</p>
                  <p className="text-sm text-[#64748b]">2023 - Present</p>
                </div>
                <div>
                  <h3 className="font-medium text-[#374151] dark:text-[#e5e7eb]">Previous Institution</h3>
                  <p>B.S. in Mechanical Engineering</p>
                  <p className="text-sm text-[#64748b]">2019 - 2023</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#475569]">Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#64748b]">
                <div>
                  <h3 className="font-medium text-[#374151] dark:text-[#e5e7eb] mb-2">Technical Skills</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>CAD Design (SolidWorks, Fusion 360)</li>
                    <li>3D Printing & Rapid Prototyping</li>
                    <li>Programming (Python, MATLAB, C++)</li>
                    <li>Control Systems & Robotics</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-[#374151] dark:text-[#e5e7eb] mb-2">Research Methods</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Experimental Design</li>
                    <li>Data Analysis & Visualization</li>
                    <li>Technical Writing</li>
                    <li>Project Management</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#475569]">Contact</h2>
              <p className="text-[#64748b]">
                I'm always interested in discussing research opportunities, collaborations, or just 
                connecting with fellow engineers and researchers. Feel free to reach out!
              </p>
              <div className="mt-4 space-y-2 text-[#64748b]">
                <p><span className="font-medium text-[#374151] dark:text-[#e5e7eb]">Email:</span> [Your Email]</p>
                <p><span className="font-medium text-[#374151] dark:text-[#e5e7eb]">LinkedIn:</span> [Your LinkedIn]</p>
                <p><span className="font-medium text-[#374151] dark:text-[#e5e7eb]">GitHub:</span> [Your GitHub]</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
} 