import { RiShieldLine, RiMailLine } from "react-icons/ri";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className=" bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <RiShieldLine className="w-5 h-5 text-black" />
            </div>
            <span className="text-white  text-xl font-bold">
              ZeroLeaks
            </span>
            <p className="text-gray-400  text-sm max-w-md mt-2">
              Advanced password security analysis tool that helps you understand
              the strength of your passwords and provides actionable insights to
              improve your digital security.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://github.com/kinshukjainn"
                className="text-gray-400 hover:text-white transition-colors"
                title="GitHub"
              > 
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/realkinshuk004"
                className="text-gray-400 hover:text-white transition-colors"
                title="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/kinshukjainn/"
                className="text-gray-400 hover:text-white transition-colors"
                title="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>  
              <a
                href="mailto:kinshuk25jan04@gmail.com"
                className="text-gray-400 hover:text-white transition-colors"
                title="Email"
              >
                <RiMailLine className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className=" mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400  text-sm">
              © 2024 SecurePass. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
