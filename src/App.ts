import Slider from '@/components/slider/slider.vue';
import {Options, Vue} from 'vue-class-component';

@Options({
	components: {
		Slider
	}
})
export default class App extends Vue {
	public breakpoints = {
		1200: {
			dots: true,
			arrows: true,
			freeMode: false,
			slidesToShow: 4,
			slidesToScroll: 2,
			marginBetweenSlides: 10,
		},
		992: {
			slidesToShow: 3,
			slidesToScroll: 3,
			dots: true,
			arrows: true,
			marginBetweenSlides: 50,
		},
		768: {
			slidesToShow: 2,
			dots: true,
			arrows: true,

		},
		576: {
			slidesToShow: 2,
			dots: true,
			arrows: false,
			marginBetweenSlides: 10,
		}
	}
}
