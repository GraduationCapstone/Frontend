import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import VideoLayout from "../components/layout/VideoLayout";
import IntroShowcase from "../components/intro/IntroShowcase";

export default function Landing() {
  return (
    <VideoLayout variant="light">
      <Header variant="transparent" />
      <IntroShowcase showLoginButton />
      <div className="mt-auto w-full">
        <Footer />
      </div>
    </VideoLayout>
  );
}
