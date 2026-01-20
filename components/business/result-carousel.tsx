"use client"

import * as React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

import { cn } from "@/lib/utils"
import { ResultCard } from "./result-card"
import type { Monologue } from "@/types"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"

export interface ResultCarouselProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect" | "results"> {
  /** Array of monologue results to display */
  results: Monologue[]
  /** Currently selected result index */
  currentIndex: number
  /** Callback when a result is selected */
  onSelectResult: (index: number) => void
}

function ResultCarousel({
  results,
  currentIndex,
  onSelectResult,
  className,
  ...props
}: ResultCarouselProps) {
  const swiperRef = React.useRef<SwiperType | null>(null)

  // Sync swiper with external state
  React.useEffect(() => {
    if (swiperRef.current && swiperRef.current.activeIndex !== currentIndex) {
      swiperRef.current.slideTo(currentIndex)
    }
  }, [currentIndex])

  const handleSlideChange = (swiper: SwiperType) => {
    if (swiper.activeIndex !== currentIndex) {
      onSelectResult(swiper.activeIndex)
    }
  }

  return (
    <div
      data-slot="result-carousel"
      className={cn("w-full", className)}
      {...props}
    >
      <Swiper
        modules={[Pagination]}
        spaceBetween={16}
        slidesPerView={1}
        centeredSlides
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-muted-foreground/30",
          bulletActiveClass:
            "swiper-pagination-bullet-active !bg-primary !opacity-100",
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChange={handleSlideChange}
        initialSlide={currentIndex}
        className="pb-10"
      >
        {results.map((result, index) => (
          <SwiperSlide key={result.id}>
            <ResultCard
              result={result}
              selected={index === currentIndex}
              onSelect={() => onSelectResult(index)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom pagination indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {results.map((_, index) => (
          <button
            key={index}
            onClick={() => onSelectResult(index)}
            className={cn(
              "size-2 rounded-full transition-all",
              index === currentIndex
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Go to result ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export { ResultCarousel }
