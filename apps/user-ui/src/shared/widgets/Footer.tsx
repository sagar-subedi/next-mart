'use client';

import { Facebook, Heart, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();

  if (pathname === '/inbox') return null;

  return <footer className="bg-gray-900 text-white">
    {/* Main Footer Content */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">E-mall</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your one-stop destination for all your shopping needs. Discover amazing products,
            connect with trusted sellers, and enjoy seamless shopping experience.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="/shops" className="text-gray-300 hover:text-white transition-colors">
                Shops
              </a>
            </li>
            <li>
              <a href="/products" className="text-gray-300 hover:text-white transition-colors">
                Products
              </a>
            </li>
            <li>
              <a href="/offers" className="text-gray-300 hover:text-white transition-colors">
                Offers
              </a>
            </li>
            <li>
              <a href="/cart" className="text-gray-300 hover:text-white transition-colors">
                Cart
              </a>
            </li>
            <li>
              <a href="/wishlist" className="text-gray-300 hover:text-white transition-colors">
                Wishlist
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/help" className="text-gray-300 hover:text-white transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/shipping" className="text-gray-300 hover:text-white transition-colors">
                Shipping Info
              </a>
            </li>
            <li>
              <a href="/returns" className="text-gray-300 hover:text-white transition-colors">
                Returns & Exchanges
              </a>
            </li>
            <li>
              <a href="/faq" className="text-gray-300 hover:text-white transition-colors">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Contact Info</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">SLU, Seattle, WA</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">+1 (206) ***-****</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">support@e-mall.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">
            © 2025 E-mall. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> by Sagar Subedi
          </div>
        </div>
      </div>
    </div>
  </footer>;
};

export default Footer;
