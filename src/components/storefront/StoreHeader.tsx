export default function StoreHeader({ storeConfig }: { storeConfig: any }) {
  return (
    <div className="mb-8">
      {storeConfig.branding.bannerUrl ? (
        <div className="h-48 md:h-64 rounded-xl overflow-hidden mb-6">
          <img
            src={storeConfig.branding.bannerUrl}
            alt={`${storeConfig.name} banner`}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-r from-primary to-secondary rounded-xl mb-6" />
      )}

      <div className="flex items-center">
        {storeConfig.branding.logoUrl ? (
          <img
            src={storeConfig.branding.logoUrl}
            alt={storeConfig.name}
            className="w-16 h-16 rounded-full border-4 border-white shadow-md mr-4"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mr-4" />
        )}
        <div>
          <h1 className="text-3xl font-bold">{storeConfig.name}</h1>
          <p className="text-gray-600 mt-1">{storeConfig.description}</p>
        </div>
      </div>
    </div>
  );
}
