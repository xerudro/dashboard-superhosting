import React from 'react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import CardGrid from '../components/CardGrid';
import { Server, Globe, Code, Shield, Cpu, Cloud, Database, Lock } from 'lucide-react';

const Home = () => {
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
    },
    {
      icon: <Cpu className="h-8 w-8 text-orangered" />,
      title: "Scalable Infrastructure",
      description: "Grow your applications with our flexible and scalable infrastructure."
    },
    {
      icon: <Cloud className="h-8 w-8 text-orangered" />,
      title: "Cloud Solutions",
      description: "Leverage the power of cloud computing with our managed services."
    },
    {
      icon: <Database className="h-8 w-8 text-orangered" />,
      title: "Database Management",
      description: "Reliable and secure database solutions for your business needs."
    },
    {
      icon: <Lock className="h-8 w-8 text-orangered" />,
      title: "SSL Security",
      description: "Keep your data safe with industry-standard SSL encryption."
    }
  ];

  const plans = [
    {
      title: "Starter",
      price: { currency: "$", amount: "29", period: "mo" },
      features: [
        "1 Website",
        "10GB Storage",
        "Free SSL Certificate",
        "24/7 Support",
        "Basic Analytics"
      ]
    },
    {
      title: "Professional",
      price: { currency: "$", amount: "79", period: "mo" },
      features: [
        "5 Websites",
        "50GB Storage",
        "Free SSL Certificate",
        "24/7 Priority Support",
        "Advanced Analytics",
        "Custom Domain"
      ],
      popular: true
    },
    {
      title: "Enterprise",
      price: { currency: "$", amount: "199", period: "mo" },
      features: [
        "Unlimited Websites",
        "500GB Storage",
        "Free SSL Certificate",
        "24/7 VIP Support",
        "Advanced Analytics",
        "Custom Domain",
        "White Label Solutions"
      ]
    }
  ];

  return (
    <main>
      <Hero />
      
      <section className="bg-black py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-orangered">Us</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience the perfect blend of innovation, performance, and reliability
            </p>
          </div>

          <CardGrid columns={{ sm: 1, md: 2, lg: 4 }}>
            {features.map((feature, index) => (
              <Card
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </CardGrid>
        </div>
      </section>

      <section className="bg-gradient-to-b from-black to-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Choose Your <span className="text-orangered">Plan</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Select the perfect plan for your needs with our flexible pricing options
            </p>
          </div>

          <CardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
            {plans.map((plan, index) => (
              <Card
                key={index}
                {...plan}
                variant="pricing"
                actionLabel="Get Started"
              />
            ))}
          </CardGrid>
        </div>
      </section>
    </main>
  );
};

export default Home;