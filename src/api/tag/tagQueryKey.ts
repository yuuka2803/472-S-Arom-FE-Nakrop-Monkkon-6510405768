const tagQueryKey = {
    all : ['tags'],
    id: (id: string) => [...tagQueryKey.all, id],
    user: (id: string) => [...tagQueryKey.all, id],

}
export default tagQueryKey