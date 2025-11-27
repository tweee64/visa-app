export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl text-center">
            Transparent Pricing
          </h1>
          <p className="mt-6 text-lg text-gray-600 text-center">
            Simple, transparent pricing for all visa types. No hidden fees.
          </p>
          
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Tourist Visa</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold text-blue-600">$49</span>
                <span className="text-gray-500">/application</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>✓ 30-day validity</li>
                <li>✓ Single entry</li>
                <li>✓ 24/7 support</li>
              </ul>
            </div>
            
            <div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Business Visa</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold text-blue-600">$89</span>
                <span className="text-gray-500">/application</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>✓ 90-day validity</li>
                <li>✓ Multiple entry</li>
                <li>✓ Priority processing</li>
              </ul>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Transit Visa</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold text-blue-600">$29</span>
                <span className="text-gray-500">/application</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>✓ 5-day validity</li>
                <li>✓ Single entry</li>
                <li>✓ Fast processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
