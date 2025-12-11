import Image from "next/image";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Sign up to line up or login",
      description: "Get verified to participate in our secure interview system",
    },
    {
      number: "2",
      title: "Find the best jobs for you",
      description:
        "Browse available positions matched to your skills and preferences",
    },
    {
      number: "3",
      title: "Apply to the best jobs for you",
      description:
        "Submit your application and complete the deposit requirement",
    },
  ];

  return (
    <section className="bg-white py-3 md:py-10">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[52px] font-bold text-center mb-12 text-foreground">
          How <span className="text-primary">Jobchaja</span> Works
        </h2>

        {/* <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div> */}

        <div className="flex gap-3 max-w-5xl mx-auto">
          {/* 1st */}
          <div className="bg-[#D5E6FF] rounded-2xl">
            <div className="p-10">
              <h2 className="font-[700] text-[24px] mb-5">
                1.{""} Sign Up to hire up or login
              </h2>
              <p className="max-w-sm leading-6 mb-[60px]">
                Job seekers and companies create verified profiles. Both parties
                deposit according to their needs.
              </p>
              <div className="flex items-center justify-center">
                <Image
                  src={"/home/phone.png"}
                  alt="JobChaPhoneApp"
                  width={100}
                  height={100}
                  unoptimized
                  className="w-[220px] h-[330px] "
                />
              </div>
            </div>
          </div>

          {/* 2nd */}
          <div className="">
            <div className="bg-[#CFF5FF] rounded-2xl mb-3">
              <div className="p-10">
                <h2 className="font-[700] text-[24px] mb-5">
                  2.{""} Find the best jobs for you
                </h2>
                <p className="max-w-sm leading-6 mb-5">
                  Get the perfect job based on your preference and the best
                  salary you can get from it to support your future.
                </p>
                <div className="flex items-center justify-center">
                  <Image
                    src={"/home/searchBar.png"}
                    alt="JobChaPhoneApp"
                    width={300}
                    height={100}
                    unoptimized
                  />
                </div>
              </div>
            </div>
            <div className="bg-[#F4E4FF] rounded-2xl">
              <div className="p-10">
                <h2 className="font-[700] text-[24px] mb-5">
                  3.{""} Apply to the best jobs for you
                </h2>
                <p className="max-w-sm leading-6 mb-5">
                  We only provide work from trusted companies with superior
                  quality and satisfying salary offers for you.
                </p>
                <div className="flex items-center justify-center">
                  <Image
                    src={"/home/orangeSquare.png"}
                    alt="JobChaPhoneApp"
                    width={300}
                    height={100}
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
