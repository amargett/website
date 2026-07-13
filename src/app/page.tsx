import { client } from "../sanity/lib/client";
import Link from "next/link";
import TerminalHero from "../components/TerminalHero";
import CircuitVines from "../components/CircuitVines";
import FeaturedMasonry from "../components/FeaturedMasonry";
import FeaturedOrchard from "../components/FeaturedOrchard";

export const dynamic = "force-dynamic";

const featuredProjectsQuery = `*[_type == "project" && featured == true]|order(featuredOrder asc, title asc){
  _id,
  title,
  slug,
  shortDescription,
  mainMedia,
  category,
  technicalSkills,
  featuredLayout,
  year,
  institution,
  publication,
  courseCode,
  role,
  organization
}`;

function HeroSection() {
  return (
    <header className="relative overflow-hidden px-4 sm:px-6 pt-8 pb-10 sm:pt-12 sm:pb-14 min-h-[60vh] sm:min-h-[66vh]">
      <div className="tg-content max-w-5xl mx-auto">
        <TerminalHero />
        <div className="mt-8 flex flex-col items-start gap-2 text-sm">
          <Link
            href="/projects"
            className="text-[var(--tg-green)] hover:text-[var(--tg-amber)] transition-colors"
          >
            → cd ~/projects
          </Link>
          <Link
            href="/about"
            className="text-[var(--tg-green)] hover:text-[var(--tg-amber)] transition-colors"
          >
            → cat ~/about.md
          </Link>
        </div>
      </div>
    </header>
  );
}

function FeaturedGrid({ projects }: { projects: any[] }) {
  return (
    <main className="tg-content relative px-4 sm:px-6 pb-28">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline gap-3 mb-8 border-b border-[var(--tg-border)] pb-4">
          <h2 className="text-[var(--tg-fg)] text-base sm:text-lg font-semibold">
            <span className="text-[var(--tg-green)]">❯</span> featured work
          </h2>
          <span className="text-[var(--tg-dim)] text-xs sm:text-sm">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        </div>

      </div>

      {projects.length === 0 ? (
        <p className="max-w-6xl mx-auto text-[var(--tg-dim)] text-sm">// no featured projects yet.</p>
      ) : (
        <>
          {/* desktop: fruit-cards hang on the tree — full width so they meet the canopy */}
          <div className="hidden lg:block">
            <FeaturedOrchard projects={projects} />
          </div>
          {/* touch / small screens: the tidy grid (no hover there) */}
          <div className="lg:hidden max-w-6xl mx-auto">
            <FeaturedMasonry projects={projects} />
          </div>
        </>
      )}
    </main>
  );
}

export default async function Home() {
  let featuredProjects: any[] = [];
  let fetchFailed = false;

  try {
    featuredProjects = await client.fetch(featuredProjectsQuery);
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    fetchFailed = true;
  }

  return (
    <div className="terminal-garden">
      <CircuitVines />
      <HeroSection />
      {fetchFailed ? (
        <main className="tg-content px-4 sm:px-6 pb-28 max-w-6xl mx-auto">
          <p className="text-[var(--tg-amber)] text-sm">featured work</p>
          <p className="text-[var(--tg-dim)] text-sm mt-2">
            // content is loading… if this persists, check the Sanity configuration.
          </p>
        </main>
      ) : (
        <FeaturedGrid projects={featuredProjects} />
      )}
      {/* open ground at the foot of the page where the last leaves settle */}
      <div aria-hidden className="h-[42vh]" />
    </div>
  );
}
