
let seasonFilter = 'All';
let genderFilter = 'All';


const seasonOptions = document.querySelector('.seasons');
const genderOptions = document.querySelector('.genders');
const searchResultsElem = document.querySelector('.searchResults');
const priceRangeElem = document.querySelector('.priceRange');
const showPriceRangeElem = document.querySelector('.showPriceRange');
const filterElem = document.querySelector('.filter');
const addGarmentElem = document.querySelector('.addGarment');
const garmentsElem = document.querySelector('.garments');
const loginElem = document.querySelector('.login')
const usernameRec = document.querySelector('#username')
const loginBtn = document.querySelector('.loginBtn')
const errorMessage = document.querySelector('.error-message')

const garmentsTemplateText = document.querySelector('.garmentListTemplate');
const garmentsTemplate = Handlebars.compile(garmentsTemplateText.innerHTML);

seasonOptions.addEventListener('click', function(evt){
	seasonFilter = evt.target.value;
	filterData();
});

genderOptions.addEventListener('click', function(evt){
	genderFilter = evt.target.value;
	filterData();
});

function filterData() {
	axios
		.get(`/api/garments?gender=${genderFilter}&season=${seasonFilter}`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('accessToken')
			}
		})
		.then(function(result) {
			console.log(result)
			searchResultsElem.innerHTML = garmentsTemplate({
				garments : result.data.garments
			})
		});
}



priceRangeElem.addEventListener('change', function(evt){
	const maxPrice = evt.target.value;
	showPriceRangeElem.innerHTML = maxPrice;
	axios
		.get(`/api/garments/price/${maxPrice}`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('accessToken')
			}
			})
		.then(function(result) {
			console.log(result.data)
			searchResultsElem.innerHTML = garmentsTemplate({
				garments : result.data.garments
			})
		});
});

function login() {
	axios
		.post(`/auth?username=${username.value}`)
		.then(result => {
			localStorage.setItem('accessToken', result.data.accessToken)
			filterElem.classList.toggle('hidden');
			loginElem.classList.toggle('hidden')
			addGarmentElem.classList.toggle('hidden')
			garmentsElem.classList.remove('hide')
			garmentsElem.classList.toggle('hidden')
			console.log(garmentsElem)
		})
		.catch(err => {
			console.log(err)
			errorMessage.style.display = 'block'
			usernameRec.value = ''
		})
}
loginBtn.addEventListener('click', login)
filterData()
