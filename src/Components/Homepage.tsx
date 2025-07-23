import { Link } from "react-router-dom";
import {
  RiShieldCheckLine,
  RiTimeLine,
  RiLockLine,
  RiTerminalLine,
  RiArrowRightLine,
  RiCodeLine,
} from "react-icons/ri";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-[#212121]  rounded-md px-4 py-2 mb-8">
              <RiTerminalLine className="w-4 h-4 text-green-400" />
              <span className="font-sans text-sm text-gray-300">
                v2.1.0 - Now with advanced entropy and some more features and
                deep analysis
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-sans mb-6">
              <span className="text-white">Security is our top</span>{" "}
              <span className="text-gray-400">Priority</span>{" "}
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 font-sans max-w-3xl mx-auto mb-12 leading-relaxed">
              An <span className="text-orange-400">Open source</span> and
              beautifully simple, tool that shows how strong or weak your
              passwords really are. No sign-ups. No data saved. Just instant,
              actionable insights to help you stay safer online..
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/secure-guide"
                className="group bg-white text-black px-8 py-4 rounded font-sans font-semibold text-lg hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Documentation</span>
                <RiArrowRightLine className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/checker"
                className="border border-gray-600 text-white px-8 py-4 rounded font-sans font-semibold text-lg hover:border-gray-400 hover:bg-gray-900 transition-all duration-200 flex items-center space-x-2"
              >
                <RiCodeLine className="w-5 h-5" />
                <span>Start using ZeroLeaks</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">
              Vulnerable Password Analysis
            </h2>
            <p className="text-xl text-gray-400 font-sans max-w-2xl mx-auto">
              Powered by advanced algorithms and real-time data, ZeroLeaks
              provides comprehensive password security guide analysis to help
              you stay ahead of password leaks and breaches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#181818]  rounded-lg p-6 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                <RiShieldCheckLine className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold font-sans mb-2">
                Security Scoring
              </h3>
              <p className="text-gray-400 font-sans text-sm">
                Advanced entropy analysis with real-time security scoring based
                on multiple factors
              </p>
            </div>

            <div className="bg-[#181818]  rounded-lg p-6 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                <RiTimeLine className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold font-sans mb-2">
                Crack Time Analysis
              </h3>
              <p className="text-gray-400 font-sans text-sm">
                Precise calculations for brute force, dictionary, and hybrid
                attack scenarios
              </p>
            </div>

            <div className="bg-[#181818] rounded-lg p-6 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                <RiLockLine className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold font-sans mb-2">
                Password Suggestions
              </h3>
              <p className="text-gray-400 font-sans text-sm">
                Strong recommendations for creating stronger, more secure
                passwords
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-sans mb-6">
            Ready to Secure Your Handles
          </h2>
          <p className="text-xl text-gray-400 font-sans mb-8 max-w-2xl mx-auto">
            Built this to help you test and improve your passwords. Super useful
            if you care about online safety!
          </p>
          <Link
            to="/secure-guide"
            className="inline-flex items-center space-x-2 bg-white text-black px-8 py-4 rounded font-sans font-semibold text-lg hover:bg-gray-200 transition-colors"
          >
            <span>For more info Refer documentations</span>
            <RiArrowRightLine className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
