import { useGetFeaturedStoresQuery } from "@/redux/api/storeApi";

const useFeatureProducts = () => {
  const storeData = useGetFeaturedStoresQuery({});
  return {
    storeData,
  };
};

export default useFeatureProducts;
