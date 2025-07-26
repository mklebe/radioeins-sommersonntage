import { DocumentContext, Head, Html, Main, NextScript } from "next/document";

import {
  DocumentHeadTags,
  DocumentHeadTagsProps,
  documentGetInitialProps,
} from '@mui/material-nextjs/v15-pagesRouter';

export default function MyDocument(props: DocumentHeadTagsProps) {
   return (
     <Html lang="en">
       <Head>
          <DocumentHeadTags {...props} />
       </Head>
       <body>
        <Main />
        <NextScript />
       </body>
     </Html>
   );
 }

 MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};

