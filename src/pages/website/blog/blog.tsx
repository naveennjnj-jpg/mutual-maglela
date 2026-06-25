import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, ArrowRight } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
}

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    "Higher Education",
    "Impact Communication",
    "Leadership",
    "Science Communication",
    "Strategy",
    "Legal & Compliance",
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Why African Universities Need Strategic Communication Partners",
      excerpt:
        "The unique challenges facing African higher education institutions require communication approaches grounded in local context.",
      category: "Higher Education",
      date: "Feb 20, 2026",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1648301033733-44554c74ec50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
      slug: "why-african-universities-need-strategic-communication-partners",
    },
    {
      id: 2,
      title: "Beyond Greenwashing: Authentic Impact Storytelling",
      excerpt:
        "How to communicate social impact with credibility and avoid performative sustainability narratives.",
      category: "Impact Communication",
      date: "Feb 15, 2026",
      readTime: "7 min read",
      image:
        "https://images.unsplash.com/photo-1652265540589-46f91535337b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
      slug: "beyond-greenwashing-authentic-impact-storytelling",
    },
    {
      id: 3,
      title: "The Art of Executive Speechwriting: Structure and Substance",
      excerpt:
        "What makes a Vice-Chancellor's address memorable? Breaking down the elements of effective executive communication.",
      category: "Leadership",
      date: "Feb 10, 2026",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1763739528307-ad10867048b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
      slug: "the-art-of-executive-speechwriting-structure-and-substance",
    },
    {
      id: 4,
      title: "Translating Research for Policy Impact",
      excerpt:
        "Scientists spend years on groundbreaking research. Here's how to ensure policymakers actually read and act on it.",
      category: "Science Communication",
      date: "Feb 5, 2026",
      readTime: "8 min read",
      image:
        "https://images.unsplash.com/photo-1737160397143-77c6845daf99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
      slug: "translating-research-for-policy-impact",
    },
    {
      id: 5,
      title: "Building Internal Communications Capacity",
      excerpt:
        "Strategic considerations for university communications offices weighing in-house expansion versus external partnerships.",
      category: "Strategy",
      date: "Jan 28, 2026",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1758876022295-00ec1f0e39f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
      slug: "building-internal-communications-capacity",
    },
    {
      id: 6,
      title: "IP Protection in Academic Communications",
      excerpt:
        "Understanding confidentiality, NDAs, and intellectual property when working with external communication partners.",
      category: "Legal & Compliance",
      date: "Jan 20, 2026",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1648301033733-44554c74ec50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
      slug: "ip-protection-in-academic-communications",
    },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[560px] overflow-hidden -mt-20">
        <img
          src="https://images.unsplash.com/photo-1638342863994-ae4eee256688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80"
          alt="Insights"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1C]/92 via-[#1C1C1C]/75 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/50 via-transparent to-transparent"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(at 20% 65%, rgb(200, 90, 50) 0%, transparent 55%)",
          }}
        ></div>

        <div className="relative h-full max-w-[1500px] mx-auto px-6 lg:px-8 flex flex-col justify-end pb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#C85A32]/25 border border-[#C85A32]/40 text-[#C85A32] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              Expert Insights
            </div>
            <h1 className="text-3xl md:text-[40px] font-['Roboto'] text-white mb-4 leading-[1.2]">
              Insights on Strategic Communication
            </h1>
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-7 max-w-xl">
              Practical guidance, industry trends, and thought leadership on
              institutional communication.
            </p>
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 h-12 bg-white rounded-xl border-0 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Listing Section */}
      <section className="py-16 lg:py-20 bg-[#F9F7F4]">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
            <div>
              <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-2">
                All Insights
              </p>
              <h2 className="text-2xl lg:text-3xl font-['Roboto'] text-[#0F2D63]">
                {filteredPosts.length} articles found
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-[#C85A32] text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#C85A32] hover:text-[#C85A32]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#C85A32] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                      <span>·</span>
                      {post.readTime}
                    </div>
                    <h3 className="font-semibold text-[#1C1C1C] text-[15px] leading-snug mb-2 group-hover:text-[#C85A32] transition-colors line-clamp-2 flex-1">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[#C85A32] font-semibold text-xs group-hover:gap-2 transition-all">
                      Read
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;