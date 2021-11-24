/**
 * Интерфейс настроек слайдера
 *
 * @author Ямщиков Дмитрий <Yamschikov.ds@dns-shop.ru>
 */
export default interface SliderParams {
	/** Вкл/Выкл точек навигации */
	dots?: boolean,

	/** Вкл/Выкл стрелок */
	arrows?: boolean,

	/** Свободный режим при ручном перетаскивании нет привязки к шагу слайдера */
	freeMode?: boolean,

	/** Сколько слайдов показывать */
	slidesToShow?: number,

	/** По сколько слайдов пролистывать за раз */
	slidesToScroll?: number,

	/** Расстояние между слайдами */
	marginBetweenSlides?: number,

	/** Размер стрелок big/small */
	arrowSize?: string,

	/** Положение точек left/center/right */
	dotsPos?: string,

	/** Переодичность автоматического перелистывания */
	timer?: number
}