"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const jobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Tech Corp",
      location: "Yangon, Myanmar",
      category: "Technology",
      salary: "$2,000 - $3,000",
      type: "Full-time",
      img: "/home/icons/samsung.png",
      status: "OPEN",
    },
    {
      id: 2,
      title: "Marketing Manager",
      company: "Digital Agency",
      location: "Remote",
      category: "Marketing",
      salary: "$1,500 - $2,200",
      type: "Remote",
      img: "/home/icons/samsung.png",
      status: "OPEN",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Creative Studio",
      location: "Mandalay, Myanmar",
      category: "Design",
      salary: "$1,200 - $1,800",
      type: "Contract",
      img: "/home/icons/samsung.png",
      status: "CLOSED",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Featured Job Posts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg">

                <div className="flex items-center gap-2">
                  <img src={job.img} alt={job.company} className="h-8 w-8 mb-2" />
                  {job.title}
                </div>

              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {job.company} • {job.location}
              </p>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{job.category}</Badge>
                <Badge variant="outline">{job.type}</Badge>
                {job.status === "OPEN" ? (
                  <Badge>Open</Badge>
                ) : (
                  <Badge variant="destructive">Closed</Badge>
                )}
              </div>

              <p className="text-sm">
                <span className="font-medium">Salary:</span> {job.salary}
              </p>
            </CardContent>

            <CardFooter>
              <Button
                asChild
                className="w-full"
                disabled={job.status !== "OPEN"}
              >
                <Link href={"/payment"}>Apply</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
