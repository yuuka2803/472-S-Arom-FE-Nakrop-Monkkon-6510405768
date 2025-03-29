import axios from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query"
import testQueryKey from "./testQueryKey";

const getTest = async () => {
  try {
    const { data } = await axios.get(`/test`);  
    return data;    
  } catch (error) {
  
  }
}

// const useTest = () => {
//   return useQuery({
//     queryKey: testQueryKey,
//     queryFn: async () => getTest(),
//   })
// }

// export default useTest

//Test เฉยๆจ้าา