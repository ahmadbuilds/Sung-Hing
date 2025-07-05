'use client';
import React from 'react'
import { Carousel,CarouselItem,CarouselContent } from '@/components/ui/carousel'
import Image from 'next/image'
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Leaf,MenuSquareIcon,Sprout } from 'lucide-react';
import { ProductItem } from '@/components/ProductItem';

const Page = () => {
    const params=useParams();
    const BrandId=params.id as Id<"Brand">;
    const brand=useQuery(api.Brand.GetBrandById,{id:BrandId});
    const Product=useQuery(api.Product.GetProductByBrandId,{id:BrandId});
    const featuredProducts = Product?.slice(0, 4) || [];

  return (
    <div>
      <div className="w-full  h-[65vh] md:h-[55vh] lg:h-[75vh] custom-height relative overflow-hidden">
        <Carousel className="w-full h-full relative">
          <CarouselContent className="w-full h-full ml-0 cursor-pointer hover:text-red-500">
            <CarouselItem className="relative w-full h-[65vh] md:h-[55vh] lg:h-[75vh] custom-height pl-0">
              <div className="h-full w-full relative z-0">
                <Image src={'/slider.webp'} alt="Slider" fill priority className="object-cover"/>
              </div>
              <div className="absolute inset-0 bg-black/60 z-20 w-full h-full"></div>
              <div className="absolute inset-0 flex items-center justify-center text-center w-full h-full z-30 text-white">
                <div className="bg-black/10 p-20 w-full h-full items-center justify-center flex flex-col">
                  <div className="">
                    <h1 className="text-3xl md:text-6xl lg:text-8xl font-extrabold">{brand?.name}</h1>
                    <p className="text-base pt-5 md:p-10 ">{brand?.description}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>

      <div className='px-4 md:px-8 lg:px-14 xl:pr-15 my-10 w-full'>
        <div className='flex flex-col items-center justify-center gap-10 w-full'>
            <h1 className='text-4xl xl:text-6xl font-bold text-center '>
                Lorem Ipsum
            </h1>
            <p className='text-base text-center'>Sun Hing Foods began with a passion for quality and a commitment to community, growing from its roots into a trusted name in the <br/>food industry, serving diverse cultures across North America.</p>
            <div className='flex flex-wrap items-center justify-center gap-5'>
              <div className='bg-red-500 flex flex-col items-center gap-2 justify-center rounded-lg py-10 px-20'>
                <Sprout className='w-10 h-10 text-white'></Sprout>
                <p className='text-xl text-white font-bold'>100%</p>
                <p  className='text-xl text-white font-bold'>Natural</p>
              </div>
              <div className='bg-red-500 flex flex-col items-center gap-2 justify-center rounded-lg py-10 px-20'>
                <Leaf className='w-10 h-10 text-white'></Leaf>
                <p className='text-xl text-white font-bold'>100%</p>
                <p  className='text-xl text-white font-bold'>Organic</p>
              </div>
              <div className='bg-red-500 flex flex-col items-center gap-2 justify-center rounded-lg py-10 px-18'>
                <MenuSquareIcon className='w-10 h-10 text-white'></MenuSquareIcon>
                <p className='text-xl text-white font-bold'>Menu</p>
                <p  className='text-xl text-white font-bold'>essentials</p>
              </div>
            </div>
        </div>
      </div>

      {/* Featured Product */}
      <div className='px-4 md:px-8 lg:px-14 xl:pr-15 my-10 w-full'>
        <div className='flex flex-col items-center justify-center gap-10 w-full'>
            <h1 className='text-4xl xl:text-6xl font-bold text-center'>
                Our Featured Products
            </h1>
            <p className='text-base text-center'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            
            {/* Products Grid */}
            <div className='my-5 w-full flex flex-wrap gap-5 items-center justify-center'>
              {featuredProducts && featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <div key={product._id} className="w-full md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)]">
                    <ProductItem product={product}/>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8">
                  <p className="text-gray-500">No categories found.</p>
                </div>
              )}
            </div>
            
            {/* View All Products Button */}
            {Product && Product.length > 4 && (
              <Link 
                href={`/Products?brand=${BrandId}`}
                className="bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 transition-colors duration-300"
              >
                View All Products ({Product.length})
              </Link>
            )}
        </div>
      </div>

      {/* Images */}
      <div className="w-full relative">
  <div className="w-full h-[65vh] md:h-[50vh] lg:h-[75vh] relative custom-height overflow-hidden">
    {/* Background Image */}
    <Image
      src="/p2.webp"
      alt="Feature Background"
      fill
      className="object-cover object-center"
      priority
    />

    {/* Foreground Image - right side & blended */}
    <div className="absolute  xl:-top-[30%] xl:right-0 flex justify-end items-center pointer-events-none">
      <Image
        src="/p1.webp"
        alt="Feature Accent"
        width={1000}
        height={1000}
        className="object-cover mix-blend-plus-lighter xl:mix-blend-lighten  xl:opacity-100 -translate-x-0 -scale-x-100 max-h-max w-full xl:w-auto "
        priority
      />
    </div>

    {/* Optional Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-l from-black/30 to-transparent"></div>
  </div>

  {/* Text Content */}
  <div className="absolute top-1/4 lg:left-[2%] px-4 md:px-8 lg:pr-10 space-y-3 lg:w-[48%] items-center lg:items-start md:items-center w-full flex flex-col gap-3 text-white z-20">
    <h1 className="font-bold text-4xl xl:text-6xl">Lorem Ipsum</h1>
    <p className="text-sm sm:text-base xl:text-md leading-relaxed text-justify text-gray-100 line-clamp-6">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
    </p>
    <Link
      href="/"
      className="bg-red-500 px-5 py-2 rounded-md border border-red-500 hover:bg-transparent transition-colors duration-300"
    >
      Learn More
    </Link>
  </div>
</div>

     <div className="w-full relative">
        <div className="w-full h-[65vh] md:h-[50vh] lg:h-[75vh] custom-height relative ">
          <Image src={'/p4.webp'} alt="Feature Image" fill className=" object-cover object-[5%_center] w-full" priority/>
        </div>
        <div className=" top-1/4 lg:right-[2%]  px-4 md:px-8 lg:pr-10 absolute space-y-3 lg:w-[48%]  items-center lg:items-start md:items-center w-full flex flex-col gap-3 text-black">
          <h1 className="font-bold  text-4xl  xl:text-6xl">Lorem Ipsum</h1>
          <p className="text-sm sm:text-base xl:text-md leading-relaxed text-justify  text-black line-clamp-6 ">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
          <Link href={'/'} className=" text-white hover:text-red-500 bg-red-500 px-5 py-2 rounded-md border border-red-500 hover:bg-transparent transition-colors duration-300">Learn More</Link>
        </div> 
      </div>
    </div>
  )
}

export default Page