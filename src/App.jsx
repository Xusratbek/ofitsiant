import { useState, useEffect } from 'react';
import { db } from './firebase.config';
import { collection, getDocs } from 'firebase/firestore';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // Mahsulotlar ro'yxatini olish
  useEffect(() => {
    let productRef = collection(db, 'products');
    getDocs(productRef).then((res) => {
      let arr = res.docs.map((item) => {
        return { ...item.data(), id: item.id };
      });
      setProducts(arr);
    });
  }, []);

  // Mahsulotni savatga qo'shish yoki miqdorini o'zgartirish
  const handleAddToCart = (productId) => {
    const existingProduct = cart.find((item) => item.id === productId);
    if (existingProduct) {
      // Mahsulot mavjud bo'lsa, miqdorini oshiramiz
      const updatedCart = cart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      // localStorage-ga saqlash
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      // Mahsulotni savatga yangi qo'shamiz
      const product = products.find((item) => item.id === productId);
      const newProduct = { ...product, quantity: 1 };
      const updatedCart = [...cart, newProduct];
      setCart(updatedCart);
      // localStorage-ga saqlash
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  // Savatdan mahsulotni olib tashlash yoki miqdorini kamaytirish
  const handleRemoveFromCart = (productId) => {
    const existingProduct = cart.find((item) => item.id === productId);
    if (existingProduct && existingProduct.quantity > 1) {
      // Mahsulot mavjud bo'lsa va miqdori 1 dan katta bo'lsa
      const updatedCart = cart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      setCart(updatedCart);
      // localStorage-ga saqlash
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else if (existingProduct) {
      // Agar miqdori 1 bo'lsa, mahsulotni savatdan olib tashlash
      const updatedCart = cart.filter((item) => item.id !== productId);
      setCart(updatedCart);
      // localStorage-ga saqlash
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  // Zakazni localStorage-ga saqlash
  const handleSubmitOrder = () => {
    if (cart.length > 0) {
      localStorage.setItem('order', JSON.stringify(cart));
      alert('Zakaz muvaffaqiyatli saqlandi!');
    } else {
      alert('Savat bo\'sh, iltimos mahsulotlarni qo\'shing.');
    }
  };

  // Summani hisoblash
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.productPrice * item.quantity, 0);
  };

  return (
    <div>
      <div style={{ width: '350px', height: '800px', border: '2px solid', borderRadius: '6px' }}>
        <h1 style={{ textAlign: 'center', marginTop: '-6px' }}>Menu</h1>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'space-between',
            padding: '20px',
            marginTop: '-20px',
          }}
        >
          {products.map((item) => (
            <div
              key={item.id}
              style={{
                width: '48%',
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '4px',
                boxSizing: 'border-box',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <img style={{ width: '50px', height: '50px' }} src={item.productImg} alt={item.productName} />
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{item.productName}</p>
              <p style={{ margin: '5px 0', color: '#555' }}>{item.productPrice} so'm</p>

              {/* Mahsulotni qo'shish va kamaytirish tugmalari */}
              <br />
              <br />
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center',
                }}
              >
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  style={{
                    padding: '5px 10px',
                    cursor: 'pointer',
                    backgroundColor: '#ff6347',
                    border: 'none',
                    color: 'white',
                    borderRadius: '4px',
                  }}
                >
                  -
                </button>
                <span>{cart.find((cartItem) => cartItem.id === item.id)?.quantity || 0}</span>
                <button
                  onClick={() => handleAddToCart(item.id)}
                  style={{
                    padding: '5px 10px',
                    cursor: 'pointer',
                    backgroundColor: '#4caf50',
                    border: 'none',
                    color: 'white',
                    borderRadius: '4px',
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmitOrder}
          style={{
            margin: '20px auto',
            display: 'block',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '5px',
          }}
        >
          Zakas berish
        </button>

       <div style={{position:"absolute",top:"10px",left:"400px"}}>
         {/* Savatdagi mahsulotlar va umumiy summa */}
         {cart.length > 0 && (
          <div style={{ padding: '20px' }}>
            <h3>Savat</h3>
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  <img src={item.productImg} alt={item.productName} style={{ width: '30px', height: '30px' }} />
                  <span>{item.productName}</span> - {item.quantity} ta x {item.productPrice} so'm ={' '}
                  {item.productPrice * item.quantity} so'm
                </li>
              ))}
            </ul>
            <h4>Umumiy summa: {calculateTotal()} so'm</h4>
          </div>
        )}

       </div>
      </div>
    </div>
  );
}

export default App;
