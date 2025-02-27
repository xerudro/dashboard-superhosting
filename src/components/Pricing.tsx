import React from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "29",
      features: [
        "1 Website",
        "10GB Storage",
        "Free SSL Certificate",
        "24/7 Support",
        "Basic Analytics"
      ]
    },
    {
      name: "Professional",
      price: "79",
      popular: true,
      features: [
        "5 Websites",
        "50GB Storage",
        "Free SSL Certificate",
        "24/7 Priority Support",
        "Advanced Analytics",
        "Custom Domain"
      ]
    },
    {
      name: "Enterprise",
      price: "199",
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
    <div className="bg-gradient-to-b from-black to-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Choose Your <span className="text-orangered">Plan</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select the perfect plan for your needs with our flexible pricing options
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-gray-900 rounded-2xl p-8 ${
                plan.popular ? 'border-2 border-orangered transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-orangered text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                  Popular
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">{plan.name}</h3>
                <div className="flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">$</span>
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-orangered mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg font-medium transition-colors ${
                plan.popular
                  ? 'bg-orangered hover:bg-red-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;