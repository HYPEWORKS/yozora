import { useState } from "react";
import QRCode from "qrcode";

import { CallPlugin } from "../../wailsjs/go/main/App";
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { uint8ArrayToBase64 } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode, Download, ExternalLink } from "lucide-react";
import {
  inputStringToObjectString,
  outputObjectStringToString,
} from "./schemas/qr-code";
import { motion } from "framer-motion";

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

      // and then convert the Uint8Array to a base64 string so we can transmit it through JSON
      const dataString = uint8ArrayToBase64(uint8Array);

      const request = inputStringToObjectString(dataString);

      const result = outputObjectStringToString(
        await CallPlugin("qr-code", "save", request)
      );

      if (typeof result === "string") {
        toast({
          title: "QR Code saved",
          description: "Your QR Code has been saved!",
          duration: 1500,
        });
      } else {
        const message = (result as Error).message;

        if (message === "No file selected") {
          toast({
            title: "No file selected",
            description: "Please select a file to download the QR Code",
            variant: "default",
            duration: 2000,
          });
        } else {
          toast({
            title: "Unable to save QR Code",
            description: message,
            variant: "destructive",
            duration: 2000,
          });
        }
      }
    }
  };

  const openDensoWaveLink = () => {
    BrowserOpenURL("https://www.denso-wave.com/en/");
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            QR Code Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="Enter text or URL"
              className="w-full"
            />
            <Button onClick={() => generateQR(data)} className="w-full">
              <QrCode className="w-4 h-4 mr-2" />
              Generate QR Code
            </Button>
          </div>
          {generatedDataUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center space-y-4"
            >
              <img
                src={generatedDataUrl || "/placeholder.svg"}
                alt="QR Code"
                className="w-48 h-48"
              />
              <Button onClick={downloadQR} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center text-center text-sm text-gray-500">
          <p>More customization options coming soon</p>
        </CardFooter>
      </Card>
      <p className="mt-6 text-center text-xs">
        "QR Code" is registered trademark of{" "}
        <Button
          variant="link"
          className="p-0 h-auto text-red-500 hover:text-red-700 cursor-pointer"
          onClick={openDensoWaveLink}
        >
          DENSO WAVE INCORPORATED
          <ExternalLink className="w-3 h-3 mr-1 inline" />
        </Button>{" "}
        in Japan and other countries.
      </p>
    </>
  );
}
