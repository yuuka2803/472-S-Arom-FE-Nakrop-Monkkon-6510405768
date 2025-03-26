import axios from "@/lib/axios.config";

export const login = async (userLogin: any) => {
  //Change any to login schema
  
  const { data } = await axios.post(`/user/login`, userLogin);
  const jwtToken = data;
  localStorage.setItem("jwtToken", jwtToken.token)
  
  return data;
};

