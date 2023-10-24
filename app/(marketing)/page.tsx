import Heading from "./_components/Heading";
import Heroes from "./_components/Heroes";
import Main from "./_components/Main";
import GetStarted from "./_components/GetStarted";

export default function MarketingPage() {
  return (
    <div className="min-h-full flex flex-col pt-20">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <h1 className="text-6xl font-bold"></h1>
        <Heading />
        <Main />
        <Heroes />
        <GetStarted />
      </div>
    </div>
  );
}
