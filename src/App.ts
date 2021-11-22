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
			dots: false,
			arrows: false,
			freeMode: false,
			slidesToShow: 5,
			slidesToScroll: 1,
			marginBetweenSlides: 10,
		},
		992: {},
		768: {},
		576: {}
	}
}
