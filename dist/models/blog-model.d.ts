export type blogModel = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
};
export type createBlogModel = {
    name: string;
    description: string;
    websiteUrl: string;
};
