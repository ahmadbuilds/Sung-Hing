import React from 'react'
import { Carousel,CarouselItem,CarouselContent } from '@/components/ui/carousel'
import Image from 'next/image'
import { Star } from 'lucide-react'
const About = () => {
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
                    <h1 className="text-3xl md:text-6xl lg:text-8xl font-extrabold">About Us</h1>
                    <p className="text-base pt-5 md:p-10 ">We Probably distribute products from a wide array of renowned brands</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
      {/* Our Story section */}
      <div className='px-4 md:px-8 lg:px-14 xl:pr-15 my-10 w-full'>
        <div className='flex flex-col items-center justify-center gap-10 w-full'>
            <h1 className='text-3xl  lg:text-6xl font-bold'>
                Our Story
            </h1>
            <p className='text-base text-center'>Sun Hing Foods began with a passion for quality and a commitment to community, growing from its roots into a trusted name in the <br/>food industry, serving diverse cultures across North America.</p>
            <Image src={'/about.webp'} alt='About section image' width={500} height={500} priority className='object-cover w-full rounded-md max-h-[500px]'></Image>
        </div>
        <div className='my-5 w-full grid grid-cols-1 lg:grid-cols-3 gap-5'>
            <div className='flex flex-col items-center justify-center lg:items-start gap-5 lg:py-5 '>
                <h1 className='font-bold  text-3xl'>Our Mission</h1>
                <p className='text-justify text-base'>Our mission is to enrich lives through authentic and high-quality Asian food products, making them accessible to households and businesses across the globe.</p>
            </div>
            <div className='flex flex-col items-center justify-center  lg:items-start gap-5 lg:py-5'>
                <h1 className='font-bold text-3xl'>Our Vision</h1>
                <p className='text-justify text-base'>Our mission is to enrich lives through authentic and high-quality Asian food products, making them accessible to households and businesses across the globe.</p>
            </div>
            <div className='flex flex-col items-center justify-center lg:items-start gap-5 lg:py-5'>
                <h1 className='font-bold  text-3xl'>Distribution Map</h1>
                <p className='text-justify text-base'>See how our products reach every corner of the globe through our extensive distribution network. Our commitment to quality ensures that no matter where you are, you can enjoy the best that Sun Hing Foods has to offer.</p>
            </div>
        </div>
      </div>
        {/* Our Approach Section */}
        <div className='px-4 md:px-8 lg:px-14 xl:pr-15 my-10 py-10 w-full bg-gray-100'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 justify-center items-center'>
                <Image src={'/tracter.webp'} alt='Tracter Image' width={700} height={700} priority className='rounded-md object-cover w-full max-w-full '></Image>
                <div className='flex flex-col items-center lg:items-start justify-center gap-4'>
                    <h1 className='font-bold text-3xl lg:text-6xl'>Our Approach</h1>
                    <p className='text-base text-justify'>
                        At Sun Hing Foods, we believe in a holistic approach to food distribution. Our focus is on quality, sustainability, and customer satisfaction.
                    </p>
                </div>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 justify-center items-center mt-10'>
                <div className='hidden lg:flex flex-col items-center lg:items-start justify-center gap-4'>
                    <h1 className='font-bold text-3xl lg:text-6xl'>Sustainability</h1>
                    <p className='text-base text-justify'>
                        We are dedicated to sustainability in every step of our process—from sourcing to packaging. Learn more about how we’re making a positive impact on the planet.
                    </p>
                </div>
                <Image src={'/left.webp'} alt='Left Image' width={700} height={700} priority className='object-cover rounded-md w-full max-w-full '></Image>
                <div className='flex lg:hidden flex-col items-center lg:items-start justify-center gap-4'>
                    <h1 className='font-bold text-3xl lg:text-6xl'>Sustainability</h1>
                    <p className='text-base text-justify'>
                        We are dedicated to sustainability in every step of our process—from sourcing to packaging. Learn more about how we’re making a positive impact on the planet.
                    </p>
                </div>
            </div>
        </div>
        {/* Testimonials Section */}
        <div className='px-4 md:px-8 lg:px-14 xl:pr-15 mt-10 py-10 w-full bg-gray-100'>
            <div className='flex flex-col items-center justify-center gap-3'>
                <h1 className='text-3xl lg:text-6xl font-bold'>
                    Testimonials
                </h1>
                <p className='text-base text-justify'>Don&apos;t take our word for it. Trust our Customers</p>
            </div>
            <div className='my-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                <div className='bg-white flex flex-col items-center md:items-start justify-center md:justify-start text-center gap-5 py-10 px-5 rounded-md'>
                    <div className='flex justify-center md:justify-between items-center w-full gap-5'>
                        <Image src={'/test1.webp'} alt='Test 1 image' width={50} height={50} className='object-cover'></Image>
                        <div className='hidden md:flex items-center'>
                            {
                                [...Array(5)].map((_,index)=>{
                                    const startValue=index+1;
                                    return(
                                        <Star key={startValue} fill='red' className='w-5 h-5 text-red-500'></Star>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='flex md:hidden items-center'>
                            {
                                [...Array(5)].map((_,index)=>{
                                    const startValue=index+1;
                                    return(
                                        <Star key={startValue} fill='red' className='w-5 h-5 text-red-500'></Star>
                                    )
                                })
                            }
                    </div>
                    <h1 className='font-bold text-3xl'>Floyd Miles</h1>
                    <p className='text-justify text-base'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
                </div>
                <div className='bg-white flex flex-col items-center md:items-start justify-center md:justify-start text-center gap-5 py-10 px-5 rounded-md'>
                    <div className='flex justify-center md:justify-between items-center w-full gap-5'>
                        <Image src={'/test2.webp'} alt='Test 3 image' width={50} height={50} className='object-cover'></Image>
                        <div className='hidden md:flex items-center'>
                            {
                                [...Array(5)].map((_,index)=>{
                                    const startValue=index+1;
                                    return(
                                        <Star key={startValue} fill={startValue>=3? "none":"red"} className='w-5 h-5 text-red-500'></Star>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='flex md:hidden items-center'>
                            {
                                [...Array(5)].map((_,index)=>{
                                    const startValue=index+1;
                                    return(
                                        <Star key={startValue} fill={startValue>=3? "none":"red"} className='w-5 h-5 text-red-500'></Star>
                                    )
                                })
                            }
                    </div>
                    <h1 className='font-bold text-3xl'>Ronald Richards</h1>
                    <p className='text-justify text-base'>ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
                </div>
                <div className='bg-white flex flex-col items-center md:items-start justify-center md:justify-start  text-center gap-5 py-10 px-5 rounded-md'>
                    <div className='flex justify-center md:justify-between items-center w-full gap-5'>
                        <Image src={'/test3.webp'} alt='Test 3 image' width={50} height={50} className='object-cover'></Image>
                        <div className='hidden md:flex items-center'>
                            {
                                [...Array(5)].map((_,index)=>{
                                    const startValue=index+1;
                                    return(
                                        <Star key={startValue} fill={startValue>=5? "none":"red"} className='w-5 h-5 text-red-500'></Star>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='flex md:hidden items-center'>
                            {
                                [...Array(5)].map((_,index)=>{
                                    const startValue=index+1;
                                    return(
                                        <Star key={startValue} fill={startValue>=5? "none":"red"} className='w-5 h-5 text-red-500'></Star>
                                    )
                                })
                            }
                    </div>
                    <h1 className='font-bold text-3xl'>Savannah Nguyen</h1>
                    <p className='text-justify text-base'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
                </div>
            </div>
        </div>

    </div>
  )
}

export default About
