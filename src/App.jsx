import { useRef, useState } from "react";
import Hero from "./components/Hero";
import OrderForm from "./components/OrderForm";
import Success from "./components/Success";

export default function App() {
  const [screen, setScreen] = useState("hero");
  const formRef = useRef(null);

  const goToForm = () => {
    setScreen("form");
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const goToSuccess = () => {
    setScreen("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {screen === "hero" && <Hero onOrderClick={goToForm} />}

      {screen === "form" && <OrderForm ref={formRef} onSuccess={goToSuccess} />}


      {screen === "success" && <Success />}
    </>
  );
}
