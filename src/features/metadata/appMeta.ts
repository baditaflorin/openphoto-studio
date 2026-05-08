import { z } from 'zod';

const appMetaSchema = z.object({
  version: z.string().min(1),
  commit: z.string().min(1),
  repositoryUrl: z.string().url(),
  paypalUrl: z.string().url(),
  pagesUrl: z.string().url()
});

export const appMeta = appMetaSchema.parse({
  version: __APP_VERSION__,
  commit: __COMMIT_SHA__,
  repositoryUrl: __REPOSITORY_URL__,
  paypalUrl: __PAYPAL_URL__,
  pagesUrl: 'https://baditaflorin.github.io/openphoto-studio/'
});
