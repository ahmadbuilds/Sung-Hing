import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  ArrowRightSquare
} from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-black px-6 md:px-10 py-10 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Logo + Description */}
        <div className="flex flex-col gap-4">
          <Image
            src="/logo.png"
            alt="Business Logo"
            width={150}
            height={150}
            priority
          />
          <p className="text-sm text-gray-300 leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.
          </p>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-lg mb-1">Support</h4>
          <p className="text-sm text-gray-400">6633 Washington Ave, Houston, Texas</p>
          <p className="text-sm text-gray-400">exclusive@gmail.com</p>
          <p className="text-sm text-gray-400">+88015-88888-9999</p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-lg mb-1">Quick Links</h4>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">About</Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">Product</Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">My Account</Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">Contact Us</Link>
        </div>

        {/* Policies */}
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-lg mb-1">Policies</h4>
          <p className="text-sm text-gray-400">News Letter</p>
          <p className="text-sm text-gray-400">Privacy Policy</p>
          <p className="text-sm text-gray-400">Terms of Service</p>
          <p className="text-sm text-gray-400">Cookie Policy</p>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-lg">Newsletter</h4>
          <p className="text-sm text-gray-400">Get 10% off your first order</p>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter your Email"
              className="w-full bg-black border border-gray-400 text-sm text-white py-2 pl-3 pr-10 rounded-md placeholder:text-gray-400 focus:border-red-500 focus:outline-none"
            />
            <Link href="/">
              <ArrowRightSquare className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white hover:text-red-500" />
            </Link>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Link href="/"><Facebook className="w-5 h-5 hover:text-red-500" /></Link>
            <Link href="/"><Instagram className="w-5 h-5 hover:text-red-500" /></Link>
            <Link href="/"><Twitter className="w-5 h-5 hover:text-red-500" /></Link>
            <Link href="/"><Youtube className="w-5 h-5 hover:text-red-500" /></Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
