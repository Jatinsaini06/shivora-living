import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { CollectionsRail } from "@/components/home/CollectionsRail";
import { TextureShowcase } from "@/components/home/TextureShowcase";
import { CustomSolutions } from "@/components/home/CustomSolutions";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { AboutStrip } from "@/components/home/AboutStrip";
import { CtaBand } from "@/components/home/CtaBand";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — Premium Carpets & Rugs Manufacturer | Panipat` },
      {
        name: "description",
        content:
          "Bespoke carpets and rugs for ultra-luxury hotels, commercial spaces and premium residences. Hand woven, hand tufted, jute, woolen, shaggy, abstract and fully custom carpets from Panipat, Haryana.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <CollectionsRail />
      <TextureShowcase />
      <CustomSolutions />
      <AboutStrip />
      <ProcessTimeline />
      <WhyChooseUs />
      <CtaBand />
    </>
  );
}
