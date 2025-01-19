import { useState } from "react";
import QRCode from "qrcode";

import { CallPlugin } from "../../wailsjs/go/main/App";
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function QR_Code() {
  const [data, setData] = useState<string>("");
  const [generatedDataUrl, setGeneratedDataUrl] = useState<string | null>(null);

  const { toast } = useToast();

  const generateQR = async (text: string) => {
    try {
      setGeneratedDataUrl(await QRCode.toDataURL(text));
    } catch (err) {
      console.error(err);
    }
  };

  const downloadQR = async () => {
    if (generatedDataUrl) {
      // first convert the data URL to a Blob
      const response = await fetch(generatedDataUrl);
      const blob = await response.blob();

      // and then convert Blob to ArrayBuffer, then to Uint8Array
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // and then finally convert Uint8Array to a plain array of numbers
      const byteArray = Array.from(uint8Array);

      await CallPlugin("qr-code", "save", byteArray);

      toast({
        title: "QR Code saved",
        description: "Your QR Code has been saved!",
        duration: 1500,
      });
    }
  };

  const openDensoWaveLink = () => {
    BrowserOpenURL("https://www.denso-wave.com/en/");
  };

  return (
    <div>
      <p>QR Code Generator</p>
      <small className="text-gray-400">
        More customization options coming soon
      </small>
      <Input value={data} onChange={(e) => setData(e.target.value)} />
      <Button onClick={() => generateQR(data)}>Generate QR Code</Button>
      {generatedDataUrl && (
        <>
          <img src={generatedDataUrl} alt="QR Code" className="mt-6" />
          <Button onClick={downloadQR}>Download QR Code</Button>
        </>
      )}
      <br />
      <div className="flex flex-col w-full items-center mt-10">
        <small className="text-gray-400 text-center">
          “QR Code” is registered trademark of{" "}
          <a
            href="#"
            onClick={openDensoWaveLink}
            className="underline text-red-500 hover:cursor-pointer hover:text-red-700"
          >
            DENSO WAVE INCORPORATED
          </a>{" "}
          in Japan and other countries.
        </small>
      </div>
    </div>
  );
}
