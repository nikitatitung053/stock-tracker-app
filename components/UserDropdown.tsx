// 'use client';
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { useRouter } from "next/navigation"
// import { LogOut } from "lucide-react";
// import NavItems from "./Navitems";
// import { signOut as signOutAction } from "@/lib/actions/auth.actions";

// const UserDropdown = ({ user,initialStocks }: { user:User,initialStocks:StockWithWatchlistStatus[] }) => {

//   const router = useRouter();
//   const handleSignout = async () => {
//     await signOutAction();
//     router.push("/sign-in");
//   }

//   const displayName = user?.name?.trim() || "User";
//   const displayEmail = user?.email?.trim() || "";
//   const fallbackInitial = displayName[0]?.toUpperCase() || "?";


//   return (
//    <DropdownMenu>
//   <DropdownMenuTrigger asChild>
//     <Button variant="ghost"className="flex items-center gap-3 text-gray-4 hover:text-yellow-500">

//       <Avatar className="h-8 w-8">
//   <AvatarImage src="https://github.com/shadcn.png" />
//   <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
//     {fallbackInitial}
//   </AvatarFallback>
// </Avatar>

// <div className="hidden md:flex flex-col items-start">
//   <span className="text-base font-medium text-gray-400">
//     {displayName}
//   </span>
// </div>
//     </Button>
//   </DropdownMenuTrigger>

//   <DropdownMenuContent className="text-gray-400">
//     <DropdownMenuLabel>
//       <div className="flex relative items-center gap 3 py-2">
//       <Avatar className="h-10 w-10">
//   <AvatarImage src="https://github.com/shadcn.png" />
//   <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
//     {fallbackInitial}
//   </AvatarFallback>
// </Avatar>

// <div className="flex flex-col">
//   <span className="text-base font-medium text-gray-400">
//     {displayName}
//   </span>
//   {displayEmail ? (
//     <span className="texts-m text-gray-500">{displayEmail}</span>
//   ) : null}
// </div>

//     </div>

//     </DropdownMenuLabel>
//     <DropdownMenuSeparator className="bg-gray-600"/>
//         <DropdownMenuItem onClick={handleSignout}className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition:colors cursor-pointer">
//           <LogOut className="h-4 w-4 mr-2 hidden sm:block"/>
//           Logout

//         </DropdownMenuItem>
//         <DropdownMenuSeparator className="hidden sm:block bg-gray-600"/>
//         <nav className="sm:hidden">
//         <NavItems initialStocks={initialStocks}/>
//         </nav>
   
//   </DropdownMenuContent>
// </DropdownMenu>
//   )
// }

// export default UserDropdown


'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  Briefcase,
  Bell,
  CreditCard,
  Moon,
  Sun,
  Shield,
  KeyRound,
} from "lucide-react";

import { useTheme } from "next-themes";
import NavItems from "./Navitems";
import { signOut as signOutAction } from "@/lib/actions/auth.actions";

interface Props {
  user: User;
  initialStocks: StockWithWatchlistStatus[];
}

const UserDropdown = ({ user, initialStocks }: Props) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleSignout = async () => {
    await signOutAction();
    router.push("/sign-in");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const displayName = user?.name?.trim() || "User";
  const displayEmail = user?.email?.trim() || "";
  const fallbackInitial = displayName[0]?.toUpperCase() || "?";
  const userImage = user?.image || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 hover:text-yellow-500"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage} />
            <AvatarFallback className="bg-yellow-500 text-yellow-900 font-bold">
              {fallbackInitial}
            </AvatarFallback>
          </Avatar>

          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium">
              {displayName}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        {/* USER INFO */}
        <DropdownMenuLabel>
          <div className="flex items-center gap-3 py-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userImage} />
              <AvatarFallback className="bg-yellow-500 text-yellow-900 font-bold">
                {fallbackInitial}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="font-medium">{displayName}</span>
              {displayEmail && (
                <span className="text-sm text-muted-foreground">
                  {displayEmail}
                </span>
              )}
              {user?.plan && (
                <span className="text-xs text-yellow-500 font-medium">
                  {user.plan} Plan
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* MAIN NAVIGATION */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/portfolio")}>
            <Briefcase className="mr-2 h-4 w-4" />
            Portfolio
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/notifications")}>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* ACCOUNT */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/billing")}>
            <CreditCard className="mr-2 h-4 w-4" />
            Subscription
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/change-password")}>
            <KeyRound className="mr-2 h-4 w-4" />
            Change Password
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* ADMIN SECTION */}
        {user?.role === "ADMIN" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin")}>
              <Shield className="mr-2 h-4 w-4 text-red-500" />
              Admin Panel
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        {/* THEME TOGGLE */}
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === "dark" ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              Dark Mode
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* MOBILE NAV ITEMS */}
        <nav className="sm:hidden">
          <NavItems initialStocks={initialStocks} />
        </nav>

        <DropdownMenuSeparator className="sm:hidden" />

        {/* LOGOUT */}
        <DropdownMenuItem
          onClick={handleSignout}
          className="text-red-500 focus:text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
