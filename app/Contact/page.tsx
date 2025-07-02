'use client'
import React,{useState} from 'react'
import Image from 'next/image'
import { Carousel,CarouselItem,CarouselContent } from '@/components/ui/carousel'
import { HelpCircle,Send,HeadsetIcon } from 'lucide-react'
import { toast } from "sonner"
const Page = () => {
    const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    description: ''
});

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleTextAreaChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    toast("Successfully Submitted the Application");
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      description: ''
    });
    
  };
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
                    <h1 className="text-3xl md:text-6xl lg:text-8xl font-extrabold">Contact Us</h1>
                    <p className="text-base pt-5 md:p-10 ">Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
      {/* Cards Section */}
      <div className='px-4 md:px-8 lg:px-14 xl:pr-15 my-5 w-full grid grid-cols-1 lg:grid-cols-3 gap-5'>
        <div className='bg-red-100 flex flex-col items-center justify-center text-center gap-5 p-10 rounded-md'>
            <HelpCircle className='w-10 h-10 text-white p-2 bg-red-500 rounded-md'></HelpCircle>
            <h1 className='font-bold lg:text-2xl text-3xl'>General Inquiries</h1>
            <p className='text-justify text-base'>Have questions or need assistance? Reach out to us through our contact form, and we’ll be happy to help.</p>
        </div>
        <div className='bg-red-100 flex flex-col items-center justify-center  text-center gap-5 p-10 rounded-md'>
            <Send className='w-10 h-10 text-white p-2 bg-red-500 rounded-md'></Send>
            <h1 className='font-bold lg:text-2xl text-3xl'>Our Locations</h1>
            <p className='text-justify text-base'>Find a Sun Hing Foods location near you. We are strategically located to serve our customers efficiently and effectively.</p>
        </div>
        <div className='bg-red-100 flex flex-col items-center justify-center  text-center gap-5 p-10 rounded-md'>
            <HeadsetIcon className='w-10 h-10 text-white p-2 bg-red-500 rounded-md'></HeadsetIcon>
            <h1 className='font-bold lg:text-2xl text-3xl'>Customer Support</h1>
            <p className='text-justify text-base'>Our dedicated customer support team is here to assist you with any questions or concerns you may have.</p>
        </div>
      </div>
      <div className="w-full my-10 py-10  px-4 md:px-8 lg:px-14 xl:pr-15">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Information Sections */}
            <div className="hidden lg:flex flex-col items-center justify-center w-full lg:w-4/5 space-y-8">
              {/* New Customer Application Section */}
              <div className="">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  New Customer Application
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Interested in becoming a Sun Hing Foods customer? Download and 
                  complete our new customer application form, or submit it online for 
                  faster processing.
                </p>
              </div>

              {/* Catalogue Request Section */}
              <div className="">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Catalogue Request
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  To receive our latest catalog, simply enter your email, and we will send it 
                  directly to your inbox.
                </p>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-2xl">
              <h1 className="text-3xl lg:text-4xl font-bold text-red-600  text-center lg:text-start mb-8">
                Contact Form
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-base  font-medium text-gray-700 mb-2">
                      First name:
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-base  font-medium text-gray-700 mb-2">
                      Last name:
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      required
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                    />
                  </div>
                </div>

                {/* Email and Phone Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-base  font-medium text-gray-700 mb-2">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      required
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-base  font-medium text-gray-700 mb-2">
                      Phone:
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      required
                      onChange={handleInputChange}
                      pattern="^[\+]?[0-9\s\(\)\-]+$"
                      placeholder="+1 234-567-8901"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div>
                  <label htmlFor="description" className="block text-base font-medium text-gray-700 mb-2">
                    Description:
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    required
                    onChange={handleTextAreaChange}
                    placeholder="Message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 resize-vertical"
                  />
                </div>

                <div className="text-center lg:text-start">
                  <button
                    type="submit"
                    className="text-white cursor-pointer  bg-red-500 px-5 py-2 rounded-md border border-red-500 hover:bg-red-600 transition-colors duration-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
