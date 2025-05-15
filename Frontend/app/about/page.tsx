import Image from "next/image"
import { Button } from "@/components/ui/button"
import FloatingActions from "@/components/floating-actions"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-0">
      {/* Hero Banner */}
      <section className="relative h-[50vh] w-full">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="About YoloMatrix"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-4xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">About YoloMatrix</h1>
            <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-3xl mx-auto">
              Redefining luxury experiences since 2020
            </p>
          </div>
        </div>
      </section>

      {/* Company Intro */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                YoloMatrix was founded with a simple yet ambitious vision: to create unparalleled luxury experiences for
                those who understand that life should be lived to the fullest.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our journey began when our founders, seasoned travelers and luxury enthusiasts, recognized a gap in the
                market for truly exceptional rental experiences that combine premium assets with personalized service.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Today, we've grown into a global luxury platform offering the finest selection of mansions, yachts,
                jets, exotic cars, and premium apartments, all supported by our signature concierge service.
              </p>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/placeholder.svg?height=800&width=1200"
                alt="YoloMatrix Founders"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  To transform luxury rentals from mere transactions into extraordinary experiences that create lasting
                  memories. We strive to exceed expectations by offering not just premium assets, but a complete
                  lifestyle solution backed by impeccable service.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  To become the global standard for luxury experiences, recognized for our uncompromising quality,
                  attention to detail, and ability to make the extraordinary accessible. We envision a world where
                  luxury is defined not by exclusivity alone, but by the quality of experiences.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Alexandra Reynolds",
                  role: "Founder & CEO",
                  image: "/placeholder.svg?height=400&width=400",
                },
                {
                  name: "Marcus Chen",
                  role: "Chief Experience Officer",
                  image: "/placeholder.svg?height=400&width=400",
                },
                {
                  name: "Sophia Williams",
                  role: "Head of Concierge",
                  image: "/placeholder.svg?height=400&width=400",
                },
                {
                  name: "James Rodriguez",
                  role: "Global Partnerships Director",
                  image: "/placeholder.svg?height=400&width=400",
                },
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative mx-auto w-48 h-48 mb-4 rounded-full overflow-hidden shadow-lg">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Excellence",
                  description:
                    "We are committed to excellence in every aspect of our service, from the properties we select to the experiences we create.",
                },
                {
                  title: "Personalization",
                  description:
                    "We believe that true luxury is personal. We tailor every experience to the unique preferences and desires of our clients.",
                },
                {
                  title: "Integrity",
                  description:
                    "We operate with complete transparency and honesty, building trust with our clients through every interaction.",
                },
              ].map((value, index) => (
                <div key={index} className="bg-white dark:bg-gray-950 p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Experience Luxury?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Join the YoloMatrix community and discover a world of extraordinary experiences tailored just for you.
            </p>
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10"
            >
              Contact Us Today
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </main>
  )
}
