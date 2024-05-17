import Home from "../componets/home";
import { SocketContexProvider } from "../contex/SocketContex";

export function HomePage() {
  return (
    <>
      <SocketContexProvider>
        <Home />
      </SocketContexProvider>
    </>
  );
}
