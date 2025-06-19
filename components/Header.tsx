'use client';
import Image from "next/image"
import Link from "next/link"
import { Search, User2, ArrowDown, Menu, X } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState('')

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setOpenDropdown('')
  }

  const toggleDropdown = (dropdown:string) => {
    setOpenDropdown(openDropdown === dropdown ? '' : dropdown)
  }

  return (
    <div className='w-full px-1 sm:px-10 py-3'>
      <div className="flex items-center justify-between"> 
        {/* Logo */}
        <Image src={'/logo.png'} alt="Logo Image" width={100} height={100}/>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href={'/'} className="cursor-pointer hover:text-red-500 transition-colors">Home</Link>
          <Link href={'/'} className="cursor-pointer hover:text-red-500 transition-colors">About Us</Link>
          
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="cursor-pointer m-0 p-0 border-none outline-none bg-transparent focus:outline-none focus:ring-0 flex items-center justify-center gap-1 hover:text-red-500 transition-colors">
              Products <ArrowDown className="w-4 h-4"></ArrowDown>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black m-0 p-0 border-none outline-none shadow-lg">
              <DropdownMenuLabel>Product Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-red-500 cursor-pointer hover:text-white">Coconut Products</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-red-500 cursor-pointer hover:text-white">Rice</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-red-500 cursor-pointer hover:text-white">Canned Meat</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-red-500 cursor-pointer hover:text-white">Canned SeaFood</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-red-500 cursor-pointer hover:text-white">Dried Mushroom/Fungus</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="cursor-pointer m-0 p-0 border-none outline-none flex items-center justify-center gap-1 hover:text-red-500 transition-colors">
              Brands <ArrowDown className="w-4 h-4"></ArrowDown>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black m-0 p-0 border-none outline-none shadow-lg">
              <DropdownMenuLabel>Brands Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-red-500 cursor-pointer hover:text-white">Black and White</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-red-500 cursor-pointer hover:text-white">Parrot</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-red-500 cursor-pointer hover:text-white">Longevity Brand</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="cursor-pointer m-0 p-0 border-none outline-none flex items-center justify-center gap-1 hover:text-red-500 transition-colors">
              Recipe <ArrowDown className="w-4 h-4"></ArrowDown>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black m-0 p-0 border-none outline-none shadow-lg">
              <DropdownMenuLabel>Recipe Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-red-500 cursor-pointer hover:text-white">Black and White</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-red-500 cursor-pointer hover:text-white">Parrot</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-red-500 cursor-pointer hover:text-white">Longevity Brand</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href={'/'} className="cursor-pointer hover:text-red-500 transition-colors">Contact Us</Link>
        </div>

        {/* Right side icons */}
        <div className="flex items-center justify-center gap-4">
          <Search className="w-5 h-5 text-gray-600 cursor-pointer hidden sm:block hover:text-red-500 transition-colors" />
          <Link className="hidden sm:block bg-red-500 px-3 md:px-5 py-2 rounded-md text-white border border-red-500 hover:text-red-500 hover:bg-transparent transition-colors duration-300 text-sm md:text-base" href={'/'}>
            Shop Now
          </Link>
          <User2 className="w-5 h-5 text-gray-500 cursor-pointer hover:text-red-500 transition-colors"/>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden p-2"
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
            <Link href={'/'} className="cursor-pointer hover:text-red-500 transition-colors px-2 py-1">About Us</Link>
            
            {/* Mobile Products Dropdown */}
            <div>
              <button 
                onClick={() => toggleDropdown('products')}
                className="flex items-center justify-between w-full text-left cursor-pointer hover:text-red-500 transition-colors px-2 py-1"
              >
                Products 
                <ArrowDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'products' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'products' && (
                <div className="ml-4 mt-2 space-y-2">
                  <Link href={'/'} className="block cursor-pointer hover:text-red-500 transition-colors px-2 py-1 text-sm">Coconut Products</Link>
                  <Link href={'/'} className="block cursor-pointer hover:text-red-500 transition-colors px-2 py-1 text-sm">Rice</Link>
                  <Link href={'/'} className="block cursor-pointer hover:text-red-500 transition-colors px-2 py-1 text-sm">Canned Meat</Link>
                  <Link href={'/'} className="block cursor-pointer hover:text-red-500 transition-colors px-2 py-1 text-sm">Canned SeaFood</Link>
                  <Link href={'/'} className="block cursor-pointer hover:text-red-500 transition-colors px-2 py-1 text-sm">Dried Mushroom/Fungus</Link>
                </div>
              )}
            </div>

            {/* Mobile Brands Dropdown */}
            <div>
              <button 
                onClick={() => toggleDropdown('brands')}
                className="flex items-center justify-between w-full text-left cursor-pointer hover:text-red-500 transition-colors px-2 py-1"
              >
                Brands 
                <ArrowDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'brands' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'brands' && (
                <div className="ml-4 mt-2 space-y-2">
                  <Link href={'/'} className="block cursor-pointer hover:text-red-500 transition-colors px-2 py-1 text-sm">Black and White</Link>
                  <Link href={'/'} className="block cursor-pointer hover:text-red-500 transition-colors px-2 py-1 text-sm">Parrot</Link>
                  <Link href={'/'} className="block cursor-pointer hover:text-red-500 transition-colors px-2 py-1 text-sm">Longevity Brand</Link>
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
                <ArrowDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'recipe' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'recipe' && (
                <div className="ml-4 mt-2 space-y-2">
                  <Link href={'/'} className="block cursor-pointer hover:text-red-500 transition-colors px-2 py-1 text-sm">Black and White</Link>
                  <Link href={'/'} className="block cursor-pointer hover:text-red-500 transition-colors px-2 py-1 text-sm">Parrot</Link>
                  <Link href={'/'} className="block cursor-pointer hover:text-red-500 transition-colors px-2 py-1 text-sm">Longevity Brand</Link>
                </div>
              )}
            </div>

            <Link href={'/'} className="cursor-pointer hover:text-red-500 transition-colors px-2 py-1">Contact Us</Link>
            
            {/* Mobile-only elements */}
            <div className="sm:hidden pt-2 border-t border-gray-100 mt-4">
              <Link className="block w-full bg-red-500 px-4 py-3 rounded-md text-white text-center border border-red-500 hover:text-red-500 hover:bg-transparent transition-colors duration-300 mb-3" href={'/'}>
                Shop Now
              </Link>
              <div className="flex items-center gap-2 px-2 py-1">
                <Search className="w-5 h-5 text-gray-600 cursor-pointer" />
                <span className="text-gray-600 text-sm">Search</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header