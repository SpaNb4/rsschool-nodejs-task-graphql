import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';
import DataLoader from 'dataloader';

export const getDataLoaders = (prisma: PrismaClient) => ({
  profilesLoader: new DataLoader(async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: { in: Array.from(ids) },
      },
    });

    const profilesMap = new Map<string, Profile>();

    profiles.forEach((profile) => profilesMap.set(profile.userId, profile));

    return ids.map((id) => profilesMap.get(id));
  }),

  postsLoader: new DataLoader(async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: Array.from(ids) },
      },
    });

    const userPostsMap = new Map<string, Post[]>();

    posts.forEach((post) => {
      const userPosts = userPostsMap.get(post.authorId) || [];

      userPosts.push(post);

      userPostsMap.set(post.authorId, userPosts);
    });

    return ids.map((id) => userPostsMap.get(id));
  }),

  membersLoader: new DataLoader(async (ids: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: {
        id: { in: Array.from(ids) },
      },
    });

    const memberTypesMap = new Map<string, MemberType>();

    memberTypes.forEach((memberType) => memberTypesMap.set(memberType.id, memberType));

    return ids.map((id) => memberTypesMap.get(id));
  }),

  userSubscribedToLoader: new DataLoader(async (ids: readonly string[]) => {
    const usersWithAuthors = await prisma.user.findMany({
      where: { id: { in: Array.from(ids) } },
      include: { userSubscribedTo: { select: { author: true } } },
    });

    const subscribedAuthorsMap = new Map<string, User[]>();

    usersWithAuthors.forEach((user) => {
      const subscribedAuthors = user.userSubscribedTo.map(
        (subscription) => subscription.author,
      );

      subscribedAuthorsMap.set(user.id, subscribedAuthors);
    });

    return ids.map((id) => subscribedAuthorsMap.get(id));
  }),

  subscribedToUserLoader: new DataLoader(async (ids: readonly string[]) => {
    const usersWithSubs = await prisma.user.findMany({
      where: { id: { in: Array.from(ids) } },
      include: { subscribedToUser: { select: { subscriber: true } } },
    });

    const subscribersMap = new Map<string, User[]>();

    usersWithSubs.forEach((user) => {
      const subscribers = user.subscribedToUser.map(
        (subscription) => subscription.subscriber,
      );

      subscribersMap.set(user.id, subscribers);
    });

    return ids.map((id) => subscribersMap.get(id));
  }),
});
