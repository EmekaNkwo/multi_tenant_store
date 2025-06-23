"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import useFeatureProducts from "@/components/featuredProducts/useFeaturedProduct";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function Home() {
  const { storeData } = useFeatureProducts();
  const stores = storeData.data?.data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <section className="text-center py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Connect with Independent Sellers
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Discover unique products from curated merchants around the world
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/register">Start Selling</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#featured-products">Browse Products</Link>
          </Button>
        </div>
      </section>

      <section id="featured-products" className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured Products
        </h2>
        {stores?.length > 0 ? (
          <FeaturedProducts products={stores} />
        ) : (
          <p>No products found</p>
        )}
      </section>

      <section className="py-16 bg-gray-50 rounded-xl my-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">For Sellers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Easy Setup</h3>
              <p className="text-gray-600">
                Create your store in minutes with customizable branding
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Secure Payments</h3>
              <p className="text-gray-600">
                Get paid directly to your bank account with Stripe Connect
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Powerful Dashboard</h3>
              <p className="text-gray-600">
                Manage products, orders, and analytics in one place
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
