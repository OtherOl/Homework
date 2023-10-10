interface blogGeneric {
    searchNameTerm: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number
}

interface genericUser {
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string,
    searchEmailTerm: string
}