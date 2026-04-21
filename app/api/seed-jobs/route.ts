import { NextResponse } from "next/server"
import { faker } from "@faker-js/faker"
import prisma from "@/lib/prisma"

export async function POST() {
  try {
    const jobsToCreate = 20;
    await prisma.job.deleteMany({})

    const posterId = "cmmxc4ip70000psp72ske4b7s";


    const companyLogos = [
      "🚀", "💾", "☁️", "⚡", "🔧", "💻", "🎯", "🔮", "🛠️", "🌐",
      "📡", "🤖", "🧠", "🔬", "🎮", "📊", "🏗️", "🔐", "🧬", "🛸"
    ];
    const shuffledLogos = faker.helpers.shuffle(companyLogos) // shuffles the array randomly

    const jobs = Array.from({ length: jobsToCreate }).map((_, index) => {
      const salaryMin = faker.number.int({ min: 40000, max: 80000 })
      const salaryMax = faker.number.int({ min: 90000, max: 150000 })
      const status = faker.helpers.arrayElement(["ACTIVE", "CLOSED", "DRAFT"])

      return {
        title: faker.person.jobTitle(),
        company: faker.company.name(),
        location: faker.helpers.arrayElement(["Remote", "Hybrid", "On-site"]),
        description: faker.lorem.paragraphs(2),
        responsibilities: faker.lorem.paragraphs(2),
        requirements: faker.lorem.paragraphs(2),
        experienceLevel: faker.helpers.arrayElement([
          "Entry Level",
          "Mid-Level",
          "Senior",
          "Lead"
        ]),
        type: faker.helpers.arrayElement([
          "Full-time",
          "Part-time",
          "Contract",
          "Freelance",
        ]),
        tags: faker.helpers.arrayElements(
          ["React", "Node.js", "PostgreSQL", "TypeScript", "Docker", "Nextjs"],
          3
        ),
        email: faker.internet.email(),
        featured: faker.datatype.boolean(),
        benefits: faker.lorem.sentence(),
        companySize: faker.helpers.arrayElement([
          "1-10",
          "11-50",
          "51-200",
          "201-500",
        ]),
        industry: faker.commerce.department(),
        founded: faker.date.past().getFullYear().toString(),
        logo: shuffledLogos[index], // ← each job gets a unique logo by index
        salary: `$${salaryMin} - $${salaryMax}`,
        salaryMin,
        salaryMax,
        currency: "USD",
        posted: new Date(),
        posterId,
        status: faker.helpers.weightedArrayElement([
          { weight: 75, value: "ACTIVE" },
          { weight: 10, value: "DRAFT" },
          { weight: 15, value: "CLOSED" },
        ]),
      }
    })

    await prisma.job.createMany({
      data: jobs,
    })

    return NextResponse.json({
      message: `${jobsToCreate} jobs created successfully 🚀`,
    })
  } catch (err) {
    const error = err as Error
    console.error(error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}