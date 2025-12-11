import Image from "next/image";

export default function MobileApp() {
  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6 text-primary">
          Manage Deposits & Job Search
          <br />
          <span className="text-primary">with JobMatch Mobile App</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Track your deposits, apply for jobs, schedule interviews, and get
          notifications when you get into the job right from your smartphone.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className=" shadow-md px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition flex items-center justify-center gap-2">
            <span>
              <Image
                src={"/home/apple.png"}
                width={100}
                height={100}
                unoptimized
                alt="JobChaJa-mobile-app-for-ios"
                className="w-10"
              />
            </span>
            <div>
              <p className="text-sm">Download on </p>
              <p className="text-xl font-semibold">App Store</p>
            </div>
          </button>
          <button className="shadow-md px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition flex items-center justify-center gap-2">
            <span>
              <Image
                src={"/home/googlePlay.png"}
                width={100}
                height={100}
                unoptimized
                alt="JobChaJa-mobile-app-for-android"
                className="w-10"
              />
            </span>
            <div>
              <p className="text-sm">Download on </p>
              <p className="text-xl font-semibold">Google Play</p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
