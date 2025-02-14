const diaryQueryKey = {
    all : ['diaries'],
    id: (id: string) => [...diaryQueryKey.all, id],
    date: (date: string) => [...diaryQueryKey.all, date],
    user: (id: string) => [...diaryQueryKey.all, id],

}
export default diaryQueryKey