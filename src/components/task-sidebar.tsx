'use client'

import * as React from 'react'
import { useState } from "react";
import { jwtDecode } from 'jwt-decode'
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import HomeIcon from "@/app/img/Home.png";
import WorkIcon from "@/app/img/Work.png";
import LoveIcon from "@/app/img/Heart.png";

const initialLists = [
  {name: "Personal", color:"#E2CCBC", icon: HomeIcon},
  {name: "Work", color:"#E2CCBC", icon: WorkIcon},
  {name: "Study", color:"#E2CCBC", icon: LoveIcon},
];

export default function TaskSidebar() {
  const [isHasToken, setIsHasToken] = React.useState(false)
  const [userData, setUserData] = React.useState<any>()
  const [selectedColor, setSelectedColor] = React.useState('#F1BFB9')
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [newTagName, setNewTagName] = useState("");
  const [tags, setTags] = useState([]);
  
  React.useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    if (token) {
      setIsHasToken(true)
      setUserData(jwtDecode(token))
    } else {
      setIsHasToken(false)
    }
  }, [])



  return (
    <Sidebar className="border-r bg-[#F4ECE5] h-screen pt-5" collapsible="none">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel>
              <h2 className="text-xl text-black ">Tags</h2>
            </SidebarGroupLabel>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
              <DialogTrigger asChild>
                <SidebarGroupAction>
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add Tag</span>
                </SidebarGroupAction>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex justify-center text-2xl">Add Tag</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="grid gap-5">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      className="w-full rounded-md border px-3 py-2"
                    />
                    <div className='flex justify-center '>
                      <button  className="rounded-md bg-primary w-[100px] h-[30px] text-primary-foreground">
                        Add 
                      </button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <SidebarGroupContent className='pt-5'>
            <SidebarMenu>
            {initialLists.map((item, index) => (
                    <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton className="w-full justify-start p-2">
                      {item.name}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
            ))}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}