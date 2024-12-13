function CustomEmblaCarousel(rootSelector = ".embla", options = {}) {
  options = options || {};
  this.activeClassName = options.activeClassName || "active";
  this.indicatorSelector = options.indicatorSelector || ".indicators";
  this.dotIndicatorClassName = "dots";
  this.emblaNode = document.querySelector(
    rootSelector ? rootSelector : ".embla"
  );
  
  if (!this.emblaNode){
    console.warn('Error: Root Node not found.')
    return false;
  }

  this.options = options.options || { loop: true };
  this.autoplayOptions = options.autoplayOptions || {
    delay: 3000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
    rootNode: (emblaRoot) => emblaRoot.parentElement,
  };
  this.plugins = [EmblaCarouselAutoplay(this.autoplayOptions)];
  
  if (!this.emblaNode) {
    return;
  }

  const emblaApi = EmblaCarousel(
    this.emblaNode.querySelector(".embla__viewport"),
    this.options, this.emblaNode.getAttribute('data-autoplay') && this.plugins
  );

  const prevButton = this.emblaNode.querySelector(".embla__prev");
  const nextButton = this.emblaNode.querySelector(".embla__next");
  const indicators = this.emblaNode.querySelector(this.indicatorSelector);
  if (indicators) {
    indicators.innerHTML = "";
  }

  prevButton?.addEventListener("click", () => {
    if (emblaApi.canScrollPrev()) {
      emblaApi.scrollPrev();

    }
  });

  nextButton?.addEventListener("click", () => {
    if (emblaApi.canScrollNext()) {
      emblaApi.scrollNext();

    }
  });

  const slides = emblaApi.scrollSnapList();
  slides.forEach((_, index) => {
    const indicator = document.createElement("button");
    if (index === 0) indicator.classList.add(this.activeClassName);

    indicator?.classList.add(this.dotIndicatorClassName);
    indicator?.addEventListener("click", () => emblaApi.scrollTo(index));
    indicators?.appendChild(indicator);
  });

  if (indicators) {
    emblaApi.on("select", () => this.updateIndicators(indicators, emblaApi));
  }

  return emblaApi;
}

CustomEmblaCarousel.prototype.updateIndicators = function (
  indicators,
  emblaApi
) {
  const previousIndex = emblaApi.previousScrollSnap();
  const previousIndicator = indicators.children[previousIndex];
  previousIndicator.classList.remove(this.activeClassName);

  const currentIndex = emblaApi.selectedScrollSnap();
  const currentIndicator = indicators.children[currentIndex];
  currentIndicator.classList.add(this.activeClassName);
};
