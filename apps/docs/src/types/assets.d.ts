/**
 * Assets - WebP.
 *
 * Lets pages import WebP screenshots from the docs folders. Docusaurus turns
 * each import into the URL of the bundled image.
 *
 * @since 0.0.0
 */
declare module '*.webp' {
  const src: string;

  export default src;
}
