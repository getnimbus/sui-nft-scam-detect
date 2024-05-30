import { useState } from "react";
import { cn } from "../utils";

const CheckCardMediaImage = ({ src, defaultImg, imgName, className }: any) => {
  const [imgOnErr, setImgOnErr] = useState<boolean>(false);

  if (!imgOnErr)
    return (
      <img
        src={src || defaultImg}
        alt={`${imgName} logo`}
        className={cn(className)}
        onError={() => setImgOnErr(true)}
      />
    );
  return (
    <img
      src={defaultImg}
      alt={`${imgName} logo`}
      className={`${cn(className)} object-contain`}
    />
  );
};

export default CheckCardMediaImage;
