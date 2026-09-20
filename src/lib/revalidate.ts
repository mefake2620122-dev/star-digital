import { revalidatePath } from 'next/cache'

/**
 * Purge and revalidate all public Next.js cached route segments
 * so admin updates reflect across the entire website.
 */
export function revalidateAll() {
  try {
    revalidatePath('/pricing')
    revalidatePath('/services')
    revalidatePath('/service-areas')
    revalidatePath('/photos')
    revalidatePath('/reviews')
    revalidatePath('/about')
    revalidatePath('/contact')
    revalidatePath('/')
  } catch (error) {
    console.error('Revalidation error:', error)
  }
}
