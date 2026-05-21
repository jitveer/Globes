import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, keywords, image, imageAlt, url }) => {
  const siteName = "Globes Properties";
  const defaultDescription =
    "Find your dream property with Globes Properties. We offer a wide range of real estate options.";

  const seoTitle = title ? `${title} | ${siteName}` : siteName;
  const seoDescription = description || defaultDescription;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* OpenGraph tags for Social Media (Facebook, WhatsApp, LinkedIn, etc.) */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      {url && <meta property="og:url" content={url} />}

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      {image && <meta name="twitter:image" content={image} />}
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}
    </Helmet>
  );
};

export default SEO;
