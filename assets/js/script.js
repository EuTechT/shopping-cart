class Product {
  constructor(id, name, price, urlImg, amount) {
    this.id = id
    this.name = name
    this.price = this.setPrice(price)
    this.urlImg = urlImg
    this.amount = amount
  }

  getId() {
    return this.id
  }

  setId(id) {
    this.id = id
  }

  getName() {
    return this.name
  }

  setName(name) {
    this.name = name
  }

  getPrice() {
    if (this.price === 0) {
      return this.price
    }
    return this.price.toFixed(3)
  }

  setPrice(price) {
    this.price = Number(price.toFixed(3))
    return this.price
  }

  getUrlImg() {
    return this.urlImg
  }

  setUrlImg(urlImg) {
    this.urlImg = urlImg
  }

  getAmount() {
    return this.amount
  }

  setAmount(amount) {
    this.amount = amount
  }
}

class Cart {
  constructor() {
    this.totalPrice = 0
    this.amount = 0
    this.products = []
  }

  getProducts() {
    return this.products
  }

  getProductIndex(product) {
    return this.products.findIndex(p => {
      if (p.getId() === product.getId()) {
        return true
      }
    })
  }
  
  getProductById(id) {
    return this.products.find(product => {
      return product.getId() === id
    })
  }

  addProduct(product) {
    const index = this.getProductIndex(product)
    if (index != -1) {
      this.products[index].amount += product.getAmount()
      this.totalPrice += product.getPrice() * product.getAmount()
      this.amount += product.getAmount()
      return true
    }

    this.products.push(product)
    this.totalPrice += product.getPrice() * product.getAmount()
    this.amount += product.getAmount()
    return true
  }

  getTotalPrice() {
    if (this.totalPrice === 0) {
      return this.totalPrice
    }
    return this.totalPrice.toFixed(3)
  }

  getAmount() {
    return this.amount
  }

  deleteProduct(product) {
    const index = this.getProductIndex(product)
    
    if (index != -1) {
      const newPrice = this.getTotalPrice() - (this.products[index].getPrice() * this.products[index].getAmount())
      this.totalPrice = newPrice
      const newAmount = this.getAmount() - this.products[index].getAmount()
      this.amount = newAmount
      this.products.splice(index, 1)
      return true
    }

    return false
  }

  updateAmount(product, amount) {
    const index = this.getProductIndex(product)

    if (index != -1) {
      if (amount == 0) {
        this.deleteProduct(product)
      } else if (amount > 0) {
        this.totalPrice -= this.products[index].getPrice() * this.products[index].getAmount()
        this.amount -= this.products[index].getAmount()
        this.products[index].setAmount(amount)
        this.amount += amount
        this.totalPrice += this.products[index].getPrice() * this.products[index].getAmount()
      } else {
        return false
      }
    }

    return false
  }
}

const cart = new Cart()

const cartAmount = document.querySelector('#btn-cart__amount')
const btnAddProductList = document.querySelectorAll('.add-to-cart')
const btnViewCart = document.querySelector('#btn-cart')
const modal = document.querySelector('#modal')
const btnCloseModal = document.querySelector('#modal__close')
const modalCart = document.querySelector('#cart')

btnAddProductList.forEach(btn => {
  btn.addEventListener('click', e => {
    const divProduct = btn.parentElement.parentElement
    const urlImg = divProduct.querySelector('.product__img').src
    const id = divProduct.querySelector('.product__id').value
    const name = divProduct.querySelector('.product__name').textContent
    const price = Number(
      divProduct.querySelector('.product__price').textContent
    )
    const amount = 1
    const product = new Product(id, name, price, urlImg, amount)
    cart.addProduct(product)
    updateAmountOfProduct()
    e.stopPropagation()
  })
})

btnViewCart.addEventListener('click', e => {
  const products = cart.getProducts()
  modalCart.innerHTML = ''
  products.forEach(product => {
    const cardProduct =  createProduct(product)
    modalCart.appendChild(cardProduct)
  })

  updateCartInfo()

  modal.classList.add('show')

  setRemoveFromCartBtns()
  setAmountInputs()
  e.stopPropagation()
})

btnCloseModal.addEventListener('click', e => {
  modal.classList.remove('show')
})

function setAmountInputs() {
  const productAmountList = document.querySelectorAll('.product__amount')
  
  productAmountList.forEach(input => {
    input.addEventListener('change', e => {
      const divProduct = input.parentElement.parentElement
      const id = divProduct.querySelector('.product__id').value
      cart.updateAmount(cart.getProductById(id), Number(input.value))
      updateCartInfo()
      updateAmountOfProduct()
      e.stopPropagation()
    })
  })
}

function updateAmountOfProduct() {
  cartAmount.textContent = cart.getAmount()
}

function setRemoveFromCartBtns() {
  const btnRemoveFromCartList = document.querySelectorAll('.remove-from-cart')

  btnRemoveFromCartList.forEach(btn => {
    btn.addEventListener('click', e => {
      const divProduct = btn.parentElement
      const id = divProduct.querySelector('.product__id').value
      modalCart.removeChild(divProduct)
      cart.deleteProduct(cart.getProductById(id))
      updateCartInfo()
      updateAmountOfProduct()
    })
  })
}

function updateCartInfo() {
  const cartInfoAmount = document.querySelector('#cart-info__amount')
  cartInfoAmount.textContent = cart.getAmount()
  const cartInfoTotalPrice = document.querySelector('#cart-info__total-price')
  cartInfoTotalPrice.textContent = cart.getTotalPrice()
}


function createProduct(product) {
  const cardProduct = document.createElement('div')
  cardProduct.className = 'cart__product'
  const divImg = document.createElement('div')
  divImg.className = 'img'
  const divInfo = document.createElement('div')
  divInfo.className = 'info'
  const divAmount = document.createElement('div')
  divAmount.className = 'amount'

  const img = document.createElement('img')
  img.className = 'product__img'
  img.src = product.getUrlImg()
  divImg.appendChild(img)

  const inputId = document.createElement('input')
  inputId.type = 'hidden'
  inputId.className = 'product__id'
  inputId.value = product.getId()
  divInfo.appendChild(inputId)

  const h2 = document.createElement('h2')
  h2.className = 'product__name'
  h2.textContent = product.getName()
  divInfo.appendChild(h2)

  const p = document.createElement('p')
  p.className = 'product__price'
  p.textContent = product.getPrice()
  divInfo.appendChild(p)

  const inputAmount = document.createElement('input')
  inputAmount.className = 'product__amount'
  inputAmount.type = 'number'
  inputAmount.min = 1
  inputAmount.value = product.getAmount()
  divAmount.appendChild(inputAmount)

  const button = document.createElement('button')
  button.className = 'remove-from-cart'
  const span = document.createElement('span')
  span.className = 'material-icons'
  span.textContent = 'delete'
  button.appendChild(span)

  cardProduct.appendChild(divImg)
  cardProduct.appendChild(divInfo)
  cardProduct.appendChild(divAmount)
  cardProduct.appendChild(button)

  return cardProduct
}
