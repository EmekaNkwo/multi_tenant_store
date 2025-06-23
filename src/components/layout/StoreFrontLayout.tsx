import Navbar from "./Navbar";
import Footer from "./Footer";
import { getTenantConfig } from "@/lib/tenants";

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeSubdomain: string };
}) {
  const storeConfig = await getTenantConfig(params.storeSubdomain);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={
        {
          "--primary": storeConfig?.branding?.primaryColor || "#2563eb",
          "--secondary": storeConfig?.branding?.secondaryColor || "#7c3aed",
        } as React.CSSProperties
      }
    >
      <Navbar />
      <main className="flex-grow">
        {/* Store Banner */}
        {storeConfig?.branding?.bannerUrl && (
          <div className="w-full h-48 md:h-64 relative bg-gray-200">
            <img
              src={storeConfig.branding.bannerUrl}
              alt={`${storeConfig.name} banner`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Store Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center mb-8">
            {storeConfig?.branding?.logoUrl ? (
              <img
                src={storeConfig.branding.logoUrl}
                alt={storeConfig.name}
                className="w-16 h-16 rounded-full mr-4"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mr-4" />
            )}
            <div>
              <h1 className="text-3xl font-bold">{storeConfig?.name}</h1>
              <p className="text-gray-600 mt-2">{storeConfig?.description}</p>
            </div>
          </div>

          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
