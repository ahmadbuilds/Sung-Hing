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
      <div className="w-full h-screen relative overflow-hidden">
        <Carousel className="w-full h-full relative">
          <CarouselContent className="w-full h-full ml-0 cursor-pointer hover:text-red-500">
            <CarouselItem className="relative w-full h-screen pl-0">
              <div className="h-full w-full relative z-0">
                <Image src={'/slider.jpg'} alt="Slider" fill priority className="object-cover"/>
              </div>
              <div className="absolute inset-0 bg-black/60 z-20 w-full h-full"></div>
              <div className="absolute inset-0 flex items-center justify-center text-center w-full h-screen z-30 text-white">
                <div className="bg-red-500/15 p-20 w-full">
                  <CarouselPrevious  className="absolute top-1/2 left-1/12 -translate-y-1/2 z-10"/>
                  <div className="">
                    <h1 className="text-6xl lg:text-8xl font-extrabold">Introducing <br></br>MarketPlace</h1>
                    <p className="text-md p-10 ">Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.</p>
                  </div>
                  <CarouselNext  className="absolute top-1/2 right-1/12 -translate-y-1/2 z-10 cursor-pointer hover:text-red-500"/>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
      {/* Fresh Roots Page */}
      <div className="w-full lg:max-w-10/12 xl:max-w-11/12 mb-10 mx-auto h-auto xl:h-screen relative p-4 sm:p-6 xl:p-10">
        <div className="w-full flex flex-col xl:flex-row items-center justify-center gap-10 h-full">
    
        <div className="relative flex-shrink-0">
            <Image
            src={'/tracter.jpg'}
            alt="tractor image"
            width={900}
            height={900}
            className="object-cover rounded-3xl xl:w-[700px] xl:h-[600px] w-full"
          />

          {/* Only visible on xl+ */}
          <div className="hidden xl:flex absolute top-0 right-[-60%] z-10 w-full bg-white justify-between p-6 rounded-bl-3xl gap-4 items-center">
            <h1 className="text-7xl font-bold leading-tight">
              Fresh From <br /> the Roots
            </h1>
            <Image src={'/logo.png'} alt="Logo image" width={120} height={120}/>
          </div>
        </div>

        {/* Text Block */}
        <div className="w-full xl:w-auto flex flex-col gap-4 xl:pt-60 text-justify">
      
        {/* Title block for all screens except xl */}
        <div className="xl:hidden bg-white p-4 rounded-2xl shadow-md w-full flex justify-center items-center gap-3">
          <h1 className="text-4xl font-bold text-center">
            Fresh From the Roots
          </h1>
          <Image src={'/logo.png'} alt="Logo image" width={100} height={100} />
        </div>

        <p className="text-sm sm:text-base xl:text-md leading-relaxed">
          Fresh food and fresh ideas are at the heart of food and service. Sun Hing delivers exceptional produce, custom cuts of meat, high-quality seafood, and imported foods offering global flavors.
          <br /><br />
          Our network of specialty suppliers pairs well with our culinary and business expertise. Sun Hing’s unparalleled selection of innovative ingredients and cutting-edge products connects your business to the industry-leading distribution network — keeping you stocked with the freshest products, trends, and ideas.
        </p>

        <div>
          <Link
            href="/"
            className="inline-block text-white hover:text-red-400 bg-red-500 px-5 py-2 rounded-md border border-red-500 hover:bg-transparent transition-colors duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  </div>


      {/* Sustaining Explanation */}
      <div className="w-full relative overflow-hidden">
        <div className=" w-screen h-screen relative">
          <Image src={'/clouds.png'} alt="Cloud Image" fill priority className="object-cover"/>
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,white_20%,transparent_100%,white_100%)]" />
        </div>
        <div className="z-0 top-0 left-0 absolute flex flex-col justify-center px-10 md:px-40 items-center gap-0.5  lg:gap-3 h-full ">
          <h1 className="text-7xl font-bold  mb-10">Sustaining Our Future</h1>
          <p className="text-md">​​​​​​Sun Hing has a passion for helping others. We proudly partner with more local ranchers, growers, and producers than any distributor in the industry. We support farm to table initiatives to deliver the best products from anywhere, to everywhere. Sun Hing has partnerships with food banks and other hunger relief organizations to invest in the needs of diverse communities around the world. Fighting hunger is a vital part of Sun Hing’s heart.</p>
          <Link href={'/'} className="text-white bg-red-500 px-5 py-2 rounded-md border border-red-500 hover:border-red-600 hover:bg-red-600 transition-colors duration-300">Learn More</Link>
          <h1 className="font-bold text-blue-300 text-7xl md:text-9xl xl:text-[150px]">Our Future</h1>
        </div>
        <div className="w-full">
            <Image src={'/grass.png'} alt="Grass Image" width={760} height={760} priority className="absolute bottom-0 left-0 -scale-x-100 object-cover"/>
            <Image src={'/grass.png'} alt="Grass Image"  width={755} height={755} priority className="absolute bottom-0 right-0 object-cover"/>
          </div>
      </div>
      {/* Cook Introduction */}
      <div className="w-full relative overflow-hidden">
        <div className="w-full h-screen relative">
          <Image src={'/office.jpg'} alt="office picture" fill priority className="object-cover blur-md"/>          
        </div>
        <div className="bottom-0 h-full left-10 absolute z-40 flex items-end ">
          <Image src={'/cook.png'} alt="Cook Picture"  width={1000} height={1000} priority className="object-contain w-[1000px] min-w-[680px] -scale-x-100 relative"/>
          <div className="absolute top-1/5 left-1/12 hidden lg:block">
            <Image src={'/leaves.png'} alt='Leaves image' width={200} height={200} priority className="object-contain -scale-x-100"/>
          </div>
          <div className="absolute top-1/6 left-1/2 hidden lg:block">
            <Image src={'/onion.png'} alt='Onion image' width={180} height={180} priority className="object-contain -scale-x-100"/>
          </div>
          <div className="absolute top-0 left-1/2 hidden lg:block">
            <Image src={'/yellowDot.png'} alt='Onion image' width={100} height={100} priority className="object-contain -scale-x-100"/>
          </div>
          <div className="absolute top-3/4 left-2/3 hidden lg:block">
            <Image src={'/redDot.png'} alt='Onion image' width={100} height={100} priority className="object-contain -scale-x-100"/>
          </div>
        </div>
        <div className="hidden absolute h-full -bottom-24 -left-28 z-30 xl:flex lg:items-end">
            <Image src={'/logo.png'} alt="Logo Picture" width={1000} height={1000} className="object-contain"/>
        </div>
        <div className="z-50 top-1/4  right-0 px-10 absolute space-y-3 lg:w-[700px]  items-start lg:items-start md:items-center w-full flex flex-col gap-3">
          <h1 className="font-bold text-7xl">Food is About People</h1>
          <p className="text-md  line-clamp-6 ">At Sun Hing, we want to be your most valued and trusted business partner. We aim to exceed your expectations and deliver shipments as ordered. Sun Hing invests in your success at every level. We deploy 200 professionally-trained local chefs, and offer consulting and business planning services to enhance your menu, keep you on top of emerging trends, and increase the efficiencies that grow your business.</p>
          <Link href={'/'} className="text-white hover:text-red-400 bg-red-500 px-5 py-2 rounded-md border border-red-500 hover:bg-transparent transition-colors duration-300">Become a Customer</Link>
        </div>
      </div>
      {/* Featured Product */}
      <div className="w-full relative">
        <div className="w-full h-screen relative ">
          <Image src={'/feature.jpg'} alt="Feature Image" fill className="object-cover" priority/>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,black_0%,rgba(0,0,0,0.9)_30%,transparent_70%)]" />
        </div>
        <div className="top-1/4 lg:left-1/12  px-10 absolute space-y-3 lg:w-[700px]  items-start lg:items-start md:items-center w-full flex flex-col gap-3 text-white">
          <h1 className="font-bold text-7xl">Featured Products</h1>
          <p className="text-md  text-gray-100 line-clamp-6 ">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
          <Link href={'/'} className="bg-red-500 px-5 py-2 rounded-md border border-red-500 hover:bg-transparent transition-colors duration-300">Become a Customer</Link>
        </div>
      </div>
    </div>
  );
}
