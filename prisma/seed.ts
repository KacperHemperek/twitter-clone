import { type Post, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDataBase() {
  await prisma.like.deleteMany();
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
}

async function generateUsers() {
  const joe = await prisma.user.create({
    data: {
      email: 'joe@doe.com',
      name: 'Joe Doe',
      image: 'https://cdn.discordapp.com/embed/avatars/3.png',
      posts: {
        create: [
          { message: 'this is first tweet' },
          { message: 'My second tweet' },
          {
            message:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio provident accusantium doloribus blanditiis modi vel, nemo enim pariatur nobis! Quae, perspiciatis eligendi praesentium autem aspernatur ipsa recusandae voluptatum accusamus temporibus.',
          },
        ],
      },
    },
    select: { id: true, name: true, posts: true, email: true },
  });

  const jane = await prisma.user.create({
    data: {
      email: 'jane@doe.com',
      name: 'Jane Doe',
      image: 'https://cdn.discordapp.com/embed/avatars/3.png',
      posts: {
        create: [
          {
            message:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio provident',
          },
          {
            message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          },
          {
            message:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio provident accusantium doloribus blanditiis modi vel, nemo enim pariatur nobis! Quae, perspiciatis eligendi praesentium autem aspernatur ipsa recusandae voluptatum accusamus temporibus.',
          },
        ],
      },
    },
    select: { id: true, name: true, posts: true, email: true },
  });
  return { joe, jane };
}

type UserWithPosts = {
  id: string;
  name: string | null;
  email: string | null;
  posts: Post[];
};

async function likeTweets(jane: UserWithPosts, joe: UserWithPosts) {
  await prisma.post.update({
    where: { id: jane.posts[0].id },
    data: { likes: { create: [{ userId: jane.id }, { userId: joe.id }] } },
  });
}

async function main() {
  await clearDataBase();

  const { jane, joe } = await generateUsers();

  await likeTweets(jane, joe);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
