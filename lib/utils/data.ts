import prisma from "../prisma";


// export async function getJobs() {
//     const results =  await fetch(`${process.env.AUTH_URL}/api/jobs`, {next: {revalidate: 3600}});
//     const jobs = await results.json();

//      return jobs;

// };

// export async function getJobById(id:string) {
// const results =  await fetch(`${process.env.AUTH_URL}/${id}`, {next: {revalidate: 3600}});
//     const job = await results.json();
    
//      return job;
// }

export async function getAllJobs() {
  return await prisma.job.findMany();
}
export async function getJobs() {
  return await prisma.job.findMany({ orderBy: { posted: "desc" } });
}

export async function getJobById(id: string) {
  return await prisma.job.findUnique({ where: { id } });
}






