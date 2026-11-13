import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Sin caché incremental en R2: las páginas del sitio son dinámicas (revalidate = 0).
export default defineCloudflareConfig({});
