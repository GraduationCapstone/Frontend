import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import VideoLayout from "../components/layout/VideoLayout";
import { Button } from "../components/common/Button";

export default function Login() {
  return (
    <VideoLayout variant="dark">
      <div className="fixed left-0 top-0 z-50 w-full">
        <Header variant="transparent" />
      </div>
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
    </VideoLayout>
  );
}
