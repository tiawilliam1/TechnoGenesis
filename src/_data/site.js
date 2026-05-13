const fallbackSiteUrl = "https://technogenesis.fr";

const resolvedSiteUrl =
  process.env.SITE_URL || process.env.URL || fallbackSiteUrl;

module.exports = {
  name: "TechnoGenesis",
  language: "en",
  locale: "en_US",
  url: resolvedSiteUrl.replace(/\/+$/, ""),
  defaultDescription:
    "Deep-tech patent intelligence for photonics, semiconductors, quantum technologies, and advanced engineering teams.",
  defaultImage: "/assets/img/TechnoGenesispreview.png",
  favicon: "/favicon-32x32.png",
  author: "Meletis Mexis",
  themeColor: "#0b1220",
  twitterHandle: "",
};
