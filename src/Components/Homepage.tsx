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
        <div className="absolute inset-0 bg-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-[#212121]  rounded-full border-3 border-[#ff9100] px-4 py-2 mb-8">
              <RiTerminalLine className="w-4 h-4 text-yellow-400" />
              <span className=" text-sm text-gray-300">
                v2.1.0 - Now with advanced entropy and some more features and
                deep analysis
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl  mb-6">
              <span className=" text-white">Welcome to  </span>{" "}
              <span className="  text-[#ff9100] font-mono">{"</"}Zeroleaks{">"}</span>{" "}
            </h1>

            <p className="text-xl md:text-2xl text-gray-400  max-w-3xl mx-auto mb-12 leading-relaxed">
              An <a href="https://github.com/kinshukjainn/zeroleaks" className="text-orange-400 font-mono font-semibold border-b-3  border-[#ff9100]">Open source</a> and
              simple, tool that shows how strong or weak your
              passwords really are. Intentionally there No sign-ups. No data saved. Just instant usage
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/secure-guide"
                className="group bg-black text-yellow-500 px-1 py-1   font-mono border-b-3  border-yellow-500 font-semibold text-sm  transition-all duration-200 flex items-center space-x-2"
              >
                <span>Documentation</span>
                <RiArrowRightLine className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/checker"
                className="bg-yellow-500 text-black font-mono px-3 py-3 rounded-full  font-semibold text-lg transition-all duration-200 flex items-center space-x-2"
              >
                <RiCodeLine className="w-5 h-5" />
                <span>Start</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-mono text-yellow-400 mb-4">
              Vulnerable Password Analysis
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            <div className=" rounded-lg p-6 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                <RiShieldCheckLine className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold  mb-2">
                Security Scoring
              </h3>
              <p className="text-gray-400  text-sm">
                Advanced entropy analysis with real-time security scoring based
                on multiple factors
              </p>
            </div>

            <div className=" rounded-lg p-6 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                <RiTimeLine className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold  mb-2">
                Crack Time Analysis
              </h3>
              <p className="text-gray-400  text-sm">
                Precise calculations for brute force, dictionary, and hybrid
                attack scenarios
              </p>
            </div>

            <div className=" rounded-lg p-6 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                <RiLockLine className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold  mb-2">
                Password Suggestions
              </h3>
              <p className="text-gray-400  text-sm">
                Strong recommendations for creating stronger, more secure
                passwords
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
