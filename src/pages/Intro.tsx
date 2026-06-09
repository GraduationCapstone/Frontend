import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import VideoLayout from "../components/layout/VideoLayout";
import IntroShowcase from "../components/intro/IntroShowcase";

export default function Intro() {
  return (
    <VideoLayout variant="light">
      <Header isLoggedIn={true} variant="default" />
      <IntroShowcase />
      <div className="mt-auto w-full">
        <Footer />
      </div>
    </VideoLayout>
  );
}
