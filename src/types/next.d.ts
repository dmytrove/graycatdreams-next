// Fix for Next.js 15.3.2 type system changes
declare module 'next' {
  interface PageProps {
    params?: Record<string, string>;  // More specific than any
    searchParams?: Record<string, string | string[] | undefined>;  // More specific than any
  }
}
