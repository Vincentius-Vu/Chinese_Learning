// src/lib/driveSync.js
const BACKUP_FILE_NAME = "chinese_learning_backup.json";

export async function findBackupFile(accessToken) {
  const url = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${BACKUP_FILE_NAME}'&fields=files(id, modifiedTime)`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!response.ok) throw new Error(`[${response.status}] Failed to find backup file`);
  const data = await response.json();
  return data.files && data.files.length > 0 ? data.files[0] : null;
}

export async function downloadBackup(accessToken, fileId) {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!response.ok) throw new Error(`[${response.status}] Failed to download backup`);
  return await response.json();
}

export async function uploadBackup(accessToken, fileData, existingFileId = null) {
  const metadata = {
    name: BACKUP_FILE_NAME,
    parents: ["appDataFolder"],
  };

  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  form.append(
    "file",
    new Blob([JSON.stringify(fileData)], { type: "application/json" })
  );

  let url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
  let method = "POST";

  if (existingFileId) {
    url = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart`;
    method = "PATCH";
  }

  const response = await fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    body: form
  });

  if (!response.ok) throw new Error(`[${response.status}] Failed to create or update backup`);
  return await response.json();
}
