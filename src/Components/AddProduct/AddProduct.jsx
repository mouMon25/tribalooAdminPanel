import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    category: "delights",
    new_price: "",
    old_price: ""
  });

  const handleAddProduct = async () => {
    try {
      // 1. Upload image
      const formData = new FormData();
      formData.append('product', image);

      const uploadResponse = await fetch('https://tribaloobackend.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.success) {
        // 2. Add product with image path
        const productResponse = await fetch('https://tribaloobackend.onrender.com/addproduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...productDetails,
            image: uploadData.image // ✅ CORRECTED
          }),
        });

        const productData = await productResponse.json();

        if (productData.success) {
          alert("✅ Product added successfully!");
          setProductDetails({
            name: "",
            description: "",
            category: "delights",
            new_price: "",
            old_price: ""
          });
          setImage(null);
        } else {
          alert("❌ Failed to add product.");
        }
      } else {
        alert("❌ Image upload failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Something went wrong.");
    }
  };

  const handleChange = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="addproduct">
      <h1>Add Product</h1>
      <input name="name" type="text" placeholder="Product name" value={productDetails.name} onChange={handleChange} />
      <input name="description" type="text" placeholder="Product description" value={productDetails.description} onChange={handleChange} />
      <input name="new_price" type="number" placeholder="Offer Price" value={productDetails.new_price} onChange={handleChange} />
      <input name="old_price" type="number" placeholder="Price" value={productDetails.old_price} onChange={handleChange} />
      <select name="category" value={productDetails.category} onChange={handleChange}>
        <option value="delights">Delights</option>
        <option value="crafts">Crafts</option>
        <option value="attires">Clothing</option>
      </select>

      <label htmlFor="image-upload">
        <img src={image ? URL.createObjectURL(image) : upload_area} alt="upload" className="addproduct-img-preview" />
      </label>
      <input id="image-upload" type="file" onChange={(e) => setImage(e.target.files[0])} hidden />

      <button onClick={handleAddProduct}>ADD PRODUCT</button>
    </div>
  );
};

export default AddProduct;
