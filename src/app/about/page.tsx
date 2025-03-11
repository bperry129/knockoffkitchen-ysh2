import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - KnockoffKitchen.com',
  description: 'Learn about KnockoffKitchen.com, our mission to help you recreate your favorite restaurant dishes at home, and the team behind our recipe collection.',
};

export default function AboutPage() {
  return (
    <>
      <main className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">About KnockoffKitchen.com</h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-6">
                At KnockoffKitchen.com, we believe that everyone should be able to enjoy their favorite restaurant dishes in the comfort of their own home. Our mission is to provide accurate, easy-to-follow recipes that replicate the flavors of popular restaurant dishes, allowing you to save money while still enjoying the foods you love.
              </p>
              <p className="text-gray-700">
                Whether you're looking to recreate a nostalgic childhood favorite, impress guests with a restaurant-quality meal, or simply satisfy a craving without leaving home, our collection of copycat recipes has you covered.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  KnockoffKitchen.com began in 2023 when our founder, a passionate home cook, became frustrated with the lack of reliable copycat recipes online. After spending countless hours perfecting recipes to match restaurant favorites, the idea for a dedicated copycat recipe website was born.
                </p>
                <p className="text-gray-700">
                  What started as a small collection of recipes has grown into a comprehensive database of restaurant favorites, all tested and perfected in home kitchens to ensure they're accessible to cooks of all skill levels.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Our Process</h2>
                <p className="text-gray-700 mb-4">
                  Every recipe on KnockoffKitchen.com goes through a rigorous development and testing process. We start by analyzing the original dish, identifying key ingredients and cooking techniques, and then develop a recipe that can be recreated in a home kitchen.
                </p>
                <p className="text-gray-700">
                  Each recipe is tested multiple times by our team of home cooks to ensure accuracy, consistency, and most importantly, that it captures the essence of the original dish. We don't publish a recipe until we're confident it's as close to the restaurant version as possible.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Meet Our Team</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4">
                    {/* Placeholder for team member image */}
                  </div>
                  <h3 className="text-lg font-semibold">Sarah Johnson</h3>
                  <p className="text-gray-600">Founder & Head Recipe Developer</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4">
                    {/* Placeholder for team member image */}
                  </div>
                  <h3 className="text-lg font-semibold">Michael Chen</h3>
                  <p className="text-gray-600">Executive Chef & Recipe Tester</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4">
                    {/* Placeholder for team member image */}
                  </div>
                  <h3 className="text-lg font-semibold">Emily Rodriguez</h3>
                  <p className="text-gray-600">Food Photographer & Content Creator</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              We love hearing from our users! Whether you've tried one of our recipes, have a suggestion for a dish you'd like to see, or just want to connect with other copycat recipe enthusiasts, we invite you to join our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors">
                Subscribe to Our Newsletter
              </button>
              <button className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-md font-medium hover:bg-primary-50 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
