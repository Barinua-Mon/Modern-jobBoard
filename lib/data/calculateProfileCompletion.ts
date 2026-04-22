

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


