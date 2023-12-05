export type commentDbModel = {
    postId: string
    id: string
    content: string
    commentatorInfo: {
        userId: string,
        userLogin: string
    }
    createdAt: string
    likesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: string
        likesList: string[]
    }
}