import React from 'react';
import { Server, Globe, Code, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Server className="h-8 w-8 text-orangered" />,
      title: "High-Performance Hosting",
      description: "Lightning-fast servers with 99.9% uptime guarantee for optimal performance."
    },
    {
      icon: <Globe className="h-8 w-8 text-orangered" />,
      title: "Global CDN",
      description: "Content delivery network ensuring fast access from anywhere in the world."
    },
    {
      icon: <Code className="h-8 w-8 text-orangered" />,
      title: "Custom Development",
      description: "Tailored solutions built with cutting-edge technologies for your specific needs."
    },
    {
      icon: <Shield className="h-8 w-8 text-orangered" />,
      title: "Advanced Security",
      description: "Enterprise-grade security measures to protect your digital assets."
    }
  ];

  return (
    <div className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Choose <span className="text-orangered">Us</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the perfect blend of innovation, performance, and reliability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;