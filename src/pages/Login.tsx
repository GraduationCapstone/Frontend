import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import BackgroundImg from "../assets/bg/BG.mp4";
import { Button } from "../components/common/Button";

export default function Login() {
    return (
        <div className="relative w-full bg-linear-to-b to-neutral-800/0 overflow-hidden overscroll-none">
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
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-grayscale-black" />
          <div className="self-stretch w-full pt-16 relative flex min-h-screen flex-col items-center overflow-hidden justify-start">
            <Header variant="transparent" />
            {/* Main */}
            <main className="self-stretch min-h-[63rem] flex-1 pt-72 inline-flex flex-col justify-start items-center gap-44">
              <section className="self-stretch flex flex-col justify-start items-center gap-8">
                <h1 className="self-stretch text-center justify-center text-grayscale-white text-extra-ko">
                  Probe로 테스트를 자동화하세요.
                </h1>
                <p className="self-stretch text-center justify-center text-grayscale-white text-h1-ko">
                  당신의 코드를 이해하는 AI, 테스트 워크플로를 하나로
                </p>
              </section>
              {/* 버튼 추가 */}
              <div className="flex flex-col justify-start items-start gap-5">
              <Button
              variant="staticGy900LText"
              label="Github 계정으로 로그인"
              children={undefined}
              />
              <div className="mt-5 w-full flex items-center justify-between">
                <span className="text-grayscale-black text-medium500-ko">처음 이용하신다면?</span>
                <Button
                variant="dynamicClearSTextUnderlined"
                label="회원가입"
                children={undefined}
                />
              </div>
              </div>
            </main>
            <div className="mt-auto w-full">
              <Footer />
            </div>
          </div>
        </div>
      );
    
}
