/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/inicio',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
