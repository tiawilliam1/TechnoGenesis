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

  // Posts collection
  eleventyConfig.addCollection("posts", (collectionApi) => {
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

    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
      const dateDifference = getPublicationSortTime(a) - getPublicationSortTime(b);
      if (dateDifference !== 0) return dateDifference;

      return String(a.data.title || "").localeCompare(String(b.data.title || ""));
    });
  });

  // Date filter (fixes Netlify build)
  eleventyConfig.addFilter("date", () => new Date().getFullYear());
  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
  };
};
