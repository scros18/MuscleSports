export const dynamic = 'force-dynamic';

export default function ContactPage() {
  return (
    <div className="container py-12 max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-saira">
          <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent">
            Get In Touch
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions about our premium sports nutrition products? Need advice on supplements? We're here to help you achieve your fitness goals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-card rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-saira">Email Support</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            For product inquiries, order questions, or general support:
          </p>
          <a
            href="mailto:support@musclesports.co.uk"
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold text-lg"
          >
            support@musclesports.co.uk
          </a>
          <p className="text-sm text-muted-foreground mt-2">
            We typically respond within 24 hours
          </p>
        </div>

        <div className="bg-white dark:bg-card rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-saira">Business Hours</h2>
          </div>
          <div className="space-y-2 text-muted-foreground">
            <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM GMT</p>
            <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM GMT</p>
            <p><strong>Sunday:</strong> Closed</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-8 border border-green-200 dark:border-green-800">
        <h3 className="text-xl font-bold mb-4 font-saira">Need Help Choosing Supplements?</h3>
        <p className="text-muted-foreground mb-4">
          Not sure which supplements are right for your fitness goals? Our expert team can help you select the perfect products for your needs.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="/nutrition-calculator"
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors duration-200"
          >
            Nutrition Calculator
          </a>
          <a
            href="/recipe-generator"
            className="inline-flex items-center px-6 py-3 border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 font-semibold rounded-xl transition-colors duration-200"
          >
            Recipe Generator
          </a>
        </div>
      </div>
    </div>
  );
}
