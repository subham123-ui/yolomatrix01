import Hero from "@/components/hero"
import SearchForm from "@/components/search-form"
import LuxuryCollection from "@/components/luxury-collection"
import WhyChooseUs from "@/components/why-choose-us"
import Footer from "@/components/footer"
import FloatingActions from "@/components/floating-actions"
import ClientShowcase from '@/components/ClientShowcase'
import  TravelPackages from '@/components/TravelPackages'
import CallIcon from "@/components/call/call-icon"
import TawkTo from "@/components/TawkTo"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <SearchForm />
      <TravelPackages/>
      <LuxuryCollection />
      <WhyChooseUs />
      <ClientShowcase/>
      <Footer />
      <CallIcon/>
      <TawkTo/>
      <FloatingActions />
    </main>
  )
}
