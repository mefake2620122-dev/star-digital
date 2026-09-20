import { revalidatePath } from 'next/cache'

/**
 * Purge and revalidate all public Next.js cached route segments
 * so admin updates reflect across the entire website.
 */
export function revalidateAll() {
  try {
    revalidatePath('/', 'layout')
    revalidatePath('/')
    revalidatePath('/pricing')
    revalidatePath('/services')
    revalidatePath('/services/[slug]')
    revalidatePath('/photos')
    revalidatePath('/reviews')
    revalidatePath('/service-areas')
    revalidatePath('/about')
    revalidatePath('/contact')
  } catch (error) {
    console.error('Revalidation error:', error)
  }
}
