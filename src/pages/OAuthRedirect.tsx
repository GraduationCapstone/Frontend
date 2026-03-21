import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearAccessToken,
  extractAccessTokenFromUrl,
  reissueAccessToken,
  saveAccessToken,
} from "../api/auth";

export default function OAuthRedirect() {
  const [message, setMessage] = useState("로그인 처리 중...");
  const navigate = useNavigate();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    if (window.location.pathname !== "/oauth2/redirect") return;

    handledRef.current = true;

    const run = async () => {
      console.log("전체 URL:", window.location.href);
      console.log("Search 쿼리:", window.location.search);
      const accessToken = extractAccessTokenFromUrl(window.location.search);

      console.log("[OAuthRedirect] hasAccessToken:", Boolean(accessToken));

      if (accessToken) {
        saveAccessToken(accessToken);
        setMessage("로그인 성공, 홈으로 이동 중...");
        navigate("/home", { replace: true });
        return;
      }

      try {
        const newAccessToken = await reissueAccessToken();
        saveAccessToken(newAccessToken);
        setMessage("토큰 재발급 성공, 홈으로 이동 중...");
        navigate("/home", { replace: true });
      } catch (e) {
        console.log("[OAuthRedirect] reissue failed:", e);
        clearAccessToken();
        setMessage("로그인 실패, 로그인 페이지로 이동 중...");
        navigate("/login", { replace: true });
      }
    };

    run();
  }, [navigate]);

  return <div style={{ padding: 24 }}>{message}</div>;
}
