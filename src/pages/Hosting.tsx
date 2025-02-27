import React from 'react';
import { Server, Gauge, Shield, Clock, Box, PenTool as Tool } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import CardGrid from '../components/CardGrid';
import CurrencyConverter from '../components/CurrencyConverter';

const Hosting = () => {
  const features = [
    {
      icon: <Box className="h-12 w-12 text-orangered" />,
      title: "Containerised Websites",
      description: "Isolated container environment for enhanced security and performance"
    },
    {
      icon: <Server className="h-12 w-12 text-orangered" />,
      title: "SSD Storage",
      description: "Lightning-fast SSD storage for optimal performance"
    },
    {
      icon: <Gauge className="h-12 w-12 text-orangered" />,
      title: "99.9% Uptime",
      description: "Guaranteed uptime with redundant infrastructure"
    },
    {
      icon: <Tool className="h-12 w-12 text-orangered" />,
      title: "Wordpress Toolkit Included",
      description: "Complete toolkit for managing WordPress installations"
    },
    {
      icon: <Shield className="h-12 w-12 text-orangered" />,
      title: "DDoS Protection",
      description: "Advanced protection against DDoS attacks"
    },
    {
      icon: <Clock className="h-12 w-12 text-orangered" />,
      title: "24/7 Support",
      description: "Round-the-clock technical support"
    }
  ];

  const hostingPlans = [
    {
      title: "Stellar Start",
      price: { currency: "€", amount: "5", period: "mo" },
      features: [
        "⚡ Unmanaged Hosting",
        "10 GB SSD Storage",
        "10 mailboxes (100 MB each)",
        "1 live & 1 staging website",
        "Unlimited Bandwidth",
        "Unlimited Page Views",
        "Unlimited Subdomains",
        "CPGuard Protection",
        "Basic Support"
      ],
      actionLabel: "Order Now"
    },
    {
      title: "Stellar Standard",
      price: { currency: "€", amount: "7", period: "mo" },
      features: [
        "⚡ Unmanaged Hosting",
        "30 GB SSD Storage",
        "30 mailboxes (200 MB/each)",
        "2 Websites & 2 Staging Sites",
        "Unlimited Bandwidth",
        "Unlimited Page Views",
        "Unlimited Subdomains",
        "CPGuard Protection",
        "Basic Support"
      ],
      popular: true,
      actionLabel: "Order Now"
    },
    {
      title: "Stellar Advanced",
      price: { currency: "€", amount: "10", period: "mo" },
      features: [
        "⚡ Unmanaged Hosting",
        "50 GB SSD Storage",
        "50 mailboxes (200 MB/each)",
        "3 Websites & 3 Staging Sites",
        "Unlimited Bandwidth",
        "Unlimited Page Views",
        "Unlimited Subdomains",
        "CPGuard Protection",
        "Basic Support"
      ],
      actionLabel: "Order Now"
    }
  ];

  const managedHostingPlans = [
    {
      title: "Nebula Core",
      price: { currency: "€", amount: "15", period: "mo" },
      features: [
        "🚀 Managed Hosting",
        "10 GB SSD Storage",
        "10 mailboxes (100 MB each)",
        "1 live & 1 staging website",
        "Unlimited Bandwidth",
        "Unlimited Page Views",
        "Unlimited Subdomains",
        "CPGuard Protection",
        "Basic Support"
      ],
      actionLabel: "Order Now"
    },
    {
      title: "Nebula Boost",
      price: { currency: "€", amount: "30", period: "mo" },
      features: [
        "🚀 Managed Hosting",
        "30 GB SSD Storage",
        "30 mailboxes (200 MB/each)",
        "2 Websites & 2 Staging Sites",
        "Unlimited Bandwidth",
        "Unlimited Page Views",
        "Unlimited Subdomains",
        "CPGuard Protection",
        "Basic Support"
      ],
      popular: true,
      actionLabel: "Order Now"
    },
    {
      title: "Nebula Ultra",
      price: { currency: "€", amount: "50", period: "mo" },
      features: [
        "🚀 Managed Hosting",
        "50 GB SSD Storage",
        "50 mailboxes (200 MB/each)",
        "3 Websites & 3 Staging Sites",
        "Unlimited Bandwidth",
        "Unlimited Page Views",
        "Unlimited Subdomains",
        "CPGuard Protection",
        "Basic Support"
      ],
      actionLabel: "Order Now"
    }
  ];

  const vpsPlans = [
    {
      title: "Turbo VPS",
      price: { currency: "€", amount: "6", period: "mo" },
      features: [
        "2 CPU Cores (Intel)",
        "4 GB RAM",
        "40 GB NVMe SSD",
        "20 TB Traffic",
        "Linux or Windows",
        "DDoS Protection",
        "Backup available (+€1.20/mo)",
        "Full Root Access",
        "24/7 Support"
      ],
      actionLabel: "Order Now"
    },
    {
      title: "Nitro VPS",
      price: { currency: "€", amount: "18", period: "mo" },
      features: [
        "4 CPU Cores (AMD)",
        "8 GB RAM",
        "160 GB NVMe SSD",
        "20 TB Traffic",
        "Linux or Windows",
        "DDoS Protection",
        "Backup available (+€3.60/mo)",
        "Full Root Access",
        "24/7 Priority Support"
      ],
      popular: true,
      actionLabel: "Order Now"
    },
    {
      title: "Hyper VPS",
      price: { currency: "€", amount: "43", period: "mo" },
      features: [
        "8 CPU Cores (Intel)",
        "32 GB RAM",
        "320 GB NVMe SSD",
        "20 TB Traffic",
        "Linux or Windows",
        "DDoS Protection",
        "Backup available (+€8.60/mo)",
        "Full Root Access",
        "24/7 Premium Support"
      ],
      actionLabel: "Order Now"
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Premium <span className="text-orangered">Hosting</span> Solutions
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Enterprise-grade hosting infrastructure for your applications
          </p>
        </div>

        <div className="mb-16">
          <CurrencyConverter />
        </div>

        <CardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
          {features.map((feature, index) => (
            <Card
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </CardGrid>

        <div className="mt-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Shared Hosting <span className="text-orangered">Plans</span>
          </h2>
          <CardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
            {hostingPlans.map((plan, index) => (
              <Card
                key={index}
                {...plan}
                variant="pricing"
                actionLabel="Order Now"
              />
            ))}
          </CardGrid>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Managed Hosting <span className="text-orangered">Plans</span>
          </h2>
          <CardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
            {managedHostingPlans.map((plan, index) => (
              <Card
                key={index}
                {...plan}
                variant="pricing"
                actionLabel="Order Now"
              />
            ))}
          </CardGrid>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            VPS <span className="text-orangered">Solutions</span>
          </h2>
          <CardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
            {vpsPlans.map((plan, index) => (
              <Card
                key={index}
                {...plan}
                variant="pricing"
                actionLabel="Order Now"
              />
            ))}
          </CardGrid>
        </div>

        <div className="mt-24 bg-gradient-to-r from-orangered to-red-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Choose the perfect hosting plan for your needs and experience the difference of premium infrastructure.
          </p>
          <Link 
            to="/signup"
            className="inline-block bg-white text-orangered px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hosting;