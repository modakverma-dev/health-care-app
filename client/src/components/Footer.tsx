import React from "react";

function Footer() {
  return (
    <div className="w-full h-auto p-10 bg-blue-700 text-white">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="footer-info">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p>171011, Shimla (HP), India</p>
            <p>Email: quickdoc@gmail.com</p>
            <div>
              Phone: <h1>+91 8580854096</h1> <h1>+91 8580854096</h1>
            </div>
          </div>
          <div className="footer-links">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-300 hover:text-white">
                  Our Services
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-social">
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
        <p className="text-center mt-8 text-sm">&copy; 2024 QuickDoc</p>
      </div>
    </div>
  );
}

export default Footer;
