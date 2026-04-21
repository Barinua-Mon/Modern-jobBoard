

export async function getJobs() {
    const results =  await fetch("http://localhost:3000/api/jobs", {next: {revalidate: 3600}});
    const jobs = await results.json();

     return jobs;

};

export async function getJobById(id:string) {
const results =  await fetch(`http://localhost:3000/api/job/${id}`, {next: {revalidate: 3600}});
    const job = await results.json();
    
     return job;
}

export function calculateProfileCompletion(user: any) {
  let score = 0

  if (user.name) score += 10
  if (user.email) score += 10
  if (user.image) score += 15
  if (user.bio) score += 20
  if (user.skills && user.skills.length > 0) score += 20
  if (user.resume) score += 25

  return score
}



