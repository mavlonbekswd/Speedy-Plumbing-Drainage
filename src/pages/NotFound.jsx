import { Phone } from 'lucide-react'
import Seo from '../lib/seo'
import { businessConfig } from '../data/business'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found"
        description="The page you were looking for doesn’t exist. Find plumbing and drainage services across Cambridge and surrounding areas."
        path="/404"
      />
      <section className="flex min-h-screen flex-col items-center justify-center bg-charcoal px-5 text-center">
        <p className="font-display text-[clamp(6rem,20vw,16rem)] leading-none text-white/10">404</p>
        <h1 className="display-lg -mt-6 text-white">This pipe leads nowhere.</h1>
        <p className="mt-5 max-w-md text-lg text-steel">
          The page you’re after has moved or never existed — but the plumbers are very much real.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button to="/" variant="light" size="lg">
            Back to Home
          </Button>
          <Button href={businessConfig.phoneHref} icon={Phone} size="lg">
            {businessConfig.phoneDisplay}
          </Button>
        </div>
      </section>
    </>
  )
}
