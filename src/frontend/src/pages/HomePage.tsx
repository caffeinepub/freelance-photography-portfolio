import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import GallerySection from "../components/GallerySection";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import VideoSection from "../components/VideoSection";
import {
  useGetAboutSection,
  useGetContactInfo,
  useGetFeaturedMedia,
  useListAllMedia,
  useListCategories,
} from "../hooks/useQueries";
import { isVideoCategory } from "../utils/categoryUtils";

export default function HomePage() {
  const { data: media } = useListAllMedia();
  const { data: categories } = useListCategories();
  const { data: featuredMedia } = useGetFeaturedMedia();
  const { data: about } = useGetAboutSection();
  const { data: contact } = useGetContactInfo();

  const videos = media?.filter((m) => m.mediaType === "video") ?? [];
  const videoCategories = categories?.filter(isVideoCategory) ?? [];

  return (
    <>
      <Navbar />
      <main>
        <HeroSection featuredItem={featuredMedia} />
        <GallerySection />
        <VideoSection videos={videos} categories={videoCategories} />
        <AboutSection about={about} />
        <ContactSection contact={contact} />
      </main>
      <Footer />
    </>
  );
}
