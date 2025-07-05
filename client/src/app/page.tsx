'use client';
import { SearchForm } from "@/components/search/Search.Form"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Shield, Clock, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const handleSearch = (searchParams: any) => {
    console.log("Search params:", searchParams);
    router.push("/search");
  };

  const features = [
    {
      icon: <Plane className="h-8 w-8 text-blue-600" />,
      title: "Easy Booking",
      description: "Search and book flights in just a few clicks with our intuitive interface."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Secure Payments",
      description: "Your payment information is protected with industry-standard encryption."
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "24/7 Support",
      description: "Get help anytime with our round-the-clock customer support team."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Group Booking",
      description: "Special rates and services for group bookings and corporate travel."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Perfect Flight
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Search, compare, and book flights to destinations worldwide with the best prices guaranteed.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <SearchForm onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose FlightBook?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make flight booking simple, secure, and affordable for travelers worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Book Your Next Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of travelers who trust FlightBook for their flight booking needs.
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => router.push("/search")}
            >
              Search Flights
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
