"use client"
import Link from "next/link"
import { Menu, Port, Search } from "./icon/iconApp"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar } from "./ui/avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { usePathname, useRouter } from "next/navigation"
import { siteConfig } from "@/configs/site"
import { useAuthStore } from "@/stores/AuthStore"
import { ToggleTheme } from '@/components/themes/ToggleTheme';
import { toast } from "sonner"


export const NavBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const isActive = (route: string) => pathname.includes(route);
    const {user} = useAuthStore();
    const userRole = user?.role.toLocaleLowerCase();
    const role = (userRole === "admin" || isActive("/admin")) ? siteConfig.navAdmin : (userRole === "rh" || isActive("/rh")) ? siteConfig.navRH : (userRole === "managers" || isActive("/manager")) ? siteConfig.navManager : siteConfig.navEmploye;

    const logout = useAuthStore((state) => state.logout);
    const handleLogout = () => {
        toast.success("Deconnexion reussie");
        logout();
        router.push('/authentification');
        // window.location.reload();
    }
    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                {
                    role.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`transition-colors hover:text-foreground 
                            ${isActive(item.href) ? 'text-foreground' : 'text-muted-foreground'}`
                            }
                        >
                            {item.label}
                        </Link>
                    ))
                }
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        {
                            role.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`transition-colors hover:text-foreground 
                                    ${isActive(item.href) ? 'text-foreground' : 'text-muted-foreground'}`
                                    }
                                >
                                    {item.label}
                                </Link>
                            ))
                        }
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <form className="ml-auto flex-1 sm:flex-initial">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                        />
                    </div>
                </form>
                <ToggleTheme />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <Avatar>
                                <AvatarImage src="/public/avatar.jpg" />
                                <AvatarFallback>A.H.</AvatarFallback>
                            </Avatar>
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Button variant="ghost" onClick={handleLogout}>
                                Logout
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}