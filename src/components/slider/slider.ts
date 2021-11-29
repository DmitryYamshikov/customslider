import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import sliderParams from './sliderParams'
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
	/** Свободный режим при ручном перетаскивании нет привязки к шагу слайдера */
	@Prop({default: false}) public freeMode!: boolean;
	/** Расстояние между слайдами */
	@Prop({default: 0}) public marginBetweenSlides!: number;
	/** Настройки слайдера под маленькие экраны */
	@Prop({default: {}}) public breakpoints!: any;
	/** Размер стрелок big/small */
	@Prop({default: 'big'}) public arrowSize!: string;
	/** Положение точек left/center/right */
	@Prop({default: 'left'}) public dotsPos!: string;
	/** Переодичность автоматического перелистывания */
	@Prop({default: 0}) public timer!: number;

	/** Настройки слайдера */
	public params: sliderParams   = {};
	/** Общее количество слайдов */
	public slidesCount            = 0;
	/** Текущий индекс(шаг) слайдера */
	public currentIndex           = 0;
	/** Текущее значение position обложки слайдов */
	public currentPosition        = 0;
	/** Начальная координата X указателя при срабатывании pointerDown */
	public eventClientX           = 0;
	/** Значение position перед перетаскиванием слайдо мышью/пальцем */
	public posInStartEvent        = 0;
	/** Работает ли event перетакскивания слайдов */
	public isEventTouchWork       = false;
	/** Разница между стартовым положением курсора и конечным при перетаскивании слайда */
	public coordinatesXDifference = 0;

	mounted(): void {
		this.setParams();
		this.init();
		this.setMarginToSlides();
		this.getSlidesCount();

		window.addEventListener('resize', () => {
			this.setSlide(0);
			this.setParams();
			this.setMarginToSlides();
		})

		this.setTimerSlide();
	}

	/**
	 * Получаем шаг слайдера
	 *
	 * @return {number}
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public get sliderStep(): number {
		if (this.sliderWrapper && this.params.slidesToShow && this.params.slidesToScroll) {
			return ((parseFloat(getComputedStyle(this.sliderWrapper).width) / this.params.slidesToShow) * this.params.slidesToScroll);
		}
		else return 0;
	}

	/**
	 * Получает максимально возможное смещение обложки слайдов по оси X
	 *
	 * @return {number}
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public get maxPos(): number {
		if (this.sliderWrapper.firstElementChild && this.params.slidesToShow && (this.params.marginBetweenSlides !== undefined)) {
			return ((this.slidesCount - this.params.slidesToShow) *
				(parseFloat(getComputedStyle(this.sliderWrapper.firstElementChild).width) +
				this.params.marginBetweenSlides));
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
	 * Получаем кол-во точек для их отрисовки
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public get dotsCount(): number {
		if (this.params.slidesToShow && this.params.slidesToScroll) {
			return Math.ceil(Math.abs(((this.slidesCount - this.params.slidesToShow) / this.params.slidesToScroll) + 1));
		}
		else return 0;
	}

	/**
	 * Высталяем параметры слайдера на основании props и ширины экрана
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public setParams(): void {
		const prop = Object.entries(this.$props).filter(item => item[0] !== 'breakpoints');

		this.params = {...Object.fromEntries(prop)};

		if (window.innerWidth <= 1200 && window.innerWidth > 992) {
			this.params = {...this.params, ...this.breakpoints[1200]};
		}
		if (window.innerWidth <= 992 && window.innerWidth > 768) {
			this.params = {...this.params, ...this.breakpoints[992]};
		}
		if (window.innerWidth <= 768 && window.innerWidth > 576) {
			this.params = {...this.params, ...this.breakpoints[768]};
		}
		if (window.innerWidth <= 576) {
			this.params = {...this.params, ...this.breakpoints[576]};
		}
	}

	/**
	 * Высталяем отступы для слайдов при их наличии
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public setMarginToSlides(): void {
		const slides = this.sliderWrapper.querySelectorAll('[data-name="slide"]');

		if (slides) {
			slides.forEach((item: any) => {
				if (this.params.slidesToShow) {
					item.style.width       = `calc(${100 / this.params.slidesToShow}% - ${this.params.marginBetweenSlides}px)`;
					item.style.marginRight = `${this.params.marginBetweenSlides}px`;
				}
			});
		}
	}

	/**
	 * Первичная настройка слайдов и их размеров
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public init(): void {
		Array.from(this.sliderWrapper.children).forEach((item: Element) => {
			const slide = document.createElement('div');

			slide.classList.add('slider__slide-item');
			slide.appendChild(item);
			slide.setAttribute('data-name', 'slide');
			this.sliderWrapper.appendChild(slide);
		});
	}

	/**
	 * Устанавливаем таймер для автоматического перелистывания
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public setTimerSlide(): void {
		if (this.params.timer) {
			setInterval(() => {
				if (this.currentPosition === this.maxPos) {
					this.setSlide(0);

					return;
				}
				this.slideNext();
			}, this.params.timer);
		}
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
	 * Листаем следующий слайд
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public slideNext(): void {
		this.sliderWrapper.classList.add('anim');
		this.currentIndex++;
		this.currentPosition = this.sliderStep * this.currentIndex;
		if (this.currentPosition >= this.maxPos) {
			this.currentPosition = this.maxPos;
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
		if (this.currentPosition >= this.maxPos) {
			this.currentPosition = this.maxPos;
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
	public pointerDownHandler(event: PointerEvent): void {
		this.sliderWrapper.classList.remove('anim');
		this.eventClientX     = event.clientX;
		this.isEventTouchWork = true;
		this.posInStartEvent  = this.currentPosition;
	}

	/**
	 * Событие движения указателя по сладеру. Указатель тянет за собой слайды.
	 *
	 * @param {PointerEvent} event
	 *
	 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
	 */
	public pointerMoveHandler(event: PointerEvent): void {
		if (this.isEventTouchWork) {
			// разница между начальной точки движения курсора и последующей
			this.coordinatesXDifference = this.eventClientX - event.clientX;
			const newPosition           = this.posInStartEvent + this.coordinatesXDifference;

			// проверяем не вытащили ли слайды за пределы нулевого или максимального положения
			if ((newPosition >= 0) && (newPosition <= this.maxPos)) {
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
				if (this.freeMode) {
					this.currentIndex = Math.round(this.currentPosition / this.sliderStep);
				}
			}
		}
	}
}
