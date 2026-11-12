import type { Metadata } from "next";
import BlogList from "@/components/blog-list";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { blog, site } from "@/lib/content";

export const metadata: Metadata = {
  // The root layout applies a "%s | name" template — opt out of it here.
  title: { absolute: blog.title },
  description: blog.description,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: blog.title,
    description: blog.description,
    images: [{ url: site.ogImage, alt: blog.title }],
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitter,
    title: blog.title,
    description: blog.description,
    images: [site.ogImage],
  },
};

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <BlogList />
      </main>
      <SiteFooter />
    </>
  );
}
