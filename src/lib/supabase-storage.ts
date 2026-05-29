import { createClient } from "@supabase/supabase-js";

export const providerDocumentBucket = "provider-documents";
export const providerPortfolioBucket = "provider-portfolio";
export const customerUploadsBucket = "customer-uploads";

export type SetuStorageBucket =
  | typeof providerDocumentBucket
  | typeof providerPortfolioBucket
  | typeof customerUploadsBucket;

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for uploads.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function uploadSetuFile({
  bucket,
  file,
  path,
}: {
  bucket: SetuStorageBucket;
  file: Blob | File;
  path: string;
}) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return {
    bucket,
    path: data.path,
    publicUrl: publicUrlData.publicUrl,
  };
}
