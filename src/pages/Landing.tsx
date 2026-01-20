import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import BackgroundImg from "../assets/bg/BG.mp4";

export default function Landing() {
  return (
    <div className="desktop:min-w-[1440px] wide:min-w-[1920px] w-full bg-linear-to-b to-neutral-800/0 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <video
          className="h-full w-full object-cover"
          src={BackgroundImg}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--Colors-Gray-Scale-Black,#1F2328)_4.54%,rgba(31,35,40,0)_61.81%)]" />
      <div className="self-stretch w-full desktop:min-w-[1440px] wide:min-w-[1920px] pt-16 relative flex min-h-screen flex-col items-center overflow-hidden justify-start">
        <Header variant="transparent" />
        {/* Main */}
        <main className="self-stretch min-h-[63rem] flex-1 pt-72 flex flex-col justify-start items-center gap-44">
          <section className="self-stretch flex flex-col justify-start items-center gap-8 px-layout-margin">
            <h1 className="self-stretch text-center text-grayscale-white text-extra-ko">
              Probe로 테스트를 자동화하세요.
            </h1>
            <p className="self-stretch text-center text-grayscale-white text-h1-kr">
              당신의 코드를 이해하는 AI, 테스트 워크플로를 하나로
            </p>
          </section>
        </main>
        <div className="mt-auto w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
}
