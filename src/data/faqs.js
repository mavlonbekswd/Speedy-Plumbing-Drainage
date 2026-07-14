import { businessConfig } from './business'

// Genuinely useful FAQs. Availability/response-time answers deliberately avoid
// unconfirmed promises (no 24/7 or guaranteed-time claims).

export const faqs = [
  {
    q: 'Which areas do you cover?',
    a: 'We provide plumbing and drainage services across Cambridge, Ely, Huntingdon, Newmarket, Haverhill, St Neots, Royston, Cambourne, Sawston and the surrounding villages. See our Areas We Cover page for the full list — and if your area isn’t shown, call us on ' +
      businessConfig.phoneDisplay +
      ' as we may still be able to help.',
  },
  {
    q: 'Do you handle emergencies?',
    a: 'Yes — emergency plumbing is one of our core services. Call ' +
      businessConfig.phoneDisplay +
      ' and we’ll tell you honestly whether we can attend and how quickly. If water is flowing, we’ll talk you through isolating your supply while you wait.',
  },
  {
    q: 'How do I turn off my water in an emergency?',
    a: 'Find your internal stopcock — usually under the kitchen sink, in a downstairs toilet, or where the mains pipe enters the house — and turn it clockwise until it stops. If it’s stuck or you can’t find it, call us and we’ll help you locate the outside stop valve.',
  },
  {
    q: 'How is pricing handled?',
    a: 'We give clear pricing before work starts. For straightforward jobs we can usually indicate a price over the phone; for anything that needs inspection first, we explain what we found and agree the cost with you before going ahead. No hidden extras.',
  },
  {
    q: 'My drain keeps blocking — can you find out why?',
    a: 'Yes. A drain that repeatedly blocks usually has an underlying cause such as a damaged section, a build-up point, or poor fall. We investigate the run rather than just clearing the same blockage again, and give you plain-English options for a permanent fix.',
  },
  {
    q: 'Do you work with landlords and letting agents?',
    a: 'Yes — we handle reactive repairs, drain maintenance and plumbing checks for rental properties across the Cambridge area. Contact us at ' +
      businessConfig.email +
      ' to discuss what you need.',
  },
  {
    q: 'Will you leave the work area clean?',
    a: 'Always. We use dust sheets where needed, clean up after every job, and treat your home with respect — it’s one of the things customers mention most.',
  },
  {
    q: 'How do I get a quote?',
    a: 'Use the Request a Quote form on this site — it takes about a minute and photos help us quote accurately — or call ' +
      businessConfig.phoneDisplay +
      ' and describe the problem.',
  },
]
