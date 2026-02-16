
const header = document.querySelector('header');
const headerActions = document.querySelector('header .header-actions');

// 1. Ekran o'lchamini tekshirish funksiyasi
function handleTabletChange(e) {
	// Faqat element mavjud bo'lsa va ekran 768px dan katta bo'lsa
	if (headerActions && e.matches) {
		console.log('Katta ekran tartibi faol');
		// Katta ekran uchun kerakli boshlang'ich stillar (ixtiyoriy)
		headerActions.style.position = 'unset';
	}
}

const mediaQuery = window.matchMedia('(min-width: 769px)');
mediaQuery.addListener(handleTabletChange);
handleTabletChange(mediaQuery);

// 2. Skroll mantiqi
let lastScrollTop = 0;
const scrollThreshold = 40;

window.addEventListener('scroll', () => {
	// Agar sahifada header bo'lmasa, kodni to'xtatish (error chiqmasligi uchun)
	if (!header) return;

	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

	// 40px ga yetmaguncha boshlang'ich holatda tursin
	if (scrollTop <= scrollThreshold) {
		header.classList.remove('header-open');
		header.style.top = '0';
		lastScrollTop = scrollTop;
		return;
	}

	if (scrollTop < lastScrollTop) {
		// TEPAGA SCROLL
		header.classList.add('header-open');
		header.style.top = '0';

		// HeaderActions faqat katta ekranlarda unset bo'lsin
		if (headerActions && window.innerWidth > 768) {
			headerActions.style.position = 'unset';
		}
	} else {
		// PASTGA SCROLL
		header.classList.remove('header-open');
		header.style.top = '-60px';

		// HeaderActions faqat katta ekranlarda fixed bo'lsin
		if (headerActions && window.innerWidth > 768) {
			headerActions.style.position = 'fixed';
			headerActions.style.top = '15px';
		}
	}

	lastScrollTop = scrollTop;
});


document.addEventListener('DOMContentLoaded', () => {

	document.querySelectorAll('.shiny-text').forEach(el => {
		const speed = Number(el.dataset.speed || 2) * 1000;
		const delay = Number(el.dataset.delay || 0) * 1000;
		const yoyo = el.dataset.yoyo === 'true';
		const pauseOnHover = el.dataset.pauseOnHover === 'true';
		const direction = el.dataset.direction === 'left' ? 1 : -1;

		let progress = 0;
		let startTime = null;
		let paused = false;
		let lastDirection = direction;

		function animate(time) {
			if (paused) {
				startTime = null;
				requestAnimationFrame(animate);
				return;
			}

			if (!startTime) startTime = time;
			const elapsed = time - startTime;

			if (yoyo) {
				const cycle = (speed + delay) * 2;
				const t = elapsed % cycle;

				if (t < speed) {
					progress = (t / speed) * 100;
				} else if (t < speed + delay) {
					progress = 100;
				} else if (t < speed * 2 + delay) {
					progress = 100 - ((t - speed - delay) / speed) * 100;
				} else {
					progress = 0;
				}
			} else {
				const cycle = speed + delay;
				const t = elapsed % cycle;

				if (t < speed) {
					progress = (t / speed) * 100;
				} else {
					progress = 100;
				}
			}

			const p = lastDirection === 1 ? progress : 100 - progress;
			const bgPos = 150 - p * 2;

			el.style.backgroundPosition = `${bgPos}% center`;

			requestAnimationFrame(animate);
		}

		if (pauseOnHover) {
			el.addEventListener('mouseenter', () => paused = true);
			el.addEventListener('mouseleave', () => paused = false);
		}

		requestAnimationFrame(animate);
	});

	// =================== about slider 
	const aboutSection = document.querySelector('.about');
	let aboutInitialized = false;

	if (aboutSection) {
		if (window.innerWidth > 768) {



			const aboutObserver = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting && !aboutInitialized) {
						aboutInitialized = true;
						initAboutSlider();
					}
				});
			}, { threshold: 0.1 });

			aboutObserver.observe(aboutSection);

			function initAboutSlider() {

				const aboutSwiper = new Swiper('.about .swiper', {
					slidesPerView: 1,
					spaceBetween: 40,
					breakpoints: {
						769: {
							slidesPerView: 3,
							spaceBetween: 24,
							allowTouchMove: false
						}
					}
				});


				const items = document.querySelectorAll('.about .item');
				const lines = document.querySelectorAll('.about .line');
				let currentIndex = 0;
				let interval;

				function setActive(index) {
					items.forEach((item, i) => {
						item.classList.remove('active');
						lines[i].style.width = '0%';
					});

					items[index].classList.add('active');
					aboutSwiper.slideTo(index);

					lines[index].style.transition = 'width 6s linear';
					lines[index].style.width = '100%';

					clearInterval(interval);
					interval = setTimeout(() => {
						currentIndex = (index + 1) % items.length;
						setActive(currentIndex);
					}, 6000);
				}

				items.forEach((item, index) => {
					item.addEventListener('click', () => {
						currentIndex = index;
						setActive(index);
					});
				});

				setActive(currentIndex);
			}
		}
	}

	//  ================================ companies slider + dragging

	document.querySelectorAll('.partners .track').forEach(track => {
		track.innerHTML += track.innerHTML; // Kontentni ikkilantiradi
	});


	//  ============================================= keys section
	const keysSection = document.getElementById('case');
	const keysVideos = document.querySelectorAll('#case video');

	if (keysSection && keysVideos.length) {
		const observer = new IntersectionObserver(([entry]) => {
			keysVideos.forEach(video => {
				if (!video) return;

				if (entry.isIntersecting) {
					video.muted = true;
					video.play().catch(() => { });
				} else {
					video.pause();
				}
			});
		}, {
			rootMargin: "0px 0px -200px 0px"
		});

		observer.observe(keysSection);
	}
	AOS.init({
		disable: function () {
			var maxWidth = 768;
			return window.innerWidth < maxWidth;
		}
	});


	//  ================== hide description ===


	const el = document.querySelector('.testimonialSwiper');

	if (el) {
		const swiper = new Swiper(el, {
			slidesPerView: 1,
			spaceBetween: 30,
			grabCursor: true,
			autoHeight: true,
			speed: 600,

			// REWIND: true - bu oxiriga borganda boshiga, boshiga borganda oxiriga qaytaradi
			// Bu klonlar yaratmaydi, shuning uchun "Весь отзыв" funksiyasi buzilmaydi
			rewind: true,

			navigation: {
				nextEl: '.testimonial .next',
				prevEl: '.testimonial .prev',
			},

			on: {
				// Slayd o'zgarganda har doim balandlikni yangilash
				slideChange: function () {
					this.updateAutoHeight(300);
				}
			}
		});

		// "Весь отзыв" (Expand) funksiyasi
		el.addEventListener('click', (e) => {
			const btn = e.target.closest('.viewAll-description');
			if (!btn) return;

			const desc = btn.previousElementSibling;
			desc.classList.toggle('expanded');
			btn.textContent = desc.classList.contains('expanded') ? 'Скрыть' : 'Весь отзыв';

			// Matn ochilganda balandlikni silliq moslashtirish
			setTimeout(() => swiper.updateAutoHeight(300), 50);
		});
	}
	// =====


	// 

	const WORDS_TO_SHOW2 = 12;
	const WORDS_TO_SHOW3 = 8;
	const blocks2 = document.querySelectorAll('.blog-section');
	blocks2.forEach(block => {
		const descriptions = block.querySelectorAll('.item-description');
		const title = block.querySelectorAll('.item-title');
		descriptions.forEach(description => {
			const fullText = description.textContent.trim();

			// 2 qatordan oshsa ... qo'yish
			description.style.overflow = 'hidden';
			description.style.display = '-webkit-box';
			description.style.webkitLineClamp = '2';
			description.style.webkitBoxOrient = 'vertical';
			description.style.cursor = 'pointer';

			description.dataset.truncated = 'true';
			description.dataset.fullText = fullText;

			description.addEventListener('click', () => {
				if (description.dataset.truncated === 'true') {
					description.style.webkitLineClamp = 'unset';
					description.dataset.truncated = 'false';
				} else {
					description.style.webkitLineClamp = '2';
					description.dataset.truncated = 'true';
				}
			});
		});
		title.forEach(description => {
			const fullText = description.textContent.trim();

			// 2 qatordan oshsa ... qo'yish
			description.style.overflow = 'hidden';
			description.style.display = '-webkit-box';
			description.style.webkitLineClamp = '2';
			description.style.webkitBoxOrient = 'vertical';
			description.style.cursor = 'pointer';

			description.dataset.truncated = 'true';
			description.dataset.fullText = fullText;

			description.addEventListener('click', () => {
				if (description.dataset.truncated === 'true') {
					description.style.webkitLineClamp = 'unset';
					description.dataset.truncated = 'false';
				} else {
					description.style.webkitLineClamp = '2';
					description.dataset.truncated = 'true';
				}
			});
		});
	});


	// ============
	const blogSwiperElement = document.querySelector('.header_container .blogSwiper');

	if (blogSwiperElement) {
		const blogSwiper = new Swiper('.header_container .blogSwiper', {
			slidesPerView: 'auto',
			spaceBetween: 12,
			slidesOffsetAfter: 24,

			navigation: {
				nextEl: '.blog-section .next',
				prevEl: '.blog-section .prev',
			},

			// --- YANGI QO'SHILGAN QISM: Events ---
			on: {
				// Slayd har safar o'zgarganda tekshiramiz
				slideChange: function () {
					checkButtons(this);
				},
				// Swiper yuklanganda ham tekshiramiz
				init: function () {
					checkButtons(this);
				}
			},
			// --------------------------------------

			breakpoints: {
				320: {
					spaceBetween: 12,
				},
				768: {
					spaceBetween: 24,
					slidesOffsetAfter: 0
				},
				1300: {
					spaceBetween: 24,
					slidesOffsetAfter: 0
				}
			}
		});

		// Tugmalarni disabled qilish funksiyasi
		function checkButtons(swiper) {
			const nextBtn = document.querySelector('.blog-section .next');
			const prevBtn = document.querySelector('.blog-section .prev');

			if (nextBtn) {
				// Agar oxirida bo'lsa disabled qilamiz
				if (swiper.isEnd) {
					nextBtn.setAttribute('disabled', 'true');
					nextBtn.classList.add('disabled'); // Ixtiyoriy
				} else {
					nextBtn.removeAttribute('disabled');
					nextBtn.classList.remove('disabled');
				}
			}

			if (prevBtn) {
				// Agar boshida bo'lsa disabled qilamiz
				if (swiper.isBeginning) {
					prevBtn.setAttribute('disabled', 'true');
					prevBtn.classList.add('disabled');
				} else {
					prevBtn.removeAttribute('disabled');
					prevBtn.classList.remove('disabled');
				}
			}
		}
	}



	const burgerBtns = document.querySelectorAll('.burgerMenuIcon');
	const burgerModal = document.querySelector('.burgerMenu-modal');
	const headerElement = document.querySelector('header');

	burgerBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			// Ikonkalarni almashtirish (Active klassi orqali)
			burgerBtns.forEach(b => b.classList.toggle('active'));

			// Modalni ochish/yopish
			if (burgerModal.classList.contains('modal-open')) {
				burgerModal.classList.remove('modal-open');
				headerElement.classList.remove('modal-opened');
			} else {
				burgerModal.classList.add('modal-open');
				headerElement.classList.add('modal-opened');
			}
		});
	});





});
// ======================= contact modal
const closeContactModal = document.querySelector('.contact-modal .close')
const contactModal = document.querySelector('.contact-modal')

function ContactsModal() {
	contactModal.classList.add('openContact-modal')
}

closeContactModal.addEventListener('click', () => {
	contactModal.classList.remove('openContact-modal')
})

const formModal = document.getElementById('modal-contactForm');
const success = document.querySelector('#modal-contactForm #successMessage');

formModal.addEventListener('submit', function (e) {
	e.preventDefault();

	const phoneBlock = document.querySelector("#phoneBlock");
	const modalinput = document.querySelector("#Modalphone");
	const phoneValue = modalinput.value.trim().replace(/\D/g, '');
	const country = window.itiInstance.getSelectedCountryData().iso2;

	const requiredLengths = {
		uz: 12, ru: 11, by: 12, kz: 11, pl: 11, lt: 11
	};

	const requiredLength = requiredLengths[country];
	const isValid = phoneValue.length === requiredLength;

	if (isValid) {
		// 1. Validatsiya ko'rinishi
		phoneBlock.classList.remove('error');
		phoneBlock.classList.add('valid');
		success.style.display = 'block';

		// --- INPUTLARNI TOZALASH QISMI ---

		// 2. Formani tozalash (barcha input, textarea va selectlar)
		formModal.reset();

		// 3. Floating label'larni joyiga qaytarish
		const allLabels = formModal.querySelectorAll('.floating-block label');
		allLabels.forEach(label => {
			label.classList.remove('active');
		});

		// 4. Valid/Error klasslarini tozalash
		const allBlocks = formModal.querySelectorAll('.floating-block, #phoneBlock');
		allBlocks.forEach(block => {
			block.classList.remove('valid', 'error');
		});

		// 5. intl-tel-input ni boshlang'ich holatga qaytarish (Belarus defoult bo'lsa)
		if (window.itiInstance) {
			window.itiInstance.setCountry("by"); // Belarusni qayta o'rnatish
			modalinput.value = ""; // Inputni bo'shatish
		}

		// 6. Xabarni 3 soniyadan keyin yashirish (ixtiyoriy)
		setTimeout(() => {
			success.style.display = 'none';
		}, 3000);

	} else {
		phoneBlock.classList.remove('valid');
		phoneBlock.classList.add('error');
		success.style.display = 'none';
	}
});

const floatblocks = document.querySelectorAll('.floating-block');

floatblocks.forEach(block => {
	const input = block.querySelector('input');
	const textarea = block.querySelector('textarea');
	const label = block.querySelector('label');

	const field = input || textarea;
	if (!field || !label) return;

	field.addEventListener('focus', () => {
		label.classList.add('active');
	});

	field.addEventListener('blur', () => {
		if (!field.value.trim()) {
			label.classList.remove('active');
		}
	});
});

// ISM VALIDATSIYASI
const nameInput = document.querySelector('.floating-block input[type="text"]:not(#Modalphone)');
const nameBlock = nameInput ? nameInput.closest('.floating-block') : null;

if (nameInput && nameBlock) {
	function validateName() {
		const value = nameInput.value.trim();

		if (!value) {
			nameBlock.classList.remove('error', 'valid');
			return;
		}

		// 4 ta harfdan ko'p bo'lsa valid
		if (value.length > 4) {
			nameBlock.classList.remove('error');
			nameBlock.classList.add('valid');
		} else {
			nameBlock.classList.remove('valid');
			nameBlock.classList.add('error');
		}
	}

	let nameValidationTimeout;

	nameInput.addEventListener('input', function () {
		clearTimeout(nameValidationTimeout);
		nameValidationTimeout = setTimeout(validateName, 300);
	});

	nameInput.addEventListener('blur', validateName);
}

// TELEFON VALIDATSIYASI
const modalinput = document.querySelector("#Modalphone");
const phoneBlock = document.querySelector("#phoneBlock");

if (modalinput) {
	const iti = window.intlTelInput(modalinput, {
		onlyCountries: ["by", "kz", "lt", "pl", "ru", "uz"],
		preferredCountries: ["uz", "by", "ru", "kz", "pl", "lt"],
		localizedCountries: {
			uz: "Узбекистан",
			ru: "Россия",
			kz: "Казахстан",
			by: "Беларусь",
			pl: "Польша",
			lt: "Литва"
		},
		autoPlaceholder: "aggressive",
		formatOnDisplay: true,
		nationalMode: false,
		separateDialCode: false
	});

	window.itiInstance = iti;

	// INPUT MASK
	const masks = {
		uz: "+### ## ### ## ##",
		ru: "+# (###) ###-##-##",
		by: "+### (##) ###-##-##",
		kz: "+# (###) ###-##-##",
		pl: "+## ### ### ###",
		lt: "+### (###) #####"
	};

	// Har bir davlat uchun kerakli raqamlar soni
	const requiredLengths = {
		uz: 12, // +998 + 9 raqam
		ru: 11, // +7 + 10 raqam
		by: 12, // +375 + 9 raqam
		kz: 11, // +7 + 10 raqam
		pl: 11, // +48 + 9 raqam
		lt: 11  // +370 + 8 raqam
	};

	function applyMask(value, mask) {
		let result = '';
		let valueIndex = 0;

		for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
			if (mask[i] === '#') {
				result += value[valueIndex];
				valueIndex++;
			} else {
				result += mask[i];
			}
		}

		return result;
	}

	modalinput.addEventListener('input', function (e) {
		let value = modalinput.value.replace(/\D/g, '');
		const country = iti.getSelectedCountryData().iso2;
		const mask = masks[country];

		if (mask && value) {
			const formatted = applyMask(value, mask);
			modalinput.value = formatted;
		}
	});

	// Faqat raqamlar
	modalinput.addEventListener('keypress', function (e) {
		if (!/[0-9]/.test(e.key) && e.key !== '+') {
			e.preventDefault();
		}
	});

	// Telefon validatsiya
	function validatePhone() {
		const value = modalinput.value.trim().replace(/\D/g, '');

		if (!value) {
			phoneBlock.classList.remove('error', 'valid');
			return;
		}

		const country = iti.getSelectedCountryData().iso2;
		const requiredLength = requiredLengths[country];

		// Tanlangan davlat uchun to'liq raqam kiritilgan bo'lishi kerak
		const isValid = value.length === requiredLength;

		if (isValid) {
			phoneBlock.classList.remove('error');
			phoneBlock.classList.add('valid');
		} else {
			phoneBlock.classList.remove('valid');
			phoneBlock.classList.add('error');
		}
	}

	let validationTimeout;

	modalinput.addEventListener('input', function () {
		clearTimeout(validationTimeout);
		validationTimeout = setTimeout(validatePhone, 300);
	});

	modalinput.addEventListener('blur', validatePhone);

	// Davlat o'zgarganda validatsiya
	modalinput.addEventListener('countrychange', function () {
		setTimeout(validatePhone, 100);
	});

	setTimeout(() => {
		const searchInput = document.querySelector('.iti__search-input');
		if (searchInput) searchInput.placeholder = 'Выберите страну';
	}, 100);
}

document.querySelectorAll('.shorter-text').forEach(p => {
	p.addEventListener('click', () => {
		p.classList.toggle('open');
	});
});

const cookieBanner = document.getElementById("cookie-banner");
const acceptBtn = document.getElementById("cookie-accept");
const closeBtn = document.getElementById("cookie-close");

// 1. LocalStorage-ni tekshiramiz
// Agar oldin "Понятно" bosilmagan bo'lsa, bannerni ko'rsatamiz
if (cookieBanner) {

	if (localStorage.getItem("cookieAccepted") !== "true") {
		cookieBanner.classList.add("active");
	}

	// 2. "Понятно" tugmasi - LocalStorage-ga saqlaydi va yopadi
	acceptBtn.addEventListener("click", function () {
		cookieBanner.classList.remove("active");
		localStorage.setItem("cookieAccepted", "true");
	});

	// 3. "Close" (X) tugmasi - Shunchaki yopadi, saqlamaydi
	closeBtn.addEventListener("click", function () {
		cookieBanner.classList.remove("active");
		// Bu yerda LocalStorage-ga hech nima yozilmaydi
	});
}
// ======================================/


const wrapper = document.querySelector('.custom-select-wrapper');
const trigger = document.querySelector('.select-trigger');
const options = document.querySelectorAll('.option');
const realSelect = document.getElementById('contactSelect');

trigger.addEventListener('click', () => {
	wrapper.classList.toggle('active'); // Klassni qo'shish/olish
	const container = document.querySelector('.options-container');
	container.style.display = container.style.display === 'block' ? 'none' : 'block';
});

options.forEach(opt => {
	opt.addEventListener('click', () => {
		const val = opt.getAttribute('data-value');
		const text = opt.innerText;

		realSelect.value = val;
		trigger.innerText = text;

		// Tanlangandan keyin matn tepada qolishi uchun 'active' klassini saqlab qolamiz
		wrapper.classList.add('active');
		document.querySelector('.options-container').style.display = 'none';
	});
});

// Agar tashqariga bosilsa yopish logikasi
document.addEventListener('click', (e) => {
	if (!wrapper.contains(e.target)) {
		if (realSelect.value === "") {
			wrapper.classList.remove('active');
		}
		document.querySelector('.options-container').style.display = 'none';
	}
});