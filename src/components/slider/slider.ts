import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

import './slider.scss';

@Options({})
export default class Slider extends Vue {
	@Prop({default: true}) public dots!: boolean;
	@Prop({default: true}) public arrows!: boolean;

	public slidesCount = 0;
	public currentIndex = 0;
	public currentPosition = 0;
	public sliderStep = 0;

	mounted(): void {
		this.getSlidesCount();
		this.calcSliderStep();
	}

	public getSlidesCount() {
		const sliderWrapper: HTMLElement = <HTMLElement> this.$refs.sliderWrapper;
		this.slidesCount = sliderWrapper.children.length;
	}

	public calcSliderStep() {
		const sliderWrapper: HTMLElement = <HTMLElement> this.$refs.sliderWrapper;
		if (sliderWrapper.firstElementChild) {
			this.sliderStep = parseInt(getComputedStyle(sliderWrapper.firstElementChild).width);
		}
	}
	public clickNext() {
		this.currentIndex++;
		this.currentPosition = this.sliderStep * this.currentIndex * -1;
	}

	public clickPrev() {
		this.currentIndex--;
		this.currentPosition = this.sliderStep * this.currentIndex * -1;
	}

	public setSlide(event: any,n: number) {
		event.stopPropagation();
		this.currentIndex = n;
		this.currentPosition = this.sliderStep * this.currentIndex * -1;
	}

	public mouseDownHandler(event: any) {
		if (event.target.closest('.slider')) {
			const eventClientX = event.clientX;
			// console.log(eventClientX)
			const slider: HTMLElement = <HTMLElement> this.$refs.slider;
			slider.style.transition = "all 0s linear";
			let eventStatus = true;
			slider.addEventListener('mouseup', () => {eventStatus = false; console.log('выброс отжатия')})
			slider.addEventListener('mouseover', () => {eventStatus = false; console.log('выброс наведения')})
			slider.addEventListener('mousemove', (e) => {

				if (eventStatus) {
					console.log(e.target)
					//console.log(e.clientX)
					const diff = eventClientX - e.clientX;
					const newPosition = this.currentPosition - diff;
					// console.log(newPosition);
					if ((newPosition <= 0) && (newPosition >= this.sliderStep * (this.slidesCount - 1) * -1)) {
						this.currentPosition = newPosition
					}
					// console.log(this.currentPosition);
					// const a = startPosition + eventClientX - e.clientX
					// this.currentPosition = a.toString();
				}
			});

		}


	}
}