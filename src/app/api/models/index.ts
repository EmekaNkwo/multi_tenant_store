// Example tenant model
interface Tenant {
  subdomain: string;
  name: string;
  owner: string; // User ID
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    bannerUrl: string;
  };
  stripeAccountId?: string;
}
