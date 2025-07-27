import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ 
  projectId, 
  dataset
})

export const urlFor = (source: SanityImageSource) => {
  if (!source) return null;
  try {
    return builder.image(source);
  } catch (error) {
    console.error('Error creating image URL:', error);
    return null;
  }
}
