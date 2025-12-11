import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-primary">Jobchaja</div>
        {/* <button className="bg-secondary text-primary px-6 py-2 rounded-full text-sm font-medium hover:bg-opacity-80 transition">
          Get Started
        </button> */}
        <Button className="bg-[#5FA8FF57] py-2 px-4 text-white font-medium hover:bg-opacity-90 transition">
          <span className="text-primary text-[15px]">Get Start</span>
        </Button>
      </div>
    </header>
  );
}
