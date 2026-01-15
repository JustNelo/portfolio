import { AboutHeader, AboutFooter, AboutContent, InfiniteScroll } from './about'

export default function AboutSection(): React.JSX.Element {
  return (
    <section className="relative h-screen overflow-hidden backdrop-blur-sm">
      {/* Header - Fixed position */}
      <div className="fixed top-0 left-0 right-0 z-10 p-6 md:p-10 lg:p-12 pointer-events-none">
        <div className="grid grid-cols-8 sm:grid-cols-24 gap-16">
          <div className="col-span-8 sm:col-span-10 md:col-span-11 sm:col-start-1 pointer-events-auto">
            <AboutHeader />
          </div>
        </div>
      </div>

      {/* Content - Full page with grid positioning to the right */}
      <InfiniteScroll>
        <AboutContent />
      </InfiniteScroll>

      {/* Footer - Fixed position bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-10 p-6 md:p-10 lg:p-12 pointer-events-none">
        <div className="sm:grid sm:grid-cols-24 gap-16">
          <div className="sm:col-span-10 md:col-span-7 pointer-events-auto">
            <AboutFooter />
          </div>
        </div>
      </div>
    </section>
  )
}
