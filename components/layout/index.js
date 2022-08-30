import Head from 'next/head';
import Script from 'next/script';
import Navigation from '../navigation';
import styles from './index.module.css';
import settings from '../../app.settings.json';
import PageTransition from '../page_transition';

const HeaderInfo = ({ headerInfo }) => {
  const {
    pageTitle = '',
    description = '',
    image = '',
    openGraphType = 'website',
    url = '/',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
    schemaType = 'Article'
  } = headerInfo;
  return (
    <Head>
      <title>{`${pageTitle ? pageTitle + ' | ' : ''} ${
        settings.website_name
      }`}</title>
      <meta name="description" content={settings.website_desc} />
      <meta itemProp="name" content={pageTitle} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" name="image" content={image} />
      <link rel="icon" href="/favicon.ico" />
      <SEO
        title={pageTitle}
        description={description}
        image={image}
        openGraphType={openGraphType}
        createdAt={createdAt}
        updatedAt={updatedAt}
        url={url}
        schemaType={schemaType}
      />
    </Head>
  );
};

/**
 * @see https://github.com/cheatcode/nextjs-boilerplate/blob/master/components/SEO/index.js
 */
const SEO = ({
  title,
  description,
  image,
  openGraphType,
  createdAt,
  updatedAt,
  url,
  schemaType
}) => {
  const twitterHandler = '@ebuckleyk';
  return [
    <meta key={0} name="twitter:card" content="summary_large_image" />,
    <meta key={1} name="twitter:site" content={twitterHandler} />,
    <meta key={2} name="twitter:title" content={title} />,
    <meta key={3} name="twitter:description" content={description} />,
    <meta key={4} name="twitter:creator" contrent={twitterHandler} />,
    <meta key={5} name="twitter:image:src" content={image} />,
    <meta key={6} name="og:title" content="summary_large_image" />,
    <meta key={7} name="og:type" content={openGraphType} />,
    <meta key={8} name="og:url" content={url} />,
    <meta key={9} name="og:image" content={image} />,
    <meta key={10} name="og:description" content={description} />,
    <meta key={11} name="og:site_name" content={'Emmanuel K. Buckley'} />,
    <meta key={12} name="og:published_time" content={createdAt} />,
    <meta key={13} name="og:modified_time" content={updatedAt} />,
    <script
      key={14}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'http://schema.org',
          '@type': schemaType,
          name: title,
          about: description,
          url
        })
      }}
    />
  ];
};

export default function Layout({
  children,
  router,
  navState,
  headerInfo = {}
}) {
  return (
    <>
      <HeaderInfo headerInfo={headerInfo} />
      <Script
        src={`${settings.api.reCaptchaJsApi}?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
      />
      <Script
        strategy="afterInteractive"
        src={`${settings.api.googTagManager}?id=${process.env.NEXT_PUBLIC_GA}`}
      />
      <Script id="googleAnalytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA}', {
            page_path: window.location.pathname
          });
        `}
      </Script>
      <div className={styles['bg-container']}>
        <Navigation
          isLoading={navState.isLoading}
          activeRoute={navState.activeRoute}
        />
        <PageTransition activeRoute={navState.activeRoute}>
          <main className={styles.main}>{children}</main>
        </PageTransition>
      </div>
    </>
  );
}
