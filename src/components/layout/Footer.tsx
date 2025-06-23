export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12 px-6 border-t">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Marketplace</h3>
          <p className="text-gray-600">
            Connecting buyers with independent sellers worldwide
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-4">For Buyers</h4>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#">How to Buy</a>
            </li>
            <li>
              <a href="#">Returns Policy</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4">For Sellers</h4>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#">Open a Store</a>
            </li>
            <li>
              <a href="#">Seller Handbook</a>
            </li>
            <li>
              <a href="#">Fees & Pricing</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Cookie Policy</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t text-center text-gray-500">
        <p>© {new Date().getFullYear()} Marketplace. All rights reserved.</p>
      </div>
    </footer>
  );
}
