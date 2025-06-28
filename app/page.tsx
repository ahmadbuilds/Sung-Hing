import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
export default function Home() {
  return (
    <div>
      {/* Image Slider */}
      <div className="w-full  h-[65vh] md:h-[55vh] lg:h-[75vh] custom-height relative overflow-hidden">
        <Carousel className="w-full h-full relative">
          <CarouselContent className="w-full h-full ml-0 cursor-pointer hover:text-red-500">
            <CarouselItem className="relative w-full h-[65vh] md:h-[55vh] lg:h-[75vh] custom-height pl-0">
              <div className="h-full w-full relative z-0">
                <Image src={'/slider.webp'} alt="Slider" fill priority className="object-cover"/>
              </div>
              <div className="absolute inset-0 bg-black/60 z-20 w-full h-full"></div>
              <div className="absolute inset-0 flex items-center justify-center text-center w-full h-[65vh] md:h-[55vh] lg:h-[75vh] custom-height z-30 text-white">
                <div className="bg-red-500/15 p-20 w-full">
                  <CarouselPrevious  className="absolute top-1/2 left-[14px] md:left-[45px] -translate-y-1/2 z-10"/>
                  <div className="">
                    <h1 className="text-3xl md:text-6xl lg:text-8xl font-extrabold">Introducing <br></br>MarketPlace</h1>
                    <p className="text-xs md:text-base pt-5 md:p-10 ">Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.</p>
                  </div>
                  <CarouselNext  className="absolute top-1/2 right-[14px] md:right-[45px] -translate-y-1/2 z-10 cursor-pointer hover:text-red-500"/>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
      {/* Fresh Roots Page */}
      {/* <div className="w-full md:max-w-[calc(100vw-45px)] mb-10 mx-auto h-auto xl:h-[75hv] relative p-4 md:p-4  lg:p-10">
        <div className="w-full flex flex-col xl:flex-row items-center justify-center gap-10 h-full">
    
        <div className="relative flex-shrink-0">
            <Image
            src={'/tracter.webp'}
            alt="tractor image"
            width={900}
            height={900}
            className="object-cover rounded-lg xl:w-[700px] xl:h-[600px] w-full"
          /> */}

          {/* Only visible on xl+ */}
          {/* <div className="hidden xl:flex absolute top-0 right-[-60%] z-10 w-full bg-white justify-between p-6 rounded-bl-3xl gap-4 items-center">
            <h1 className="text-7xl font-bold leading-tight">
              Fresh From <br /> the Roots
            </h1>
            <Image src={'/logo1.webp'} alt="Logo image" width={120} height={120}/>
          </div>
        </div> */}

        {/* Text Block */}
        {/* <div className="w-full xl:w-auto flex flex-col justify-center xl:items-start items-center gap-4 xl:pt-60 text-justify">
       */}
        {/* Title block for all screens except xl */}
        {/* <div className=" xl:hidden bg-white p-4 rounded-2xl shadow-md w-full flex  justify-center items-center gap-3">
          <h1 className="text-lg  lg:text-4xl font-bold text-center">
            Fresh From the Roots
          </h1>
          <Image src={'/logo1.webp'} alt="Logo image" width={100} height={100} />
        </div> */}

        {/* <p className="text-sm sm:text-base xl:text-md leading-relaxed">
          Fresh food and fresh ideas are at the heart of food and service. Sun Hing delivers exceptional produce, custom cuts of meat, high-quality seafood, and imported foods offering global flavors.
          <br /><br />
          Our network of specialty suppliers pairs well with our culinary and business expertise. Sun Hing’s unparalleled selection of innovative ingredients and cutting-edge products connects your business to the industry-leading distribution network — keeping you stocked with the freshest products, trends, and ideas.
        </p> */}

        {/* <div>
          <Link
            href="/"
            className=" inline-block text-white hover:text-red-400 bg-red-500 px-5 py-2 rounded-md border border-red-500 hover:bg-transparent transition-colors duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  </div> */}
      {/* Fresh from the roots */}
      <div className="w-full  h-auto px-4 md:px-0 md:grid md:grid-cols-3 items-center mt-8 mb-4 md:mb-0 md:gap-9 lg:gap-16">
        <div className="hidden items-center justify-start  md:flex">
          <Image src={'/right.webp'} width={700} height={700} alt="right Image" className="w-full md:max-w-[285px] lg:max-w-[500px] xl:max-w-[700px] h-auto aspect-square object-cover rounded-tr-full rounded-br-full"></Image>
        </div>
        <div className="flex flex-col items-center justify-center gap-5 xl:px-4">
          <Image src={'/logo.webp'} alt="Logo Image" width={60} height={60}></Image>
            <h1 className="text-4xl xl:text-5xl font-bold  text-center">Fresh From the Roots</h1>
            <p className="text-sm sm:text-base xl:text-md text-justify">
            Fresh food and fresh ideas are at the heart of food and service. Sun Hing delivers exceptional produce, custom cuts of meat, high-quality seafood, and imported foods offering global flavors.
            <br /><br/>
            Our network of specialty suppliers pairs well with our culinary and business expertise. Sun Hing’s unparalleled selection of innovative ingredients and cutting-edge products connects your business to the industry-leading distribution network — keeping you stocked with the freshest products, trends, and ideas.
            </p>
            <Link
            href="/"
            className=" inline-block text-white hover:text-red-400 bg-red-500 px-5 py-2 rounded-md border border-red-500 hover:bg-transparent transition-colors duration-300"
          >
            Learn More
          </Link>
        </div>
        <div className="hidden md:flex items-center justify-end h-full">
          <Image src={'/left.webp'}  width={500}  height={500} alt="left Image" className="object-cover h-auto w-full md:max-w-[285px] lg:max-w-[500px] xl:max-w-[700px] aspect-square rounded-tl-full rounded-bl-full "></Image>
        </div>
      </div>

      {/* Sustaining Explanation */}
      <div className="w-full h-[65vh] md:h-[50vh] lg:h-[100vh] custom-height relative overflow-hidden">
        {/* Cloud Background Section */}
        <div className="w-full h-full relative">
          <Image 
            src={'/clouds.webp'} 
            alt="Cloud Image" 
            fill 
            priority 
            className="object-cover"
          />
          <div className="hidden md:block absolute inset-0 bg-[linear-gradient(to_bottom,white_20%,transparent_100%,white_100%)]" />
          <div className="md:hidden block absolute inset-0 bg-[linear-gradient(to_bottom,white_5%,transparent_100%,white_100%)]" />
        </div>
        
        {/* Content Overlay - Main Content */}
        <div className=" top-0 left-0 absolute flex flex-col justify-center px-4 md:p-8  text-center lg:px-15  items-center gap-3 w-full h-full ">
            <h1 className="text-4xl xl:text-6xl font-bold  mb-10">Sustaining Our Future</h1>
            <p className="text-sm sm:text-base xl:text-md leading-relaxed text-justify">​​​​​​Sun Hing has a passion for helping others. We proudly partner with more local ranchers, growers, and producers than any distributor in the industry. We support farm to table initiatives to deliver the best products from anywhere, to everywhere. Sun Hing has partnerships with food banks and other hunger relief organizations to invest in the needs of diverse communities around the world. Fighting hunger is a vital part of Sun Hing’s heart.</p>
            <Link href={'/shop'} className="text-white bg-red-500 px-5 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 cursor-pointer">Learn More</Link>
            <h1 className="font-bold bg-gradient-to-t from-[rgb(41,107,138)] to-blue-400 bg-clip-text text-transparent text-5xl mt-0 md:text-8xl  xl:mt-20 xl:text-9xl">Our Future</h1>
        </div>
        
        {/* Grass Images at Bottom */}
        <div className=" w-full flex absolute bottom-0 left-0 z-10">
          <Image 
            src={'/grass.webp'} 
            alt="Grass Image" 
            width={560} 
            height={560} 
            priority 
            className="-scale-x-100 object-cover w-1/2 h-auto -mx-px"
          />
          <Image 
            src={'/grass.webp'} 
            alt="Grass Image"  
            width={560} 
            height={560} 
            priority 
            className="object-cover w-[50.4%] h-auto"
          />
        </div>
      </div>
      {/* Cook Introduction */}
      <div className="w-full relative overflow-hidden">
        <div className="w-full h-[65vh] md:h-[50vh] lg:h-[75vh] custom-height relative">
          <Image src={'/office.webp'} alt="office picture" fill priority className="object-cover blur-md"/>          
        </div>
        <div className="bottom-[-1px] h-full md:left-10  left-[-60px] absolute z-40 flex items-end ">
          <Image src={'/cook.webp'} alt="Cook Picture"  width={800} height={800} priority className="object-contain w-[800px] min-w-[680px] -scale-x-100 relative"/>
          <div className="absolute top-1/12 left-1/12 hidden xl:block">
            <Image src={'/leaves.webp'} alt='Leaves image' width={200} height={200} priority className="object-contain -scale-x-100"/>
          </div>
          <div className="absolute top-1/6 left-2/3 hidden xl:block">
            <Image src={'/onion.webp'} alt='Onion image' width={180} height={180} priority className="object-contain -scale-x-100"/>
          </div>
          <div className="absolute top-0 left-1/2 hidden xl:block">
            <Image src={'/yellowDot.webp'} alt='Onion image' width={100} height={100} priority className="object-contain -scale-x-100"/>
          </div>
          <div className="absolute top-3/4 left-2/3 hidden xl:block">
            <Image src={'/redDot.webp'} alt='Onion image' width={100} height={100} priority className="object-contain -scale-x-100"/>
          </div>
        </div>
        <div className="hidden absolute h-full -bottom-24 -left-28 z-30 xl:flex lg:items-end">
            <Image src={'/logo1.webp'} alt="Logo Picture" width={850} height={850} className="object-contain"/>
        </div>
        <div className="z-50 top-2/12  right-0 px-4 md:px-8 lg:pr-14 absolute space-y-3 lg:w-[54%]  items-center lg:items-start w-full flex flex-col gap-3">
          <h1 className="font-bold  text-4xl xl:text-6xl">Food is About People</h1>
          <p className="text-sm sm:text-base xl:text-md leading-relaxed line-clamp-6 text-justify">At Sun Hing, we want to be your most valued and trusted business partner. We aim to exceed your expectations and deliver shipments as ordered. Sun Hing invests in your success at every level. We deploy 200 professionally-trained local chefs, and offer consulting and business planning services to enhance your menu, keep you on top of emerging trends, and increase the efficiencies that grow your business.</p>
          <Link href={'/'} className="text-white hover:text-red-400 bg-red-500 px-5 py-2 rounded-md border border-red-500 hover:bg-transparent transition-colors duration-300">Become a Customer</Link>
        </div>
      </div>
      {/* Featured Product */}
      <div className="w-full relative">
        <div className="w-full h-[65vh] md:h-[50vh] lg:h-[75vh] custom-height relative ">
          <Image src={'/feature.webp'} alt="Feature Image" fill className="object-cover" priority/>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,black_0%,rgba(0,0,0,0.9)_30%,transparent_70%)]" />
        </div>
        <div className=" top-1/4 lg:left-[2%]  px-4 md:px-8 lg:pr-10 absolute space-y-3 lg:w-[48%]  items-center lg:items-start md:items-center w-full flex flex-col gap-3 text-white">
          <h1 className="font-bold  text-4xl  xl:text-6xl">Featured Products</h1>
          <p className="text-sm sm:text-base xl:text-md leading-relaxed text-justify  text-gray-100 line-clamp-6 ">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
          <Link href={'/'} className="bg-red-500 px-5 py-2 rounded-md border border-red-500 hover:bg-transparent transition-colors duration-300">Become a Customer</Link>
        </div>
      </div>
    </div>
  );
}
