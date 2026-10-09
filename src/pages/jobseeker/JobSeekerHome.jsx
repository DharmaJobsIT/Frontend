import { useEffect, useState } from "react";

import API from "../../api/axios";

import HeroSection from "./components/HeroSection";
import QuickActions from "./components/QuickActions";
import SearchSection from "./components/SearchSection";
import RecommendedJobs from "./components/RecommendedJobs";

export default function JobSeekerHome() {
  const [homeData, setHomeData] = useState({
    recommended: {
      jobs: [],
      count: 0,
    },

    latest: {
      jobs: [],
      count: 0,
    },

    boosted: {
      jobs: [],
      count: 0,
    },
  });

  const [loading, setLoading] = useState(true);

  const getHomeJobs = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/jobs/home");

      console.log("Home jobs response:", data);

      setHomeData((prev) => ({
        ...prev,

        latest: {
          ...prev.latest,
          ...(data?.latest || {}),
        },

        boosted: {
          ...prev.boosted,
          ...(data?.boosted || {}),
        },

        recommended: {
          ...prev.recommended,
          ...(data?.recommended || {}),
        },
      }));
    } catch (err) {
      console.error("Failed to fetch home jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHomeJobs();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950">

      <HeroSection />

      <QuickActions />

      {/* <SearchSection /> */}

      <RecommendedJobs
        loading={loading}
        jobs={homeData?.recommended?.jobs || []}
        total={homeData?.recommended?.count || 0}
      />

    </main>
  );
}