"use client"

import { Calendar } from "lucide-react"
import { useEffect, useState } from "react"

interface TimelineItem {
  weeks: string
  title: string
  description: string
}

interface RefinedTimelineSectionProps {
  timelineItems: TimelineItem[]
}

export function RefinedTimelineSection({ timelineItems }: RefinedTimelineSectionProps) {
  const [activeItem, setActiveItem] = useState<number | null>(null)
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [expandedItem, setExpandedItem] = useState<number | null>(null)
  
  // Handle scroll-based activation with a more subtle approach
  useEffect(() => {
    const handleScroll = () => {
      const timelineElements = document.querySelectorAll('.timeline-item')
      const scrollPosition = window.scrollY + window.innerHeight * 0.7
      
      timelineElements.forEach((element, index) => {
        if (element instanceof HTMLElement) {
          const elementTop = element.offsetTop
          if (elementTop <= scrollPosition) {
            setActiveItem(index)
          }
        }
      })
    }
    
    window.addEventListener('scroll', handleScroll)
    // Trigger once on load
    setTimeout(handleScroll, 300)
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <section
      id="timeline"
      className="w-full py-12 md:py-16 lg:py-20 bg-gray-900 text-white relative overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 reveal-on-scroll">
          Program Timeline
        </h2>
        
        {/* Desktop Timeline (hidden on mobile) */}
        <div className="hidden md:block relative pb-8">
          {/* Timeline line - more subtle */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-ruby-500/80 to-ruby-500/20"></div>
          
          <div className="space-y-24">
            {timelineItems.map((item, index) => (
              <div 
                key={index} 
                className={`timeline-item relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Timeline node - smaller and more subtle */}
                <div 
                  className={`absolute left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full z-10 ${
                    activeItem === index 
                      ? 'bg-ruby-500 shadow-glow-sm' 
                      : 'bg-gray-600'
                  } transition-all duration-500`}
                ></div>
                
                {/* Content card - cleaner design */}
                <div 
                  className={`w-5/12 reveal-on-scroll ${
                    index % 2 === 0 ? 'pr-10' : 'pl-10'
                  } ${activeItem === index ? 'opacity-100' : 'opacity-70'} 
                  transition-all duration-500 ease-in-out`}
                >
                  <div 
                    className={`bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-md border-l-2 ${
                      activeItem === index || hoveredItem === index ? 'border-ruby-500' : 'border-gray-700'
                    } hover:border-ruby-500 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer`}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-gray-300">
                        <span className="text-sm font-medium uppercase tracking-wider">{item.weeks}</span>
                      </div>
                      <div className={`text-ruby-400 transition-transform duration-200 ${
                        expandedItem === index ? 'rotate-45' : ''
                      }`}>
                        +
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300 text-sm">{item.description}</p>
                    
                    {expandedItem === index && (
                      <div className="mt-4 pt-4 border-t border-gray-700 animate-fadeIn">
                        <div className="text-xs text-gray-400 space-y-2">
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-ruby-500 rounded-full mr-2"></span>
                            Interactive coding exercises
                          </div>
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-ruby-500 rounded-full mr-2"></span>
                            Live instructor support
                          </div>
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-ruby-500 rounded-full mr-2"></span>
                            Hands-on project work
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Connector line - thinner and more subtle */}
                  <div 
                    className={`absolute top-1/2 transform -translate-y-1/2 h-px ${
                      activeItem === index ? 'bg-ruby-500/70' : 'bg-gray-700'
                    } ${index % 2 === 0 ? 'right-0 w-10' : 'left-0 w-10'} 
                    transition-all duration-500`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Timeline (visible only on mobile) - cleaner vertical design */}
        <div className="md:hidden relative">
          {/* Timeline line - thinner and more elegant */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-ruby-500/70 via-ruby-500/50 to-ruby-500/20"></div>
          
          <div className="space-y-12">
            {timelineItems.map((item, index) => (
              <div 
                key={index} 
                className="timeline-item relative pl-12 reveal-on-scroll"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Timeline node - smaller and more subtle */}
                <div 
                  className={`absolute left-4 top-6 transform -translate-x-1/2 w-2 h-2 rounded-full ${
                    activeItem === index 
                      ? 'bg-ruby-500' 
                      : 'bg-gray-600'
                  } transition-all duration-300`}
                ></div>
                
                {/* Content card - cleaner design */}
                <div 
                  className={`bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-sm border-l-2 ${
                    activeItem === index || hoveredItem === index ? 'border-ruby-500' : 'border-gray-700'
                  } hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer`}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-ruby-500/80" />
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-400">{item.weeks}</span>
                    </div>
                    <div className={`text-ruby-400 text-sm transition-transform duration-200 ${
                      expandedItem === index ? 'rotate-45' : ''
                    }`}>
                      +
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-300 text-xs leading-relaxed">{item.description}</p>
                  
                  {expandedItem === index && (
                    <div className="mt-3 pt-3 border-t border-gray-700 animate-fadeIn">
                      <div className="text-xs text-gray-400 space-y-1">
                        <div className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-ruby-500 rounded-full mr-2"></span>
                          Interactive exercises
                        </div>
                        <div className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-ruby-500 rounded-full mr-2"></span>
                          Live support
                        </div>
                        <div className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-ruby-500 rounded-full mr-2"></span>
                          Project work
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Connector line - thinner */}
                <div 
                  className={`absolute left-4 top-6 w-8 h-px ${
                    activeItem === index ? 'bg-ruby-500/60' : 'bg-gray-700/60'
                  } transition-all duration-300`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}