'use client'

import { MoveRight, ShoppingBag, Star, Sparkles, TrendingUp, Mountain, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStats, setCurrentStats] = useState({ sellers: 0, customers: 0 })
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
    // Animate stats
    const interval = setInterval(() => {
      setCurrentStats(prev => ({
        sellers: prev.sellers < 500 ? prev.sellers + 10 : 500,
        customers: prev.customers < 10000 ? prev.customers + 200 : 10000
      }))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-[85vh] overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
      {/* Animated Background Pattern - Himalayan Mountains */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 2px, transparent 0)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Floating Orbs - Representing Phewa Lake and Mountains */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Mountain Silhouette Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-950/50 to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 h-full min-h-[85vh] flex items-center">
        <div className={`grid md:grid-cols-2 gap-12 items-center w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Left Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm animate-bounce">
              <Mountain className="w-4 h-4 text-cyan-300" />
              <span>From the Heart of the Himalayas 🇳🇵</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
              Discover
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Pokhara's
              </span>
              <span className="block">Marketplace</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-blue-100 max-w-xl">
              Experience the beauty of shopping with a platform inspired by the serenity of
              <span className="font-semibold text-cyan-300"> Phewa Lake</span> and the majesty of the
              <span className="font-semibold text-purple-300"> Annapurna Range</span>
            </p>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {currentStats.sellers}+
                </div>
                <div className="text-sm text-blue-200">Local Sellers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {currentStats.customers.toLocaleString()}+
                </div>
                <div className="text-sm text-blue-200">Happy Customers</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => router.push('/products')}
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Start Shopping</span>
                <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push('/shops')}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                <Star className="w-5 h-5 text-yellow-300" />
                <span>Explore Shops</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-6 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span>Best Prices</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-300" />
                <span>Made with Love</span>
              </div>
            </div>
          </div>

          {/* Right Content - Decorative Elements */}
          <div className="relative hidden md:block">
            {/* Floating Cards */}
            <div className="relative h-[500px]">
              {/* Card 1 - Featured Product */}
              <div className="absolute top-0 right-0 w-72 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300 animate-float">
                <div className="w-full h-40 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl mb-4 flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Featured Products</h3>
                <p className="text-sm text-gray-600">Discover unique items from local artisans</p>
                <div className="flex items-center gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              {/* Card 2 - Special Offer */}
              <div className="absolute bottom-0 left-0 w-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl p-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="text-white">
                  <div className="text-4xl font-bold mb-2">30% OFF</div>
                  <p className="text-sm opacity-90 mb-4">Special Dashain Offer</p>
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-center font-semibold">
                    Limited Time
                  </div>
                </div>
              </div>

              {/* Decorative Mountain Icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
                <Mountain className="w-64 h-64 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(3deg); }
                    50% { transform: translateY(-20px) rotate(3deg); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
    </div>
  )
}

export default Hero
