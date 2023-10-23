import Image from "next/image";
import Footer from "./_components/Footer";
import Heading from "./_components/Heading";
import Heroes from "./_components/Heroes";

export default function MarketingPage() {
  return <div className="min-h-full flex flex-col">
    <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
      <h1 className="text-6xl font-bold"></h1>
      <Heading />
      <div className="relative w-full min-h-[70vh] mt-20">
        <Image
          src='/main.png'
          fill
          className='object-contain dark:hidden'
          alt='dashboard'
        />
        <Image
          src='/main-dark.png'
          fill
          className='object-contain hidden dark:block'
          alt='dashboard'
        />
      </div>
      <Heroes />
    </div>
    <Footer />
  </div>;
}
