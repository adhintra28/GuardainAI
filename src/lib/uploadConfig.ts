import path from 'path';

export function getUploadRoot(): string {
  return process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads');
}
