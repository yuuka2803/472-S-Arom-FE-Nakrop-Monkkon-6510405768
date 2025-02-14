// "use client";

// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { CheckCircle2, Circle } from "lucide-react";
// // import { Todo } from "../../type/types"
// import { Task } from "@/interface/Task";

// export function TodoComponent({ task }: { task: Task }) {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <div
//           className={`h-full w-full rounded-md p-1 text-xs font-medium shadow-sm cursor-pointer flex items-center ${
//             task.complete
//               ? "bg-green-100 text-green-600"
//               : "bg-yellow-100 text-yellow-800"
//           }`}
//           onClick={() => setIsOpen(true)}
//         >
//           {task.complete ? (
//             <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
//           ) : (
//             <Circle className="mr-1 h-3 w-3" aria-hidden="true" />
//           )}
//           <span className="truncate">{task.title}</span>
//         </div>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] max-h-[90vh] flex flex-col">
//         <DialogHeader>
//           <DialogTitle className="text-2xl">{task.title}</DialogTitle>
//         </DialogHeader>
//         <ScrollArea className="flex-grow">
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-start gap-4">
//               <span className="text-md font-medium">Description:</span>
//               <span className="col-span-3 text-md break-words">
//                 {task.description}
//               </span>
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <span className="text-md font-medium">Due Date:</span>
//               <span className="col-span-3 text-md">
//                 {task.end.toLocaleDateString()}
//               </span>
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <span className="text-md font-medium">Status:</span>
//               <span
//                 className={`col-span-3 text-md font-medium ${
//                   task.complete ? "text-green-600" : "text-yellow-600"
//                 } capitalize`}
//               >
//                 {task.complete ? "Completed" : "Incomplete"}
//               </span>
//             </div>
//             <div className="grid grid-cols-4 items-start gap-4">
//               <span className="text-md font-medium">Tags:</span>
//               {/* <div className="col-span-3 flex flex-wrap gap-2">
//                 {todo.tags.map((tag, index) => (
//                   <Badge 
//                     key={index} 
//                     className={todo.complete ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
//                   >
//                     {tag}
//                   </Badge>
//                 ))}
//               </div> */}
//             </div>
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// }
