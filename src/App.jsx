import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { routeLoaders } from './lib/routes'

// Route-based code splitting: every page is its own chunk. Loaders are shared
// with the navbar's prefetch-on-hover (src/lib/routes.js).
const Home = lazy(routeLoaders.home)
const Services = lazy(routeLoaders.services)
const ServicePage = lazy(routeLoaders.servicePage)
const Projects = lazy(routeLoaders.projects)
const AreasWeCover = lazy(routeLoaders.areasWeCover)
const LocationPage = lazy(routeLoaders.locationPage)
const About = lazy(routeLoaders.about)
const ReviewsPage = lazy(routeLoaders.reviews)
const FaqsPage = lazy(routeLoaders.faqs)
const Blog = lazy(routeLoaders.blog)
const BlogPost = lazy(routeLoaders.blogPost)
const Contact = lazy(routeLoaders.contact)
const Quote = lazy(routeLoaders.quote)
const NotFound = lazy(routeLoaders.notFound)

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServicePage />} />
        <Route path="projects" element={<Projects />} />
        <Route path="areas-we-cover" element={<AreasWeCover />} />
        <Route path="areas/:slug" element={<LocationPage />} />
        <Route path="about" element={<About />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="faqs" element={<FaqsPage />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="contact" element={<Contact />} />
        <Route path="quote" element={<Quote />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
