import { FaHeart } from "react-icons/fa";
import { Sparkles, ClipboardList, Briefcase } from "lucide-react";

import SectionTitle from "./ui/SectionTitle";
import ActionCard from "./ActionCard";

export default function QuickActions() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <SectionTitle
        title="Quick Actions"
        subtitle="Everything you need to manage your career in one place."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Generate Resume */}
        <ActionCard
          icon={<Sparkles size={28} />}
          title="Generate Resume"
          description="Coming Soon"
          disabled
          color="emerald"
          to="/jobseeker/profile"
        />

        {/* Saved Jobs */}
        <ActionCard
          icon={<FaHeart />}
          title="Saved Jobs"
          description="Quickly access jobs you've bookmarked for later."
          color="rose"
          to="/jobseeker/saved"
        />

        {/* Applications */}
        <ActionCard
          icon={<ClipboardList size={28} />}
          title="Applications"
          description="Track every application and stay updated on its status."
          color="amber"
          to="/jobseeker/applications"
        />

        {/* All Jobs */}
        <ActionCard
          icon={<Briefcase size={28} />}
          title="All Jobs"
          description="Explore all available teaching and non-teaching opportunities."
          color="blue"
          to="/jobs"
        />
      </div>
    </section>
  );
}
