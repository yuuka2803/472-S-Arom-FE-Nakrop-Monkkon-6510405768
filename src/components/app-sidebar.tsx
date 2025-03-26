"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Calendar, Home, Search, FolderCheck } from "lucide-react";
import AROMImage from "/src/app/img/AROM.png";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { createBrowserClient } from "@supabase/ssr";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { supabase } from "@/lib/supabaseClient";

const items = [
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Diary",
    url: "/diary/",
    icon: Home,
  },
  {
    title: "Tasks",
    url: "/task",
    icon: FolderCheck,
  },
];

export function AppSidebar() {
  const [isHasToken, setIsHasToken] = useState(false);
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsHasToken(true);
      setUserData(jwtDecode(token));
    } else {
      setIsHasToken(false);
    }
  }, [setIsHasToken]);

  return (
    <div className="w-[230px] h-full">
      <SidebarInset className="bg-[#F9F4ED]">
        <SidebarHeader>
          <div className="flex justify-center flex-col">
            <div className="flex justify-center">
              <Image src={AROMImage} width={150} height={80} alt="AROM" />
            </div>
            <div className="flex flex-row gap-2 justify-center pb-3">
              <Avatar className="justify-self-center w-[35px] h-[35px]">
                {userData?.ProfileImage ? (
                  <AvatarImage src={userData?.ProfileImage} />
                ) : (
                  <AvatarFallback>
                    {userData?.username?.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <p className="flex justify-self-start self-center text-[22px] text-arom_brown">
                {userData?.username}
              </p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <div className="grid grid-flow-row gap-4 justify-center">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-[#E9DBD1] text-xl text-arom_brown  focus:bg-[#E9DBD1]"
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </div>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarContent>
            {typeof window !== "undefined" && isHasToken ? (
              <div className="flex justify-center">
                <SidebarMenuButton
                  asChild
                  className="bg-[#E9DBD1] hover:bg-arom_orange-100 hover:text-arom_white text-xl text-arom_brown focus:bg-[#E9DBD1] justify-center mb-8 w-[130px]"
                  onClick={() => {
                    localStorage.removeItem("jwtToken");
                    setIsHasToken(false);
                    window.location.reload();
                  }}
                >
                  <a>
                    <span>Log out</span>
                  </a>
                </SidebarMenuButton>
              </div>
            ) : (
              <div className="flex justify-center">
                <SidebarMenuButton
                  asChild
                  className="bg-[#E9DBD1] hover:bg-arom_blue-100 hover:text-arom_white text-xl  text-arom_brown focus:bg-[#E9DBD1] justify-center mb-8 w-[130px]"
                >
                  <a href="/login">
                    <span>Log in</span>
                  </a>
                </SidebarMenuButton>
              </div>
            )}
          </SidebarContent>
        </SidebarFooter>
        {/* </div> */}
      </SidebarInset>
    </div>
  );
}
