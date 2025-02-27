import { LifeBuoy, MessageCircle, FileQuestion, Phone } from 'lucide-react';

const Support = () => {
  const supportOptions = [
    {
      icon: <LifeBuoy className="h-12 w-12 text-orangered" />,
      title: "Help Center",
      description: "Browse through our comprehensive knowledge base",
      link: "#"
    },
    {
      icon: <MessageCircle className="h-12 w-12 text-orangered" />,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      link: "#"
    },
    {
      icon: <FileQuestion className="h-12 w-12 text-orangered" />,
      title: "FAQs",
      description: "Find answers to common questions",
      link: "#"
    },
    {
      icon: <Phone className="h-12 w-12 text-orangered" />,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      link: "#"
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Technical <span className="text-orangered">Support</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get the help you need, when you need it
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {supportOptions.map((option, index) => (
            <a
              key={index}
              href={option.link}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center space-x-6">
                <div className="bg-gray-800/50 rounded-full w-20 h-20 flex items-center justify-center flex-shrink-0">
                  {option.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-400">
                    {option.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Emergency Support?
          </h2>
          <p className="text-white/90 mb-8">
            Our premium support team is available 24/7 for urgent assistance
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contact Emergency Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Support;