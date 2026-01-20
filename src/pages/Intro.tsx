import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import VideoLayout from "../components/layout/VideoLayout";

export default function Intro() {
  return (
    <VideoLayout variant="light">
      <Header isLoggedIn={true} variant="default" />
      {/* Main */}
      <main className="self-stretch min-h-[63rem] flex-1 pt-72 inline-flex flex-col justify-start items-center gap-44">
        <section className="self-stretch flex flex-col justify-start items-center gap-8">
          <h1 className="self-stretch text-center justify-center text-grayscale-black text-extra-ko">
            Probe로 테스트를 자동화하세요.
          </h1>
          <p className="self-stretch text-center justify-center text-grayscale-black text-h1-ko">
            당신의 코드를 이해하는 AI, 테스트 워크플로를 하나로
          </p>
        </section>
      </main>
      <div className="mt-auto w-full">
        <Footer />
      </div>
    </VideoLayout>
  );
}
