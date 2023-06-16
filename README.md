# Optimizing NextJS Apps

## Introduction

- Adding Meta and `<head>` tags
- Re-using Components, Logic and Configuration
- Optimizing Images

## The Need for the `head` Metadata

- The `<head>` content is necessary for search engines and browsers

## Configuring the `head` content

- We use the `Head` component from `next/head`
- NextJS injects the content of the `Head` component to the actual `head` tag in the generated HTML page.
  ```tsx
  export default function Home(props: HomePageProps) {
    return (
      <div>
        <Head>
          <title>NextJS Events</title>
          <meta name="description" content="Find the most exciting events near you..." />
        </Head>
        <EventsList events={props.featuredEvents} />
      </div>
    );
  }
  ```

## A Common Head

- We might want to separate the `Head` content to a separate variable that is prepended to all types of responses (data and error)

## Working with the `_app.tsx` file

- Global Head Settings across all pages
  ```tsx
  export default function App({ Component, pageProps }: AppProps) {
    return (
      <Layout>
        <Head>
          <title>NextJS Events</title>
          <meta name="description" content="Find the most exciting events near you" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    );
  }
  ```
- NextJS automatically merges head content by taking the latest one in case of conflicts

## `_document.tsx`

- Must be directly under the `pages` directory
- Allows customizing the entire HTML document
- Has to be a class-based component
  ```tsx
  import Document, { Head, Html, Main, NextScript } from "next/document";

  class MyDocument extends Document {
    render() {
      return (
        <Html lang="en">
          <Head />
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      );
    }
  }

  export default MyDocument;
  ```
  Note that the `Head` component is now imported from `next/document` and not `next/head`
- One use of this is that we can add overlays by adding a div in this document:
  ```tsx
  <body>
  	<div id="overlays"/>
  		<Main>
  		...
  </body>
  ```

## A Closer Look at Images

- The Images via `<img>` tag are not optimized
- These images are huge, unoptimized images that always use the same format (instead of an optimized image format like `webp`)

## The Next Image Component

- The `Image` component will create multiple versions of an image on-the-fly depending upon the client capabilities.
- We can pass in the `width` and `height` of the image to the component that determines the size of the image on the device (and not the actual width and height of the image).
- Finding the right width and height will be a matter of hit and trial.
- The optimized images are stored in the `cache/images` directory inside the build directory i.e., `.next`.
- Images can be lazy loaded so that images that are not part of the viewport are not loaded by NextJS
