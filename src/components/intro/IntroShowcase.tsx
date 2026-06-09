import { motion, useReducedMotion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import Intro1Img from "../../assets/intro/Intro1.webp";
import Intro2Img from "../../assets/intro/Intro2.webp";
import Intro3Img from "../../assets/intro/Intro3.webp";
import Intro4Img from "../../assets/intro/Intro4.webp";

type IntroShowcaseProps = {
  showLoginButton?: boolean;
};

const INTRO_IMAGES = [
  {
    src: Intro1Img,
    alt: "Probe AI test automation overview",
    wrapperClassName: "max-w-[1600px]",
    reveal: false,
  },
  {
    src: Intro2Img,
    alt: "Probe connected test automation pipeline",
    wrapperClassName: "max-w-[1443px]",
    reveal: true,
  },
  {
    src: Intro3Img,
    alt: "Probe productivity improvement metrics",
    wrapperClassName: "max-w-[1112px]",
    reveal: true,
  },
  {
    src: Intro4Img,
    alt: "Probe test automation team introduction",
    wrapperClassName: "max-w-[1400px]",
    reveal: true,
  },
] as const;

export default function IntroShowcase({ showLoginButton = false }: IntroShowcaseProps) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="self-stretch flex flex-col items-center gap-[200px] px-layout-margin py-[200px]">
      {INTRO_IMAGES.map((image, index) => {
        const content = (
          <div className={`relative mx-auto w-full ${image.wrapperClassName}`}>
            <img
              src={image.src}
              alt={image.alt}
              className="h-auto w-full select-none"
              draggable={false}
            />
            {index === 0 && showLoginButton ? (
              <Button
                variant="staticGy900LText"
                label="Probe 시작하기"
                children={undefined}
                className="absolute bottom-0 left-12 z-10 !w-m"
                onClick={() => navigate("/login")}
              />
            ) : null}
          </div>
        );

        if (!image.reveal || shouldReduceMotion) {
          return (
            <section key={image.src} className="relative w-full snap-start snap-always">
              {content}
            </section>
          );
        }

        return (
          <motion.section
            key={image.src}
            className="relative w-full snap-start snap-always"
            initial={{ opacity: 0, y: 140, scale: 0.82 }}
            whileInView={{ opacity: 1, y: 0, scale: [0.82, 1.045, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              opacity: { duration: 0.28, ease: "easeOut" },
              y: { duration: 0.78, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 0.92, times: [0, 0.72, 1], ease: ["easeOut", "easeInOut"] },
            }}
            style={{ transformOrigin: "center bottom" }}
          >
            {content}
          </motion.section>
        );
      })}
    </main>
  );
}
