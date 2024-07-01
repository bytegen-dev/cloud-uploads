import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <meta property="theme-color" content="#323232"></meta>
        <meta name="title" content="Cloudx by Bytegen"/>
        <meta name="description" content="Upload files to cloudinary save data to firebase, export as .json or as javascript array"/>

        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://cloudx-bytgen.vercel.app/"/>
        <meta property="og:title" content="Cloudx by Bytegen"/>
        <meta property="arog:description" content="Upload files to cloudinary save data to firebase, export as .json or as javascript array"/>
        <meta property="og:image" content="/logo.png"/>
        <link rel="icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json"/>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <title>
          Cloudx ~ Image Uploads
        </title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
