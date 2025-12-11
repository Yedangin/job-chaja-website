import { HomeAboutJobs, HomeJobType, TagType } from "@/data/home";
import Image from "next/image";

export default function DepositSystem() {
  const data: HomeJobType[] = HomeAboutJobs;

  // console.log(data);

  return (
    <section className="bg-white py-16 md:py-24 max-w-8xl mx-auto">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Detailed Deposit System
        </h2>

        {data?.map((jobType: HomeJobType, index) => (
          <div
            key={index}
            className={`flex ${jobType.id === 2 && "flex-row-reverse"} my-20`}
          >
            {/* For Job Seekers */}
            <div className="w-3/4">
              <h3
                className={`text-2xl font-bold text-primary mb-6 ${
                  jobType.id === 2 && "text-end"
                }`}
              >
                {jobType.title}
              </h3>
              <div className="space-y-4">
                {jobType?.tags?.map((tag: TagType, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 ${
                      jobType.id == 2
                        ? "flex-row-reverse items-start text-end"
                        : "items-start"
                    }`}
                  >
                    <div className="w-15 h-15 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      <Image
                        src={tag?.icon}
                        width={100}
                        height={100}
                        alt="jobchaja-icons"
                        className="w-6 h-6 object-contain"
                        unoptimized
                      />
                    </div>

                    <div className={`${jobType.id == 2 ? "text-end" : ""}`}>
                      <h4 className="font-semibold text-foreground mb-1">
                        {tag.title}
                      </h4>

                      <p className={`text-sm text-muted-foreground`}>
                        {tag.description}
                      </p>

                      {tag?.pricing && (
                        <p
                          className={`bg-[#5FA8FF] w-fit text-white rounded-full py-0.5 px-4 ${
                            jobType.id == 2 && "ms-auto"
                          }`}
                        >
                          {tag?.pricing}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={`bg-[#D5E6FF] rounded-xl ${
                jobType?.id === 2 && "bg:[#CFF5FF] px-3"
              } w-1/4 flex items-center justify-center`}
            >
              <Image
                src={jobType.image}
                alt="JobChaJa Deposit"
                width={100}
                height={100}
                unoptimized
                className="w-auto"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
