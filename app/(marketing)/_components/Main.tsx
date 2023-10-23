import Image from "next/image";

const Main = () => {
  return (
    <>
      <div className="relative hidden md:block w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[550px] md:w-[800px] lg:h-[800px] lg:w-[1200px] mt-0">
        <Image
          src="/main.png"
          fill
          className="object-contain dark:hidden"
          alt="dashboard"
        />
        <Image
          src="/main-dark.png"
          fill
          className="object-contain hidden dark:block"
          alt="dashboard"
        />
      </div>
      <div className="relative mt-10 md:mt-0 md:hidden w-[300px] h-[600px] sm:w-[350px] sm:h-[650px]">
        <Image
          src="/main-phone.png"
          fill
          className="object-contain dark:hidden"
          alt="dashboard"
        />
        <Image
          src="/main-dark-phone.png"
          fill
          className="object-contain hidden dark:block"
          alt="dashboard"
        />
      </div>
    </>
  );
};

export default Main;
