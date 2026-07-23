module.exports = function (eleventyConfig) {
  // Copy static folders to output
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/uploads": "uploads" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("src/favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("src/favicon.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-512x512.png");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  const getPublicationSortTime = (item) => {
    const dateValue = item.data.publication_date || item.data.date;
    const parsedDate = dateValue ? new Date(dateValue).getTime() : NaN;

    if (!Number.isNaN(parsedDate)) return parsedDate;

    const publicationYear = Number(item.data.publication_year);
    if (Number.isFinite(publicationYear)) {
      return Date.UTC(publicationYear, 0, 1);
    }

    return item.date instanceof Date ? item.date.getTime() : 0;
  };

  const getPublicationArea = (item) => {
    if (item.data.publication_area === "blog") return "further_insights";
    if (item.data.publication_area) return item.data.publication_area;
    if (item.data.current_collaboration) return "patent_information";
    return "photonics_semiconductors";
  };

  const isCurrentCollaboration = (item) => {
    return item.data.current_collaboration === true || item.data.current_collaboration === "true";
  };

  const getSortedPublications = (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
      const dateDifference = getPublicationSortTime(b) - getPublicationSortTime(a);
      if (dateDifference !== 0) return dateDifference;

      return String(a.data.title || "").localeCompare(String(b.data.title || ""));
    });
  };

  // Posts collection
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return getSortedPublications(collectionApi);
  });

  eleventyConfig.addCollection("patentPublications", (collectionApi) => {
    return getSortedPublications(collectionApi).filter((item) => {
      return getPublicationArea(item) === "patent_information";
    });
  });

  eleventyConfig.addCollection("photonicsPublications", (collectionApi) => {
    return getSortedPublications(collectionApi).filter((item) => {
      return getPublicationArea(item) === "photonics_semiconductors";
    });
  });

  eleventyConfig.addCollection("patentTopicPublications", (collectionApi) => {
    return getSortedPublications(collectionApi).filter((item) => {
      return getPublicationArea(item) === "patent_information" || isCurrentCollaboration(item);
    });
  });

  eleventyConfig.addCollection("homePublications", (collectionApi) => {
    return getSortedPublications(collectionApi).filter((item) => {
      return getPublicationArea(item) !== "further_insights";
    });
  });

  eleventyConfig.addCollection("furtherInsightsPublications", (collectionApi) => {
    return getSortedPublications(collectionApi).filter((item) => {
      return getPublicationArea(item) === "further_insights";
    });
  });

  // Date filter (fixes Netlify build)
  eleventyConfig.addFilter("date", () => new Date().getFullYear());
  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));
  eleventyConfig.addFilter("isPublicationTarget", (value) => {
    if (typeof value !== "string") return false;

    const target = value.trim();
    return /^(https?:\/\/|mailto:|tel:|\/)/i.test(target);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
  };
};
