import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const scrollToSearch = () => {
    // Smooth scroll to the search section
    window.scrollTo({
      top: 400,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative bg-primary-900 text-white">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(https://images.pexels.com/photos/69866/pexels-photo-69866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
          filter: 'brightness(0.4)'
        }}
      ></div>
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Travel with Comfort and Convenience
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Book your bus tickets online and enjoy a seamless journey with our premium bus services connecting major cities nationwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToSearch}
              className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-md font-medium flex items-center justify-center transition-colors"
            >
              Book Your Trip
              <ArrowRight size={20} className="ml-2" />
            </button>
            <button className="bg-transparent border border-white hover:bg-white/10 text-white px-6 py-3 rounded-md font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      {/* Wave effect at the bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-20 transform translate-y-1">
          <path 
            fill="#f9fafb" 
            fillOpacity="1" 
            d="M0,32L80,37.3C160,43,320,53,480,58.7C640,64,800,64,960,58.7C1120,53,1280,43,1360,37.3L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;