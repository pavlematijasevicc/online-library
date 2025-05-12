import {
  DocumentHeadTags,
  DocumentHeadTagsProps,
  documentGetInitialProps,
} from "@mui/material-nextjs/v15-pagesRouter";
import {
  Html,
  Main,
  NextScript,
  Head,
  DocumentContext,
  DocumentProps,
} from "next/document";
import { JSX } from "react";
// or `v1X-pagesRouter` if you are using Next.js v1X

export default function MyDocument(
  props: DocumentProps & DocumentHeadTagsProps
) {
  return (
    <Html lang="en">
      <Head>
        <DocumentHeadTags {...props} />
        ...
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const finalProps = await documentGetInitialProps(ctx, {
    emotionCache: createCustomCache(),
  });
  return finalProps;
};
function createCustomCache():
  | import("@emotion/utils").EmotionCache
  | undefined {
  throw new Error("Function not implemented.");
}
