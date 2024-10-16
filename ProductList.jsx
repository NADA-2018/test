import React, { useEffect, useState } from 'react';
import ProductCard, { Header } from '../components/ProductCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/esm/Col';
import Accordion from 'react-bootstrap/Accordion';
import AccordionItem from 'react-bootstrap/esm/AccordionItem';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const categories = ['Mirrors', 'Chairs', 'Tables', 'Pillows', 'Clocks', 'Sofas', 'Bedroom', 'Living Room'];

  // دالة لجلب البيانات
  const fetchProducts = async (selectedCategory, min, max) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/products?category=${selectedCategory}&minPrice=${min}&maxPrice=${max}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // UseEffect لجلب المنتجات عند تحميل المكون
  useEffect(() => {
    fetchProducts(category, minPrice, maxPrice);
  }, [category, minPrice, maxPrice]);

  const handleShowAll = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    fetchProducts('', '', '');
  };

  const handleCategoryChange = (item) => {
    setCategory(item);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Header />
      <div className='all'>
        <h5>Home</h5>
        <h5 onClick={handleShowAll}> - ALL Collection - </h5>
        <h5>Furniture</h5>
      </div>
      <Row>
        <Col md={3}>
          <div className='filter-section'>
            <h3>Filter:</h3>
            <Accordion defaultActiveKey={['0']} alwaysOpen flush>
              <AccordionItem eventKey='0' style={{ backgroundColor: 'rgb(45, 45, 45)' }}>
                <AccordionHeader>Category</AccordionHeader>
                <AccordionBody className='cat'>
                  {categories.map((item) => (
                    <h5
                      key={item}
                      onClick={() => handleCategoryChange(item)}
                      className={category === item ? 'active-category' : ''}
                    >
                      {item}
                    </h5>
                  ))}
                </AccordionBody>
              </AccordionItem>
              <AccordionItem eventKey='1' style={{ backgroundColor: 'rgb(45, 45, 45)' }}>
                <AccordionHeader>Price Range</AccordionHeader>
                <AccordionBody>
                  <div>
                    <label>
                      Min Price:
                      <input
                        type='number'
                        value={minPrice}
                        onChange={handleMinPriceChange}
                      />
                    </label>
                    <label>
                      Max Price:
                      <input
                        type='number'
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                      />
                    </label>
                  </div>
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          </div>
        </Col>
        <Col md={9}>
          <Row xs={1} md={2} lg={3} className="g-1">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default ProductList;
