import { Button } from "~/components/ui/Button";

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Vietnam Visa Application
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Start your Vietnam visa application process. Choose your visa type and follow our simple step-by-step guide.
          </p>
          <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Application Form Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              We are currently building the visa application form. Please check back soon or contact us for assistance.
            </p>
            <Button variant="primary">
              Get Notified When Ready
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
