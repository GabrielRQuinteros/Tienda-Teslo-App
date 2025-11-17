import Image from "next/image";

interface Props {
    src?: string,
    alt: string,
    className?: React.StyleHTMLAttributes<HTMLImageElement>['className'],
    width: number,
    height:number,

}
export const ProductImage = ({ alt, height, width, className="", src: url }: Props) => {

  const finalSrc = url? 
                        url?.startsWith('http') ?
                            url
                            : `/products/${url}`
                        : "/imgs/image-placeholder.jpg"
  return (
    <>
      <Image
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    </>
  );
};
