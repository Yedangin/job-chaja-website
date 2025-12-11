export default function Footer() {
  return (
    <footer className=" text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 bg-primary py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Jobchaja</h3>
            <p className="text-sm text-opacity-80">
              Fair job interviews with secure deposits
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-opacity-90">
              <li>
                <a href="#" className="hover:underline">
                  For Job Seekers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  For Companies
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-opacity-90">
              <li>
                <a href="#" className="hover:underline">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Phone: +82 2-1234-5678
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-opacity-90">
              <li>
                <a href="#" className="hover:underline">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white border-opacity-20 pt-8 text-center text-sm text-opacity-80 text-black py-5 ">
        <p>
          &copy; {new Date().getFullYear()} Jobchaja. All rights reserved. |
          Design by Jobchaja
        </p>
        <p>
          Deposit System: Job Seeker ₩50,000 per application (win ₩50,000 when
          hired) | Corporate: ₩50,000 opening + ₩30,000 per post + ₩50,000 per
          interview
        </p>
      </div>
    </footer>
  );
}
