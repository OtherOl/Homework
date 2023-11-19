
export type CreatePostModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type UpdatePostModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type PostDbModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type PostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
    createdAt: string
}