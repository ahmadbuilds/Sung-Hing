'use client';
import Link from "next/link"
import {ChevronDown, Menu, X, User2,ShoppingCart } from "lucide-react"
import { useState,useEffect } from "react"
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState('');
  const {user}=useUser();
  const GetUserByEmail = useQuery(api.users.GetUserByEmail, user ? { email: user?.emailAddresses[0].emailAddress ?? "" } : "skip");
  const [isAdmin, setIsAdmin] = useState(false);
  
  const brands = useQuery(api.Brand.GetBrand);
  const recipes = useQuery(api.Recipe.GetRecipes);
  
  useEffect(() => {
    if (!user) return;

    if (GetUserByEmail?.isAdmin == true) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [GetUserByEmail, user]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setOpenDropdown('')
  }

  const toggleDropdown = (dropdown:string) => {
    setOpenDropdown(openDropdown === dropdown ? '' : dropdown)
  }

  return (
    <div className='w-full px-4 md:px-8 lg:px-14 py-3'>
      <div className="flex items-center justify-between"> 
        {/* Logo */}
        <div> 
          <img src={'/logo.webp'} alt="Logo Image" className="w-[60px] h-[60px] block "/>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center gap-4 lg:gap-9">
          <Link href={'/'} className="cursor-pointer hover:text-red-500 transition-colors text-base">Home</Link>
          <Link href={'/About'} className="cursor-pointer hover:text-red-500 transition-colors text-base">About Us</Link>
          
          {/* Simple Products Link */}
          <Link href={'/Product'} className="cursor-pointer hover:text-red-500 transition-colors text-base">Products</Link>
          
          {/* Brands Dropdown */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="text-base cursor-pointer m-0 p-0 border-none outline-none bg-transparent focus:outline-none focus:ring-0 flex items-center justify-center gap-1 hover:text-red-500 transition-colors">
              Brands <ChevronDown className="w-4 h-4"></ChevronDown>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black m-0 p-0 border-none outline-none shadow-lg">
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-red-500 cursor-pointer hover:text-white">
                <Link href={'/Brand'}>View All Brands</Link>
              </DropdownMenuItem>
              {brands?.map((brand) => (
                <DropdownMenuItem key={brand._id} className="hover:bg-red-500 cursor-pointer hover:text-white">
                  <Link href={`/Brand/${brand._id}`}>{brand.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Recipes Dropdown */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="text-base cursor-pointer m-0 p-0 border-none outline-none flex items-center justify-center gap-1 hover:text-red-500 transition-colors">
              Recipe <ChevronDown className="w-4 h-4"></ChevronDown>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black m-0 p-0 border-none outline-none shadow-lg">
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-red-500 cursor-pointer hover:text-white">
                <Link href={'/Recipe'}>View All Recipes</Link>
              </DropdownMenuItem>
              {recipes?.map((recipe) => (
                <DropdownMenuItem key={recipe._id} className="hover:bg-red-500 cursor-pointer hover:text-white">
                  <Link href={`/Recipe/${recipe._id}`}>{recipe.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href={'/Contact'} className="text-base cursor-pointer hover:text-red-500 transition-colors">Contact Us</Link>
        </div>

        {/* Right side icons */}
        <div className=" pl-5 flex items-center justify-center gap-4">
          {(!isAdmin && user)&&(
            <Link href={'/Cart'}><ShoppingCart className="w-5 h-5 text-gray-600 cursor-pointer hidden sm:block hover:text-red-500 transition-colors" /></Link>
          )}
          <Link className="hidden sm:block bg-red-500 px-5 py-2 rounded-md text-white border border-red-500 hover:text-red-500 hover:bg-transparent transition-colors duration-300 text-base" href={'/Categories'}>
            Shop Now
          </Link>
          <SignedOut>
            <SignInButton mode="modal">
              <User2 className="w-5 h-5 text-gray-500 cursor-pointer hover:text-red-500 transition-colors"/>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
          <div className="flex flex-col space-y-4 pt-4">
            <Link href={'/'} className="cursor-pointer hover:text-red-500 transition-colors px-2 py-1">Home</Link>
            <Link href={'/About'} className="cursor-pointer hover:text-red-500 transition-colors px-2 py-1">About Us</Link>
            
            {/* Simple Products Link for Mobile */}
            <Link href={'/Product'} className="cursor-pointer hover:text-red-500 transition-colors px-2 py-1">Products</Link>

            {/* Mobile Brands Dropdown */}
            <div>
              <button 
                onClick={() => toggleDropdown('brands')}
                className="flex items-center justify-between w-full text-left cursor-pointer hover:text-red-500 transition-colors px-2 py-1"
              >
                Brands 
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'brands' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'brands' && (
                <div className="ml-4 mt-2 space-y-2">
                  <Link href={'/Brand'} className="block cursor-pointer hover:text-red-500 transition-colors px-2 py-1 text-sm">View All Brands</Link>
                  {brands?.map((brand) => (
                    <Link key={brand._id} href={`/Brand/${brand._id}`} className="block cursor-pointer hover:text-red-500 transition-colors px-2 py-1 text-sm">
                      {brand.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Recipe Dropdown */}
            <div>
              <button 
                onClick={() => toggleDropdown('recipe')}
                className="flex items-center justify-between w-full text-left cursor-pointer hover:text-red-500 transition-colors px-2 py-1"
              >
                Recipe 
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'recipe' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'recipe' && (
                <div className="ml-4 mt-2 space-y-2">
                  <Link href={'/Recipe'} className="block cursor-pointer hover:text-red-500 transition-colors px-2 py-1 text-sm">View All Recipes</Link>
                  {recipes?.map((recipe) => (
                    <Link key={recipe._id} href={`/Recipe/${recipe._id}`} className="block cursor-pointer hover:text-red-500 transition-colors px-2 py-1 text-sm">
                      {recipe.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href={'/Contact'} className="cursor-pointer hover:text-red-500 transition-colors px-2 py-1">Contact Us</Link>
            
            {/* Mobile-only elements */}
            <div className="sm:hidden pt-2 border-t border-gray-100 mt-4">
              <Link className="block w-full bg-red-500 px-4 py-3 rounded-md text-white text-center border border-red-500 hover:text-red-500 hover:bg-transparent transition-colors duration-300 mb-3" href={'/Categories'}>
                Shop Now
              </Link>
              {(!isAdmin && user)&&(
                <Link className="block w-full bg-red-500 px-4 py-3 rounded-md text-white text-center border border-red-500 hover:text-red-500 hover:bg-transparent transition-colors duration-300 mb-3" href={'/Cart'}>
                  View Cart
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header