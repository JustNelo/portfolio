import { AboutHeader, AboutFooter, AboutContent, InfiniteScroll } from '@/app/about/_components'
import { NavBar } from '@/components/ui'

export default function AboutSection(): React.JSX.Element {
  return (
    <section className="relative h-screen overflow-hidden">
      <NavBar 
        links={[
          { href: '/projects', label: 'Projets', position: 'right' },
        ]} 
      />

      <div className="hidden sm:block fixed top-0 left-0 right-0 z-10 p-6 md:p-10 lg:p-12 pointer-events-none">
        <div className="grid grid-cols-24 gap-8 md:gap-16">
          <div className="col-span-12 md:col-span-11 lg:col-span-10 pointer-events-auto">
            <AboutHeader />
          </div>
        </div>
      </div>

      <InfiniteScroll>
        <div className="relative sm:pt-20 pb-0 sm:pb-20">
          <div className="sm:hidden p-4">
            <AboutHeader />
          </div>
          <AboutContent />
          <div className="sm:hidden p-4 mt-4">
            <AboutFooter />
          </div>
        </div>
      </InfiniteScroll>

      <div className="hidden sm:block fixed bottom-0 left-0 right-0 z-10 p-6 md:p-10 lg:p-12 pointer-events-none">
        <div className="grid grid-cols-24 gap-8 md:gap-16">
          <div className="col-span-10 md:col-span-7 pointer-events-auto">
            <AboutFooter />
          </div>
        </div>
      </div>
    </section>
  )
}