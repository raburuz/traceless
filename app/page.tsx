import Link from "next/link";
import { AdColumn, AdStrip } from "@app/ads/components/ad-column";
import { ImageForm } from "@/modules/images/components/image-form";
import { Brand } from "@app/shared/components/brand";
import { Hero } from "@app/shared/components/hero";
import { Footer } from "@app/shared/components/footer";
import { PromptSection } from "@app/shared/components/prompt-section";
import { Settings } from "@app/settings/components/settings";
import { ImageResult } from "@/modules/images/components/image-result";

export default function Home() {
  return (
    <>
      <AdStrip position="top"/>
      <div className="relative md:px-44 xl:px-56">
        {/* Header */}
        <header className="sticky top-22 md:top-10 z-10 mt-2 md:mt-0 mx-3 md:mx-10 flex items-center justify-between">
          <Link href="/" aria-label="Traceless home" className="rounded-xl bg-white/80 pr-2 backdrop-blur">
            <Brand/>
          </Link>
          <Settings/>
        </header>
       {/*  <AdColumn side="left"/>
        <AdColumn side="right"/> */}
        {/* Content */}
        <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-3 pt-28 pb-16">
          <Hero/>
          <div id="create" className="w-full scroll-mt-6">
            <ImageForm/>
            <ImageResult/>
          </div>
         {/*  <PromptSection/> */}
        </main>
        <Footer/>
      </div>
      <AdStrip position="bottom"/>
    </>
  );
}
