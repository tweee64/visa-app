export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl text-center">
            Our Services
          </h1>
          <p className="mt-6 text-lg text-gray-600 text-center">
            Comprehensive Vietnam visa services for all types of travelers.
          </p>
          
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Tourist Visa</h3>
              <p className="mt-2 text-gray-600">
                Perfect for vacation and leisure travel to Vietnam.
              </p>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Business Visa</h3>
              <p className="mt-2 text-gray-600">
                For business meetings, conferences, and work-related travel.
              </p>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Transit Visa</h3>
              <p className="mt-2 text-gray-600">
                Short-term visa for travelers passing through Vietnam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
