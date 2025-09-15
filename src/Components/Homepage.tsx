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
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-[#181818]  rounded border-2 border-blue-500 px-4 py-2 mb-8">
              <div className="bg-[#252525] p-2 rounded border border-[#444444]">
              <RiTerminalLine className="w-5 h-5 text-white" />
              </div>
              <span className=" text-sm font-mono text-gray-100">
                v2.1.0 - Now with advanced entropy and some more features and
                deep analysis
              </span>
            </div>

            <h1 className="text-xl md:text-3xl lg:text-5xl  mb-4">
              <span className=" text-white">Welcome to  </span>{" "}
              <span className=" text-gray-400 font-mono">{"</"}Zeroleaks{">"}</span>{" "}
            </h1>

            <p className="text-xl md:text-2xl text-gray-400  max-w-3xl mx-auto mb-12 leading-relaxed">
              An <a href="https://github.com/kinshukjainn/zeroleaks" className="text-white  font-medium border-b-3  border-white">Open source</a> and
              simple, tool that shows how strong or weak your
              passwords really are. Intentionally there No sign-ups. No data saved. Just instant usage
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/secure-guide"
                className=" bg-[#252525] text-white px-2 py-2  font-mono  font-semibold text-sm rounded border border-[#444444]  transition-all duration-200 flex items-center space-x-2"
              >
                <span>Documentation</span>
                <RiArrowRightLine className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/checker"
                className="bg-[#252525] text-gray-200 border border-[#444444]  px-3 py-1 rounded  font-semibold text-lg transition-all duration-200 flex items-center space-x-2"
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Vulnerable Password Analysis
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            <div className=" rounded-lg p-6 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 bg-black rounded flex items-center justify-center mb-4">
                <RiShieldCheckLine className="w-6 h-6 text-white" />
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
              <div className="w-12 h-12 bg-black rounded flex items-center justify-center mb-4">
                <RiTimeLine className="w-6 h-6 text-white" />
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
              <div className="w-12 h-12 bg-black rounded flex items-center justify-center mb-4">
                <RiLockLine className="w-6 h-6 text-white" />
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
