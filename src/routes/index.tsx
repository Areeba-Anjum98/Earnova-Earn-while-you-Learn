import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/config";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { JobListings } from "@/components/JobListings";
import { HowItWorks } from "@/components/HowItWorks";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Earnova — Pakistan's Student Job Marketplace" },
      {
        name: "description",
        content:
          "Connect students with local employers for hourly jobs. Time tracking, instant payments, and ratings system. Join Pakistan's growing student workforce.",
      },
      { property: "og:title", content: "Earnova — Pakistan's Student Job Marketplace" },
      {
        property: "og:description",
        content:
          "Pakistan's first student job platform. Hourly gigs, location-based matching, secure payments in Rupees.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const res = await fetch(`${API_BASE}/jobs`);
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredJobs = normalizedQuery
    ? jobs.filter((job: any) => {
        const text = `${job.title || ""} ${job.company || ""} ${job.tag || ""} ${job.type || ""} ${job.location || ""}`.toLowerCase();
        return text.includes(normalizedQuery);
      })
    : jobs;

  const searchResults = normalizedQuery ? filteredJobs.slice(0, 4) : [];

  const handleSearch = () => {
    document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSearchResultClick = (jobTitle: string) => {
    setSearchQuery(jobTitle);
    document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
          searchResults={searchResults}
          onSearchResultClick={handleSearchResultClick}
        />
        <Features />
        <JobListings jobs={filteredJobs} loading={loadingJobs} />
        <HowItWorks />
        <DashboardPreview />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
