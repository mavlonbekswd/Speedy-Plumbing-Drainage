import { Component } from 'react'
import { businessConfig } from '../../data/business'

/**
 * Last line of defence for route content: a page that throws renders a
 * recoverable message instead of unmounting the whole site to a black
 * screen. Keyed by pathname in Layout, so navigating elsewhere retries
 * cleanly.
 */
export default class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Surface in the console for debugging — never silently swallow.
    console.error('Route error boundary caught:', error, info?.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-charcoal px-5 py-32">
        <div className="max-w-xl text-center">
          <p className="eyebrow text-electric">Something went wrong</p>
          <h1 className="display-lg mt-4 text-white">This page hit a snag.</h1>
          <p className="mt-5 text-base leading-relaxed text-steel">
            Try reloading — or call us on{' '}
            <a href={businessConfig.phoneHref} className="font-semibold text-electric underline-offset-4 hover:underline">
              {businessConfig.phoneDisplay}
            </a>{' '}
            and we’ll help right away.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="inline-flex min-h-12 items-center justify-center rounded-sm bg-electric px-6 py-3 text-sm font-semibold tracking-wide text-charcoal uppercase transition-colors hover:bg-white"
            >
              Try again
            </button>
            <a
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-white/25 px-6 py-3 text-sm font-semibold tracking-wide text-white uppercase transition-colors hover:border-electric hover:text-electric"
            >
              Back to homepage
            </a>
          </div>
        </div>
      </div>
    )
  }
}
