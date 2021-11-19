import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import './slider.scss';

/**
 * Компонент слайдера
 * в <slot> записываются слайды без обложки
 *
 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
 */
@Options({})
export default class Slider extends Vue {
	/** Вкл/Выкл точек навигации */
	@Prop({default: true}) public dots!: boolean;
	/** Вкл/Выкл стрелок */
	@Prop({default: true}) public arrows!: boolean;
	/** Сколько слайдов показывать */
	@Prop({default: 1}) public slidesToShow!: number;
	/** По сколько слайдов пролистывать за раз */
	@Prop({default: 1}) public slidesToScroll!: number;
	/** Свободный режим при ручном перетаскивании нет привязки к шагу слайдера*/
	@Prop({default: false}) public freeMode!: boolean;
	/** Расстояние между слайдами */
	@Prop({default: 0}) public marginBetweenSlides!: number;

	/** Общее количество слайдов */
	public slidesCount            = 0;
	/** Текущий индекс(шаг) слайдера */
	public currentIndex           = 0;
	/** Текущее значение position обложки слайдов */
	public currentPosition        = 0;
	/** Шаг слайда ( на сколько меняется position) */
	public sliderStep             = 0;
	/** Начальная координата X указателя при срабатывании pointerDown */
	public eventClientX           = 0;
	/** Значение position перед перетаскиванием слайдо мышью/пальцем */
	public posInStartEvent        = 0;
	/** Работает ли event перетакскивания слайдов */
	public isEventTouchWork       = false;
	/** Разница между стартовым положением курсора и конечным при перетаскивании слайда */
	public coordinatesXDifference = 0;

	mounted(): void {
		this.calcSliderStep();
		this.init();
		this.getSlidesCount();
	}

	//TODO slideNext, slidePrev, setSlide объеденить в одну перменную
	//TODO сделать breakpoints
	//TODO делать новую инизиализацию при изменении экрана
	//TODO проверить на мобилке

	public init(): void {
		const slider: HTMLElement = <HTMLElement>this.$refs.slider;
		slider.style.marginRight  = `-${this.marginBetweenSlides}px`
		Array.from(this.sliderWrapper.children).forEach((item: Element) => {
			const slide = document.createElement('div');
			slide.classList.add('slider__slide-item');
			slide.appendChild(item);
			this.sliderWrapper.appendChild(slide);
			slide.style.width       = `calc(${100 / this.slidesToShow}% - ${this.marginBetweenSlides}px)`;
			slide.style.marginRight = `${this.marginBetweenSlides}px`
		})
	}

	/**
	 * Получает максимально возможное смещение обложки слайдов по оси X
	 *
	 * @return {number}
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public get maxSlidePosition(): number {
		if (this.sliderWrapper.firstElementChild) {
			return ((this.slidesCount - this.slidesToShow) * (parseInt(getComputedStyle(this.sliderWrapper.firstElementChild).width) + this.marginBetweenSlides))
		}
		else return 0;
	}

	/**
	 * Получение из DOM обложки слайдов
	 *
	 * @return {HTMLElement}
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public get sliderWrapper(): HTMLElement {
		return <HTMLElement>this.$refs.sliderWrapper;
	}

	/**
	 * Считаем общее кол-во слайдов
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public getSlidesCount(): void {
		this.slidesCount = this.sliderWrapper.children.length;
	}

	/**
	 * Получаем кол-во точек для их отрисовки
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public get dotsCount(): number {
		return Math.ceil(Math.abs(((this.slidesCount - this.slidesToShow) / this.slidesToScroll) + 1))
	}

	/**
	 * Высчитываем шаг слайдера
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public calcSliderStep(): void {
		if (this.sliderWrapper.firstElementChild) {
			this.sliderStep = (parseInt(getComputedStyle(this.sliderWrapper.firstElementChild).width)) / this.slidesToShow * this.slidesToScroll;
		}
	}

	/**
	 * Листаем следующий слайд
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public slideNext(): void {
		this.sliderWrapper.classList.add('anim');
		this.currentIndex++;
		this.currentPosition = this.sliderStep * this.currentIndex;
		if (this.currentPosition >= this.maxSlidePosition) {
			this.currentPosition = this.maxSlidePosition;
		}

	}

	/**
	 * Листаем предыдущий слайд
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public slidePrev(): void {
		this.sliderWrapper.classList.add('anim');
		this.currentIndex--;
		this.currentPosition = this.sliderStep * this.currentIndex;
	}

	/**
	 * Перелистываем на определенный слайд
	 *
	 * @param {number} number порядковый номер слайда
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public setSlide(number: number): void {
		this.sliderWrapper.classList.add('anim');
		this.currentIndex    = number;
		this.currentPosition = this.sliderStep * this.currentIndex;

		/* Если при перелистывании слайдера справа остается пустое место,
		 то сладер прибивается к правому краю*/
		if (this.currentPosition >= this.maxSlidePosition) {
			this.currentPosition = this.maxSlidePosition;
		}
	}

	/**
	 * Сбрасываем события (task) со слайдера и округляем конечное положение обложки
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public resetActions(): void {
		this.isEventTouchWork = false;

		if (!this.freeMode) {
			if (this.coordinatesXDifference > 0) {
				const index = Math.ceil(Math.abs(this.currentPosition / this.sliderStep));
				this.setSlide(index);
			}
			else if (this.coordinatesXDifference < 0) {
				const index = Math.ceil(Math.abs(this.currentPosition / this.sliderStep)) - 1;
				this.setSlide(index);
			}
		}
		this.coordinatesXDifference = 0;
	}

	/**
	 * Событие нажатия на слайдер. Включает событие перетаскивания
	 *
	 * @param {PointerEvent} event
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public mouseDownHandler(event: PointerEvent): void {
		this.sliderWrapper.classList.remove('anim')
		this.eventClientX     = event.clientX;
		this.isEventTouchWork = true;
		this.posInStartEvent  = this.currentPosition;
	}

	/**
	 * Событие движения мыши по сладеру. Указатель тянет за собой слайды.
	 *
	 * @param {PointerEvent} event
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public mouseMoveHandler(event: PointerEvent): void {
		if (this.isEventTouchWork) {
			this.coordinatesXDifference = this.eventClientX - event.clientX;
			const newPosition           = this.posInStartEvent + this.coordinatesXDifference;


			if ((newPosition >= 0) && (newPosition <= this.maxSlidePosition)) {
				this.currentPosition = newPosition;
				if (!this.freeMode) {
					if ((this.coordinatesXDifference >= 0) && ((this.sliderStep * 0.3) < Math.abs(this.coordinatesXDifference))) {
						this.isEventTouchWork = false;
						this.slideNext();
					}
					if ((this.coordinatesXDifference <= 0) && ((this.sliderStep * 0.3) < Math.abs(this.coordinatesXDifference))) {
						this.isEventTouchWork = false;
						this.slidePrev();
					}
				}
			}
		}
	}
}