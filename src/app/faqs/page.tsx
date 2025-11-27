export default function FAQsPage() {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl text-center">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-lg text-gray-600 text-center">
            Find answers to common questions about Vietnam visa applications.
          </p>
          
          <div className="mt-12 space-y-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900">How long does it take to process a Vietnam visa?</h3>
              <p className="mt-3 text-gray-600">
                Standard processing takes 2-3 business days. We also offer rush processing (24 hours) and super rush processing (4-8 hours) for urgent applications.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900">What documents do I need for a Vietnam visa?</h3>
              <p className="mt-3 text-gray-600">
                You need a passport valid for at least 6 months, a passport photo, and completed application form. Additional documents may be required depending on your visa type.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900">Can I extend my Vietnam visa?</h3>
              <p className="mt-3 text-gray-600">
                Tourist visas can be extended once for up to 30 days. Business visas can be extended multiple times. We can assist with extension applications.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900">Is my payment secure?</h3>
              <p className="mt-3 text-gray-600">
                Yes, we use industry-standard SSL encryption and secure payment processors. Your personal and financial information is fully protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
