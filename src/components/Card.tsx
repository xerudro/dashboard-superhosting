import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  features?: string[];
  price?: {
    amount: string;
    currency: string;
    period: string;
  };
  image?: string;
  category?: string;
  popular?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'feature' | 'pricing' | 'portfolio' | 'hosting';
}

const Card: React.FC<CardProps> = ({
  icon,
  title,
  description,
  features,
  price,
  image,
  category,
  popular,
  actionLabel = "Learn More",
  onAction,
  variant = 'feature'
}) => {
  if (variant === 'portfolio') {
    return (
      <div className="group relative overflow-hidden rounded-xl hover:transform hover:scale-105 transition-all duration-300">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-6">
          <span className="text-orangered text-sm font-medium mb-2">
            {category}
          </span>
          <h3 className="text-xl font-semibold text-white">
            {title}
          </h3>
        </div>
      </div>
    );
  }

  if (variant === 'pricing' || variant === 'hosting') {
    return (
      <div className={`relative bg-gray-900 rounded-2xl p-8 ${
        popular ? 'border-2 border-orangered transform scale-105' : ''
      }`}>
        {popular && (
          <div className="absolute top-0 right-0 bg-orangered text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
            Popular
          </div>
        )}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
          {price && (
            <div className="flex items-center justify-center">
              <span className="text-gray-400 text-2xl">{price.currency}</span>
              <span className="text-4xl font-bold text-white">{price.amount}</span>
              <span className="text-gray-400 ml-2">/{price.period}</span>
            </div>
          )}
        </div>
        {features && (
          <ul className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-300">
                <span className="h-2 w-2 bg-orangered rounded-full mr-2" />
                {feature}
              </li>
            ))}
          </ul>
        )}
        <Link 
          to="/signup"
          className={`w-full py-3 rounded-lg font-medium transition-colors block text-center ${
            popular
              ? 'bg-orangered hover:bg-red-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Order Now
        </Link>
      </div>
    );
  }

  // Default feature card
  return (
    <div className="bg-gray-900 p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
      {icon && (
        <div className="bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-white text-center mb-2">
        {title}
      </h3>
      <p className="text-gray-400 text-center">
        {description}
      </p>
    </div>
  );
};

export default Card;