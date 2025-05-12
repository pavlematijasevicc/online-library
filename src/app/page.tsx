import { Button } from "@mui/material";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="typography-h1 text-primary bg-red-500 ">Hello world</div>
      <Button variant="contained" className="bg-blue">
        Primary
      </Button>
      <Button disabled>Disabled</Button>
      <Button href="#text-buttons">Link</Button>
    </div>
  );
}
