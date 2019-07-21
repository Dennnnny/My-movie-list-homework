(function () {

  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const dataPanel = document.querySelector('#data-panel')
  const searchForm = document.querySelector('#search')
  const searchInput = document.querySelector('#search-input')
  const searchBtn = document.querySelector('#search-btn')
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []

  const modeButton = document.querySelector('#mode')
  let IsListMode = false
  let nowPage = 1
  // const addFavoriteItem = document.querySelector('.btn-add-favorite')

  axios.get(INDEX_URL)
    .then((response) => {
      data.push(...response.data.results)
      getTotalPages(data)
      getPageData(1, data)
    })
    .catch((err) => console.log(err))

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      // event.target.classList.add('favorite')
      addFavoriteItem(event.target.dataset.id)
      // console.log(event.target.classList)

    }
  })

  searchBtn.addEventListener('click', function () {
    let results = []
    event.preventDefault()
    const regex = new RegExp(searchInput.value, 'i')
    results = data.filter(movie => movie.title.match(regex))
    if (results.length === 0) {
      alert('Nothing found!')
      return
    }
    if (searchInput.value === '') {
      alert('Keywords are necessary!')
      return
    }
    getTotalPages(results)
    getPageData(1, results)
  })

  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    nowPage = event.target.dataset.page
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

  modeButton.addEventListener('click', event => {
    if (event.target.id === 'list-mode') {
      IsListMode = true
      getPageData(nowPage, paginationData)
    } else if (event.target.id === 'card-mode') {
      IsListMode = false
      getPageData(nowPage, paginationData)
    }
  })


  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
      <div class="col-sm-3">
        <div class="card mb-2">
          <img class="card-img-top" src="${POSTER_URL}${item.image}">
            <div class="card-body movie-item-body">
            <h6>${item.title}</h6>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id=${item.id}>More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">&starf;</button>
            </div>
        </div>
      </div>
      `
      dataPanel.innerHTML = htmlContent
    })
  }

  function displayListMode(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="movie-item-body col-sm-9 mt-2 border-top pt-3">
          <h6>${item.title}</h6>
        </div>
        <span class="col-sm-3 mt-2 mb-2 border-top pt-3">
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id=${item.id}>More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">&starf;</button>
        </span>
      `
      dataPanel.innerHTML = htmlContent
    })
  }



  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }


  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    if (!IsListMode) {
      displayDataList(pageData)
    } else {
      displayListMode(pageData)
    }
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)
    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }


})()