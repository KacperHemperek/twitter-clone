export async function getAccoundDetails(userId: string) {
  // TODO: get user details from prisma

  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/user/${userId}`;
  console.log({ url });

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Couldn't get user information");
  }

  return await res.json();
}
