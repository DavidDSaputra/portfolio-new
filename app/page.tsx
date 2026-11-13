import SiteHeader from "@/components/site-header";
import Hero from "@/components/hero";
import Showcase from "@/components/showcase";
import About from "@/components/about";
import Jalur from "@/components/jalur";
import SelectedWorks from "@/components/selected-works";
import WorksArchive from "@/components/works-archive";
import Experience from "@/components/experience";
import SkillsEducation from "@/components/skills-education";
import ContactCta from "@/components/contact-cta";
import SiteFooter from "@/components/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Showcase />
        <About />
        <Jalur />
        <SelectedWorks />
        <WorksArchive />
        <Experience />
        <SkillsEducation />
        <ContactCta />
      </main>
      <SiteFooter />
    </>
  );
}
