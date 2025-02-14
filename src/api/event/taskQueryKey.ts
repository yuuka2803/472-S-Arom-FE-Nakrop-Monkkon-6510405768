const taskQueryKey = {
    all : ['tasks'],
    id: (id: string) => [...taskQueryKey.all, id],
    user: (id: string) => [...taskQueryKey.all, id],

}
export default taskQueryKey