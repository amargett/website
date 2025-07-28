import { projectId, dataset } from '../env'

export const urlForFile = (fileAsset: any) => {
  if (!fileAsset || !fileAsset._ref) return null;
  
  try {
    // Extract the file ID from the asset reference
    const assetRef = fileAsset._ref;
    
    // Try different URL patterns
    const url1 = `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetRef}`;
    const url2 = `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetRef}.mp4`;
    
    // Remove the file- prefix and extension to get the file ID
    const fileId = assetRef.replace('file-', '').split('-').slice(0, -1).join('-');
    const url3 = `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileId}.mp4`;
    
    // Try the first URL pattern (without extension) first
    return url1;
  } catch (error) {
    console.error('Error creating file URL:', error);
    return null;
  }
} 