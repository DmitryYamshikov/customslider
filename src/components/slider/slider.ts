import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import './slider.scss';

@Options({})
export default class Slider extends Vue {
	@Prop({default: true}) public dots!: boolean;
	@Prop({default: true}) public arrows!: boolean;
	@Prop({default: 1}) public slidesToShow!: number;
	@Prop({default: 1}) public slidesToScroll!: number;
	@Prop({default: true}) public slidesSwipe!: number;
	@Prop({default: 0}) public marginBetweenSlides!: number;

	public slidesCount            = 0;
	public currentIndex           = 0;
	public currentPosition        = 0;
	public sliderStep             = 0;
	public eventClientX           = 0;
	public posInStartEvent        = 0;
	public eventStatus            = false;
	public coordinatesXDifference = 0;

	mounted(): void {
		this.calcSliderStep();
		this.init();
		this.getSlidesCount();
	}

	//TODO slideNext, slidePrev, setSlide объеденить в одну перменную
	//TODO Дать нормальные названия для переменных
	//TODO рассписать комментарии
	//TODO сделать breakpoints
	//TODO добавить возможность отоброжать последний слайд на экране на половину
	//TODO делать новую инизиализацию при изменении экрана
	//TODO проверить на мобилке

	public init() {
		const slider: HTMLElement = <HTMLElement>this.$refs.slider;
		slider.style.marginRight  = `-${this.marginBetweenSlides}px`
		Array.from(this.sliderWrapper.children).forEach((item: any, index: number) => {
			const slide = document.createElement('div');
			slide.classList.add('slider__slide-item');
			slide.appendChild(item);
			this.sliderWrapper.appendChild(slide);
			slide.style.width       = `calc(${100 / this.slidesToShow}% - ${this.marginBetweenSlides}px)`;
			slide.style.marginRight = `${this.marginBetweenSlides}px`
		})
	}

	public get maxSlidePosition(): number {
		if (this.sliderWrapper.firstElementChild) {
			return ((this.slidesCount - this.slidesToShow) * (parseInt(getComputedStyle(this.sliderWrapper.firstElementChild).width) + this.marginBetweenSlides))
		}
		else return 0;
	}

	public get sliderWrapper(): HTMLElement {
		return <HTMLElement>this.$refs.sliderWrapper;
	}

	public getSlidesCount() {
		this.slidesCount = this.sliderWrapper.children.length;
	}

	public get dotsCount(): number {
		return Math.ceil(Math.abs(((this.slidesCount - this.slidesToShow) / this.slidesToScroll) + 1))
	}

	public calcSliderStep() {
		if (this.sliderWrapper.firstElementChild) {
			this.sliderStep = (parseInt(getComputedStyle(this.sliderWrapper.firstElementChild).width)) / this.slidesToShow * this.slidesToScroll;
		}
	}

	public slideNext() {
		this.sliderWrapper.classList.add('anim');
		this.currentIndex++;
		this.currentPosition = this.sliderStep * this.currentIndex;
		if (this.currentPosition >= this.maxSlidePosition) {
			this.currentPosition = this.maxSlidePosition;
		}

	}

	public slidePrev() {
		this.sliderWrapper.classList.add('anim');
		this.currentIndex--;
		this.currentPosition = this.sliderStep * this.currentIndex;
	}

	public setSlide(event: any, n: number) {
		this.sliderWrapper.classList.add('anim');
		this.currentIndex    = n;
		this.currentPosition = this.sliderStep * this.currentIndex;
		if (this.currentPosition >= this.maxSlidePosition) {
			this.currentPosition = this.maxSlidePosition;
		}
	}

	public resetActions(event: any) {
		this.eventStatus = false;

		if (this.slidesSwipe) {
			if (this.coordinatesXDifference > 0) {
				const index = Math.ceil(Math.abs(this.currentPosition / this.sliderStep));
				this.setSlide(null, index);
			}
			else if (this.coordinatesXDifference < 0) {
				const index = Math.ceil(Math.abs(this.currentPosition / this.sliderStep))-1;
				this.setSlide(null, index);
			}
		}
		this.coordinatesXDifference = 0;
	}

	public mouseDownHandler(event: any) {
		this.sliderWrapper.classList.remove('anim')
		this.eventClientX    = event.clientX;
		this.eventStatus     = true;
		this.posInStartEvent = this.currentPosition;
	}

	public mouseMoveHandler(event: any) {
		if (this.eventStatus) {
			this.coordinatesXDifference = this.eventClientX - event.clientX;
			const newPosition           = this.posInStartEvent + this.coordinatesXDifference;


			if ((newPosition >= 0) && (newPosition <= this.maxSlidePosition)) {
				this.currentPosition = newPosition;
				if (this.slidesSwipe) {
					if ((this.coordinatesXDifference >= 0) && ((this.sliderStep * 0.3) < Math.abs(this.coordinatesXDifference))) {
						this.eventStatus = false;
						this.slideNext();
					}
					if ((this.coordinatesXDifference <= 0) && ((this.sliderStep * 0.3) < Math.abs(this.coordinatesXDifference))) {
						this.eventStatus = false;
						this.slidePrev();
					}
				}
			}
		}
	}
}