import Image from "next/image";

export function Artwork({
  src, className, eager = false, sizes = "(max-width: 640px) 50vw, 25vw",
}: {
  src: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      className={className}
      loading={eager ? "eager" : "lazy"}
      unoptimized={src.startsWith("/artwork/") && !src.startsWith("/artwork/editorial-")}
    />
  );
}
