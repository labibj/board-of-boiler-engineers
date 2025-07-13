// lib/gcs-upload.ts
import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage (ensure env vars are correctly set)
let gcsCredentials;
try {
  if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
    gcsCredentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY);
  } else {
    console.error("GCP_SERVICE_ACCOUNT_KEY is not set.");
  }
} catch (parseError) {
  console.error("Error parsing GCP_SERVICE_ACCOUNT_KEY:", parseError);
}

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: gcsCredentials,
});

const GCS_BUCKET_NAME = process.env.GCP_BUCKET_NAME;

/**
 * Uploads a file to Google Cloud Storage.
 * @param file - The file object from FormData.
 * @param folder - The folder name within the GCS bucket (e.g., "profile-photos", "roll-no-slips").
 * @returns The public URL of the uploaded file, or null if upload fails.
 */
export const uploadFileToCloudStorage = async (file: FormDataEntryValue | null, folder: string): Promise<string | null> => {
  if (!file || !(file instanceof File)) {
    console.warn(`Skipping upload for non-file or null value: ${file}`);
    return null;
  }

  if (!GCS_BUCKET_NAME) {
    console.error("GCS_BUCKET_NAME is not defined in environment variables.");
    return null;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name;
  const fileType = file.type;

  // Generate a unique file name to avoid collisions
  // Includes folder path in the unique name
  const uniqueFileName = `${folder}/${Date.now()}-${fileName.replace(/\s/g, '_')}`;

  try {
    const bucket = storage.bucket(GCS_BUCKET_NAME);
    const fileRef = bucket.file(uniqueFileName);

    await fileRef.save(buffer, {
      contentType: fileType,
      // 'public: true' is removed as public access is controlled by bucket-level IAM policy
      resumable: false,
    });

    // Construct the public URL for the file
    const publicUrl = `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${uniqueFileName}`;
    console.log(`File uploaded to GCS: ${publicUrl}`);
    return publicUrl;

  } catch (gcsError) {
    console.error(`Google Cloud Storage upload failed for folder ${folder}:`, gcsError);
    return null;
  }
};
