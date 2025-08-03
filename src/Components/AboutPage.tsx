import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaCode,
  FaBlog,
  FaRocket,
} from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-mono mb-6 tracking-tight">
              Zero<span className="text-white">Leaks</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-white p-3 border-2 border-blue-400 bg-[#151515] rounded-full hover:bg-[#1a1a1a] transition-colors">
                <FaRocket className="text-xl text-blue-400" />
                <span className="text-sm sm:text-base">
                   Security and Privacy
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Project Information Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Repository Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <FaCode className="text-2xl text-yellow-500" />
                <h2 className="text-2xl font-mono sm:text-3xl text-yellow-500 font-bold">
                  Repository :{" "}
                </h2>
              </div>
              <p className="text-base sm:text-lg leading-relaxed mb-6">
                ZeroLeaks is built with transparency at its core. By design,
                we’ve excluded any backend or database components—intentionally.
                This ensures that no data is ever stored, tracked, or recorded.
                Everything you enter is processed instantly and disappears just
                as quickly—leaving no trace. It’s not about a lack of
                capability—it’s about a deliberate commitment to privacy and
                security. Dive into our open-source codebase, contribute to the
                mission, and join us in creating a safer, more private digital
                world.
              </p>
              <a
                href="https://github.com/kinshukjainn/zeroleaks"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-mono border-2 border-yellow-500 hover:bg-[#ff9100] hover:text-black rounded-full gap-1 text-white px-3  py-1 transition-all duration-300  text-lg lg:text-base"
              >
                <FaGithub className="text-xl" />
                github / zeroleaks
                <FaExternalLinkAlt className="text-sm" />
              </a>
            </div>

            {/* Blog Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <FaBlog className="text-2xl text-yellow-500" />
                <h2 className="text-2xl sm:text-3xl font-mono text-yellow-500 font-bold">
                  How I built ZeroLeaks ?
                </h2>
              </div>
              <p className="text-base sm:text-lg leading-relaxed mb-6">
                Discover the process behind ZeroLeaks - from an idea to
                implementation. Learn about the challenges, solutions, that
                shaped this project.
              </p>
              <a
                href="https://blog.cloudkinshuk.in/passgentool-a-secure-customizable-password-generator-built-with-ai-and-modern-web-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3  border-2 border-yellow-500 hover:bg-[#ff9100] hover:text-black rounded-full gap-1 text-white px-3  py-1 font-mono  transition-all duration-300 text-lg lg:text-base"
              >
                <FaBlog className="text-xl" />
                Read the blogs
                <FaExternalLinkAlt className="text-sm" />
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Creator Section */}
      <section className="px-4 py-10 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <h2 className="text-3xl sm:text-4xl ">Myself</h2>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Profile Image Placeholder */}

              {/* Creator Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-semibold mb-4">
                    Kinshuk Jain
                  </h3>
                  <p className="text-base sm:text-lg  leading-relaxed mb-6">
                    I'm a student  with a
                    strong focus on AWS technologies, React development, and
                    DevOps good practices. while actively learning and building
                    cloud solutions. Always open to learn about technology.
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 mb-6">
                  <FaMapMarkerAlt className="text-xl text-white" />
                  <span className="text-base sm:text-lg">
                    Noida, Uttar Pradesh, India
                  </span>
                </div>

                {/* Portfolio Link */}
                <div className="mb-8">
                  <a
                    href="https://cloudkinshuk.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-yellow-400 text-black px-2 py-1 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base"
                  >
                    <FaExternalLinkAlt className="text-lg" />
                    View Portfolio
                  </a>
                </div>

                {/* Social Media Links */}
                <div>
                  <h4 className="text-lg sm:text-xl font-mono font-semibold mb-4">
                    Connect with me
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://github.com/kinshukjainn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-yellow-400 text-black px-2 py-1 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base"
                    >
                      <FaGithub className="text-lg" />
                      GitHub
                    </a>
                    <a
                      href="https://x.com/realkinshuk004"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base"
                    >
                      <FaTwitter className="text-lg" />
                      Twitter
                    </a>
                    <a
                      href="https://www.linkedin.com/in/kinshukjainn/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-1 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base"
                    >
                      <FaLinkedin className="text-lg" />
                      LinkedIn
                    </a>
                    <a
                      href="https://instagram.com/kinshukjainn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-1 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base"
                    >
                      <FaInstagram className="text-lg" />
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
    </div>
  );
};

export default AboutPage;
