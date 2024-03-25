import { useEffect, useState } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import CardGuitar from "./components/CardGuitar"
import { db } from "./data/db"

function App() {

  const initalCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [ data ] = useState(db)
  const [ cart, setCart ] = useState(initalCart)
  const MAX_ITEMS = 5

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(item) {
    const itemExists = cart.findIndex(guitar => guitar.id === item.id)
    if(itemExists >= 0) { // carrito items extist
      const updatedCart = [...cart]
      updatedCart[itemExists].quantity++
      setCart(updatedCart)
    } else {
      item.quantity = 1
      setCart(prevCart => [...prevCart, item])
    }
  }

  function removeFromCard(id) {
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map( item => {
      if(item.id === id && item.quantity < MAX_ITEMS) {
        return{
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function decreaseQuantity(id) {
    const updatedCart = cart.map( item => {
      if(item.id === id && item.quantity > 0) {
        return{
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item
    })

    // Verifica si la cantidad del item disminuido es igual a 0 y, de ser así, lo elimina
    const isItemToRemove = updatedCart.find(item => item.id === id && item.quantity === 0);
    if (isItemToRemove) {
      removeFromCard(id);
    } else {
      setCart(updatedCart);
    }
  }

  function cleanCart() {
    setCart([])
  }


  return (
    <>
      <Header
        cart={cart}
        removeFromCard={removeFromCard}
        increaseQuantity={increaseQuantity}
        cleanCart={cleanCart}
        decreaseQuantity={decreaseQuantity}
      />
        <main className="container-xl mt-5">
            <h2 className="text-center">Nuestra Colección</h2>

            <div className="row mt-5">
                {data.map((guitar) => (
                    <CardGuitar
                      key={guitar.id}
                      guitar={guitar}
                      setCart={setCart}
                      addToCart={addToCart}
                    />
                  )
                )}
            </div>
        </main>
      <Footer/>
    </>
  )
}

export default App
