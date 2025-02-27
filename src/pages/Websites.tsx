import React from 'react';

const Websites = () => {
  const portfolio = [
    {
      title: "E-Commerce Platform",
      image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800",
      category: "Web Application"
    },
    {
      title: "Corporate Website",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
      category: "Business"
    },
    {
      title: "Mobile App Interface",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=800",
      category: "UI/UX Design"
    },
    {
      title: "News Portal",
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
      category: "Web Development"
    },
    {
      title: "Analytics Dashboard",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      category: "Data Visualization"
    },
    {
      title: "Social Platform",
      image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=800",
      category: "Web Application"
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Web <span className="text-orangered">Design</span> Portfolio
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Showcasing our latest web design projects and digital experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolio.map((project, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl hover:transform hover:scale-105 transition-all duration-300"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-6">
                <span className="text-orangered text-sm font-medium mb-2">
                  {project.category}
                </span>
                <h3 className="text-xl font-semibold text-white">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Websites;