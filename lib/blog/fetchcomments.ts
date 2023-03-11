import prismaClient from "../prisma/prismaClient";

export default async function getComments(postID: string) {
  try {
    const data = await prismaClient.comments.findMany({
      where: {
        postID: postID,
      },
      select: {
        id: true,
        parentID: true,
        message: true,
        createdAT: true,
        updatedAT: true,
        userID: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return data;
  } catch (error: any) {
    return Promise.reject(error.message);
  }
}
