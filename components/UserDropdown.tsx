'use client';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react";
import NavItems from "./Navitems";
import { signOut as signOutAction } from "@/lib/actions/auth.actions";

const UserDropdown = ({ user }: { user: User }) => {

  const router = useRouter();
  const handleSignout = async () => {
    await signOutAction();
    router.push("/sign-in");
  }

  const displayName = user?.name?.trim() || "User";
  const displayEmail = user?.email?.trim() || "";
  const fallbackInitial = displayName[0]?.toUpperCase() || "?";


  return (
   <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost"className="flex items-center gap-3 text-gray-4 hover:text-yellow-500">

      <Avatar className="h-8 w-8">
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
    {fallbackInitial}
  </AvatarFallback>
</Avatar>

<div className="hidden md:flex flex-col items-start">
  <span className="text-base font-medium text-gray-400">
    {displayName}
  </span>
</div>
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent className="text-gray-400">
    <DropdownMenuLabel>
      <div className="flex relative items-center gap 3 py-2">
      <Avatar className="h-10 w-10">
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
    {fallbackInitial}
  </AvatarFallback>
</Avatar>

<div className="flex flex-col">
  <span className="text-base font-medium text-gray-400">
    {displayName}
  </span>
  {displayEmail ? (
    <span className="texts-m text-gray-500">{displayEmail}</span>
  ) : null}
</div>

    </div>

    </DropdownMenuLabel>
    <DropdownMenuSeparator className="bg-gray-600"/>
        <DropdownMenuItem onClick={handleSignout}className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition:colors cursor-pointer">
          <LogOut className="h-4 w-4 mr-2 hidden sm:block"/>
          Logout

        </DropdownMenuItem>
        <DropdownMenuSeparator className="hidden sm:block bg-gray-600"/>
        <nav className="sm:hidden">
        <NavItems/>
        </nav>
   
  </DropdownMenuContent>
</DropdownMenu>
  )
}

export default UserDropdown