import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[#2d3748] dark:text-white">About Me</h1>
        <p className="text-base sm:text-lg text-[#4a7c59] dark:text-[#68d391]">Get to know me better</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#2d3748] dark:text-white">Background</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              I'm a Mechanical Engineering Graduate Student at MIT, passionate about robotics, research, and design. 
              My work spans across multiple domains including industry experience, academic coursework, and research activities.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#2d3748] dark:text-white">Research Interests</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              My research focuses on robotics and mechanical systems, with particular interest in control systems, 
              design optimization, and innovative engineering solutions.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#2d3748] dark:text-white">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#4a7c59] dark:bg-[#68d391] text-white dark:text-gray-900 rounded-full text-sm">Robotics</span>
              <span className="px-3 py-1 bg-[#4a7c59] dark:bg-[#68d391] text-white dark:text-gray-900 rounded-full text-sm">Mechanical Design</span>
              <span className="px-3 py-1 bg-[#4a7c59] dark:bg-[#68d391] text-white dark:text-gray-900 rounded-full text-sm">Control Systems</span>
              <span className="px-3 py-1 bg-[#4a7c59] dark:bg-[#68d391] text-white dark:text-gray-900 rounded-full text-sm">Research</span>
              <span className="px-3 py-1 bg-[#4a7c59] dark:bg-[#68d391] text-white dark:text-gray-900 rounded-full text-sm">CAD</span>
              <span className="px-3 py-1 bg-[#4a7c59] dark:bg-[#68d391] text-white dark:text-gray-900 rounded-full text-sm">Prototyping</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-[#2d3748] dark:text-white">Education</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-[#4a7c59] dark:text-[#68d391]">MIT</p>
                <p className="text-gray-600 dark:text-gray-300">Mechanical Engineering, Graduate Student</p>
                <p className="text-sm text-[#d2691e] dark:text-[#e67e22]">Present</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-[#2d3748] dark:text-white">Contact</h3>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium text-[#4a7c59] dark:text-[#68d391]">Email:</span> 
                <a href="mailto:your.email@mit.edu" className="text-[#d2691e] dark:text-[#e67e22] hover:underline ml-2">
                  your.email@mit.edu
                </a>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium text-[#4a7c59] dark:text-[#68d391]">Location:</span> 
                <span className="ml-2">Cambridge, MA</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 