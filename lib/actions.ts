"use server";

import { redirect } from "next/navigation";
import { auth, signIn } from "./auth";
import prisma from "./prisma";
import { createClient } from "@supabase/supabase-js";
import { Role } from "./generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notification";
import { updateApplicationStatus } from "./updateNotificationStatus";
import { ApplicationStatus, InterviewType } from "../lib/generated/prisma/enums"
import bcrypt from "bcryptjs";
import { signOut } from "@/lib/auth";


//Get the supabase url and service_role_key(server side only)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

//SIGNOUT USER WITH GITHUB
export async function signOutAction() {
  await signOut({ redirectTo: "/" })
}

//SIGNIN USER WITH GITHUB
export async function SignInActionWithGithub() {
    await signIn("github", { redirectTo: "/dashboard" })

}

//SIGNIN USER WITH GOOGLE
export async function SignInActionWithGoogle() {
    await signIn("google", { redirectTo: "/dashboard" })
}


export async function SignInActionWithCredentials(
  prevState: { error: string } | null,
  formData: FormData
) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const existing = await prisma.user.findUnique({ where: { email } })

    if (!existing) {
      // ── New user → create account then sign in ──
      const hashed = await bcrypt.hash(password, 12)
      await prisma.user.create({
        data: { email, password: hashed }
      })
    } else {
      // ── Existing user → verify password ──
      if (!existing.password) {
        // They signed up with OAuth before, no password set
        return { error: "Please sign in with GitHub or Google" }
      }

      const isValid = await bcrypt.compare(password, existing.password)
      if (!isValid) return { error: "Invalid email or password" }
    }

    // ── Sign in either way ──
    await signIn("credentials", { email, password, redirectTo: "/dashboard" })

  } catch (error: any) {
    if (error.type === "CredentialsSignin") {
      return { error: "Invalid email or password" }
    }
    throw error
  }

  return null
}

//CREATE JOB FORM ACTION
export async function CreateJob(formData: FormData) {
    console.log(formData, "formData before");

    //2) Extract data from there fields
    const title = formData.get("title") as string;
    const company = formData.get("company") as string;
    const location = formData.get("location") as string;
    const type = formData.get("type") as string;
    const salary = formData.get("salary") as string;
    const industry = formData.get("industry") as string;
    const description = formData.get("description") as string;
    const responsibilities = formData.get("responsibilities") as string;
    const requirements = formData.get("requirements") as string;
    const benefits = formData.get("benefits") as string;
    const tags = formData.get("tags") as string;
    const companySize = formData.get("company-size") as string;
    const email = formData.get("email") as string;
    const experienceLevel = formData.get("experienceLevel") as string;
    const logo = "🚀"

    const session = await auth();
    const posterId = session?.user.id;
    if (!posterId) return;


    //3) Validate the fields
    if (!title || !type || !company || !location ||
        !description || !requirements ||
        !responsibilities || !experienceLevel
    ) {
        throw new Error("Please fill all required filleds")
    };

    const formattedTag = tags ? tags.split(",").map(tag => tag.trim()) : [];


    //4) Enter the data in the database
    try {
        const job = await prisma.job.create({
            data: {
                title,
                type,
                company,
                location,
                salary,
                requirements,
                responsibilities,
                benefits,
                tags: formattedTag,
                companySize,
                email,
                experienceLevel,
                industry,
                description,
                logo,
                posted: new Date(),
                posterId

            }
        });

        console.log(job, "success");
        redirect("/dashboard");

    } catch (err) {
        const error = err as Error;
        console.error(error, "error Message")
    }

}

export async function saveJob(jobId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")
    await prisma.savedJob.create({ data: { jobId, userId: session.user.id } })
}

export async function unsaveJob(jobId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")
    await prisma.savedJob.delete({
        where: { userId_jobId: { userId: session.user.id, jobId } },
    })
}


export async function ApplyJob(prevState: unknown, formData: FormData) {
    const session = await auth();
    //Check if user is LoggedIn
    if (!session?.user.id) {
        return { success: false, message: "You must be logged in to apply" }
    }
    //Extract user ID from session
    const applicantId = session.user.id;

    //Extract jobId from field
    const jobId = formData.get("jobId") as string;
    const posterId = formData.get("posterId") as string;
    const jobTitle = formData.get("jobTitle") as string;


    //Query Database with userId and jobId
    try {
        const application = await prisma.application.upsert({
            where: {
                applicantId_jobId: { applicantId, jobId }
            },
            update: {},
            create: { applicantId, jobId }
        });

        // Fetch recruiter info to notify them
        const [recruiter, applicant] = await Promise.all([
            prisma.user.findUnique({
                where: { id: posterId },
                select: { email: true, name: true },
            }),
            prisma.user.findUnique({
                where: { id: session.user.id },
                select: { name: true },
            }),
        ])

        if (recruiter?.email) {
            await createNotification({
                userId: posterId,
                type: "NEW_APPLICANT",
                title: "New Application Received",
                message: `${applicant?.name ?? "Someone"} just applied for your "${jobTitle}" listing.`,
                link: `/jobs/${jobId}/applicant/${application.id}`,
                userEmail: recruiter.email,
                userName: recruiter.name,
            })
        }
         revalidatePath("/")

        return { success: true, message: `Successfully applied for ${jobTitle}` }

    } catch (err) {
        const error = err as Error;
        console.log("error:", error);

        return { success: false, message: "You have already applied for this job" }
    }
}


export async function updateUserProfile(prevState: unknown, formData: FormData) {

    const session = await auth();
    const user = session?.user;
    const userId = user?.id;

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const role = formData.get("role") as Role;
    const skillRaw = formData.get("skills") as string;
    const skills = skillRaw ? JSON.parse(skillRaw) : [];
    const image = formData.get("avatar") as File | null;
    const resume = formData.get("resume") as File | null;

    let imageUrl: string | undefined;
    let resumeUrl: string | undefined;

    // Upload Image to Supabase
    if (image && image.size > 0) {
        const ext = image.name.split(".").pop();
        const path = `${userId}/avatar.${ext}`;

        const { error } = await supabase.storage.from("avatar")
            .upload(path, image, { upsert: true, contentType: image.type });

        if (error) throw new Error("Image upload failed")

        const { data } = supabase.storage.from('avatar').getPublicUrl(path)
        imageUrl = data.publicUrl;
    }

    //Upload Resume to Supabase
    if (resume && resume.size > 0) {
        const ext = resume.name.split(".").pop();
        const path = `${userId}/resume.${ext}`

        const { error } = await supabase.storage.from("resume")
            .upload(path, resume, { upsert: true, contentType: resume.type });

        if (error) throw new Error("Resume upload failed")

        const { data } = supabase.storage.from("resume").getPublicUrl(path);
        resumeUrl = data.publicUrl;
    }

    try {
        // Save everything via prisma
        const updateSettings = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                bio,
                role,
                skills,
                ...(resumeUrl && { resume: resumeUrl }),
                ...(imageUrl && { image: imageUrl })
            }
        })

        revalidatePath("/dashboard/settings");

        return { success: true, message: "Profile updated successfully!" }

    } catch (err) {
        console.error(err)

        return { success: false, message: "Failed to update profile" }
    }
}


export async function InviteForInterview( prevState: unknown, formData: FormData) {
  const interviewDates = formData.get("interviewDate") as string
  const interviewType = formData.get("interviewType") as InterviewType
  const interviewTime = formData.get("interviewTime") as string
  const applicationId = formData.get("applicationId") as string

  const interviewDateTime = new Date(`${interviewDates}T${interviewTime}`)

  try {
    await updateApplicationStatus(
      applicationId,
      ApplicationStatus.INTERVIEW,  // ← status is always 2nd arg
      interviewDateTime,
      interviewType
    )

    return {success:true, message: "invite was successful!"}
  } catch (err) {
    console.error(err)
  }

    return {success:false, message: "something went wrong. invite wasn't successful!"}

}


export async function updateJob(formData: FormData) {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const id = formData.get("id") as string

    const job = await prisma.job.update({
        where: { id, posterId: session.user.id },
        data: {
            title: formData.get("title") as string,
            company: formData.get("company") as string,
            location: formData.get("location") as string,
            description: formData.get("description") as string,
            responsibilities: formData.get("responsibilities") as string,
            requirements: formData.get("requirements") as string,
            experienceLevel: formData.get("experienceLevel") as string,
            type: formData.get("type") as string,
            email: formData.get("email") as string,
            benefits: formData.get("benefits") as string,
            salary: formData.get("salary") as string,
            salaryMin: Number(formData.get("salaryMin")) || null,
            salaryMax: Number(formData.get("salaryMax")) || null,
            currency: formData.get("currency") as string,
            companySize: formData.get("companySize") as string,
            industry: formData.get("industry") as string,
            founded: formData.get("founded") as string,
            tags: (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean),
            featured: formData.get("featured") === "true",
            status: formData.get("status") as "ACTIVE" | "CLOSED",
        },
    })

    redirect(`/jobs/${id}`)
}

export async function getSavedJobs() {
    //Check if user is authenticated
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/signin");
    };

    //Fetch savedJobs from Database based on userId. Modeling Job and Application Schema
    const savedJob = await prisma.savedJob.findMany({
        where: { userId },

        include: {
            job: {
                include: {
                    applications: {
                        where: { applicantId: userId }
                    }
                }
            }
        },

        orderBy: {
            savedAt: "desc"
        }
    });

    //return
    return savedJob;
};

export async function removeJob(jobId: string) {
    //Check if user is Logged in 
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        throw new Error("Unathorized")
    };

    //Remove Deleted user from database
    await prisma.savedJob.delete({
        where: {
            userId_jobId: { userId, jobId }
        }
    })

}
