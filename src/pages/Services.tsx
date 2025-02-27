import React from 'react';
import { Code, Cloud, Server, Database, Archive, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: <Code className="h-12 w-12 text-orangered" />,
      title: "Custom Development",
      description: "Professional web design services including WordPress development, custom HTML pages, and modern web applications tailored to your needs."
    },
    {
      icon: <Cloud className="h-12 w-12 text-orangered" />,
      title: "Cloud Hosting",
      description: "Reliable cloud hosting solutions with high performance, scalability, and 99.9% uptime guarantee."
    },
    {
      icon: <Server className="h-12 w-12 text-orangered" />,
      title: "VPS Hosting",
      description: "Powerful Virtual Private Servers with full root access, dedicated resources, and superior performance."
    },
    {
      icon: <Database className="h-12 w-12 text-orangered" />,
      title: "DNS Management",
      description: "Professional DNS management services with advanced features, including DNS zones, records, and propagation monitoring."
    },
    {
      icon: <Archive className="h-12 w-12 text-orangered" />,
      title: "Incremental Backup",
      description: "Secure incremental backup solutions ensuring your data is always protected and easily recoverable."
    },
    {
      icon: <Sparkles className="h-12 w-12 text-orangered" />,
      title: "Custom Solutions",
      description: "Tailored hosting and development solutions designed to meet your unique business requirements and challenges."
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Our <span className="text-orangered">Services</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive technology solutions tailored to your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl hover:transform hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-gray-800"
            >
              <div className="bg-gray-800/50 rounded-full w-20 h-20 flex items-center justify-center mb-6 mx-auto shadow-lg">
                {service.icon}
              </div>
              <h3 className="text-2xl font-semibold text-white text-center mb-4">
                {service.title}
              </h3>
              <p className="text-gray-400 text-center">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-orangered to-red-600 rounded-2xl p-8 text-center shadow-[0_0_20px_rgba(255,69,0,0.3)]">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Contact us to discuss your specific requirements and let us create the perfect solution for your business
          </p>
          <Link 
            to="/contact"
            className="bg-white text-orangered px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block shadow-lg"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;