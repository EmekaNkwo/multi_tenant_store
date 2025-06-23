import { notFound } from "next/navigation";
import { getStoreBySubdomain } from "@/lib/api/stores";

export default async function SubdomainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { subdomain: string };
}) {
  const store = await getStoreBySubdomain(params.subdomain);

  // if (!store) {
  //   notFound();
  // }

  return (
    <div className="min-h-screen">
      {/* Store-specific header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">{store?.name}</h1>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
