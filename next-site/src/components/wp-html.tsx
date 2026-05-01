import parse, {
  Element,
  HTMLReactParserOptions,
  domToReact,
} from "html-react-parser";
import Link from "next/link";
import Image from "next/image";
import { localizeWpLink } from "@/lib/links";
import { isAllowedImageHost } from "@/lib/images";

const options: HTMLReactParserOptions = {
  replace: (node) => {
    if (!(node instanceof Element)) return undefined;

    if (node.name === "a" && node.attribs.href) {
      const href = localizeWpLink(node.attribs.href);
      const isInternal = href.startsWith("/");
      if (isInternal) {
        return (
          <Link href={href} className={node.attribs.class}>
            {domToReact(node.children as never, options)}
          </Link>
        );
      }
    }

    if (node.name === "img" && node.attribs.src) {
      const { src, alt = "", width, height } = node.attribs;

      if (!isAllowedImageHost(src)) {
        // eslint-disable-next-line @next/next/no-img-element
        return (
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={node.attribs.class}
            loading="lazy"
            decoding="async"
          />
        );
      }

      const w = Number(width) || 1200;
      const h = Number(height) || 800;
      return (
        <Image
          src={src}
          alt={alt}
          width={w}
          height={h}
          className={node.attribs.class}
          sizes="(max-width: 768px) 100vw, 800px"
        />
      );
    }

    return undefined;
  },
};

export function WpHtml({ html }: { html: string }) {
  return <>{parse(html, options)}</>;
}
